#!/usr/bin/env bash
# Create or update the portfolio analytics stack (idempotent): DynamoDB table, IAM role, Lambda, public Function URL.
#   AWS_PROFILE=portfolio ./aws/portfolio-analytics/deploy.sh
# Dashboard password: read from ~/.portfolio-secrets/analytics-dashboard-password (created with a random value if missing);
# only its SHA-256 is sent to AWS. Prints the Function URL at the end — put it in assets/js/analytics.js.
# Cost: DynamoDB provisioned 5 RCU / 5 WCU and Lambda at this traffic are inside AWS's always-free tier.
set -euo pipefail
REGION="${AWS_REGION:-us-west-2}"; TABLE=portfolio-visits; FN=portfolio-analytics; ROLE=portfolio-analytics-lambda
ORIGINS='["https://pradeepreddyvv.github.io","http://localhost:8000"]'
DIR="$(cd "$(dirname "$0")" && pwd)"; SECRET_DIR="$HOME/.portfolio-secrets"; PW_FILE="$SECRET_DIR/analytics-dashboard-password"
aws() { command aws --region "$REGION" "$@"; }

mkdir -p "$SECRET_DIR"; chmod 700 "$SECRET_DIR"
[ -s "$PW_FILE" ] || { (umask 077; openssl rand -base64 18 | tr -d '/+=' > "$PW_FILE"); echo "New dashboard password saved to $PW_FILE"; }
PW_HASH=$(tr -d '\n' < "$PW_FILE" | shasum -a 256 | cut -d' ' -f1)
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)

echo "1/4 DynamoDB table $TABLE"
if ! aws dynamodb describe-table --table-name "$TABLE" >/dev/null 2>&1; then
  aws dynamodb create-table --table-name "$TABLE" --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH --billing-mode PROVISIONED --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --tags Key=project,Value=portfolio >/dev/null
  aws dynamodb wait table-exists --table-name "$TABLE"
  aws dynamodb update-continuous-backups --table-name "$TABLE" --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true >/dev/null || true
fi

echo "2/4 IAM role $ROLE"
if ! aws iam get-role --role-name "$ROLE" >/dev/null 2>&1; then
  aws iam create-role --role-name "$ROLE" --assume-role-policy-document \
    '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
  aws iam attach-role-policy --role-name "$ROLE" --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  sleep 10 # new roles take a few seconds before Lambda can assume them
fi
aws iam put-role-policy --role-name "$ROLE" --policy-name visits-table --policy-document \
  "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"dynamodb:PutItem\",\"dynamodb:Scan\"],\"Resource\":\"arn:aws:dynamodb:$REGION:$ACCOUNT:table/$TABLE\"}]}"

echo "3/4 Lambda $FN"
ZIP="$(mktemp -d)/fn.zip"; (cd "$DIR/lambda" && zip -q "$ZIP" index.mjs)
ENV="Variables={TABLE_NAME=$TABLE,DASHBOARD_PASSWORD_SHA256=$PW_HASH}"
if aws lambda get-function --function-name "$FN" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$FN" --zip-file "fileb://$ZIP" >/dev/null
  aws lambda wait function-updated --function-name "$FN"
  aws lambda update-function-configuration --function-name "$FN" --environment "$ENV" >/dev/null
else
  aws lambda create-function --function-name "$FN" --runtime nodejs22.x --architectures arm64 --handler index.handler \
    --memory-size 128 --timeout 10 --role "arn:aws:iam::$ACCOUNT:role/$ROLE" --zip-file "fileb://$ZIP" --environment "$ENV" \
    --tags project=portfolio >/dev/null
  aws logs create-log-group --log-group-name "/aws/lambda/$FN" 2>/dev/null || true
  aws logs put-retention-policy --log-group-name "/aws/lambda/$FN" --retention-in-days 30 || true
fi
aws lambda wait function-updated --function-name "$FN"

echo "4/4 Function URL"
CORS="{\"AllowOrigins\":$ORIGINS,\"AllowMethods\":[\"GET\",\"POST\"],\"AllowHeaders\":[\"content-type\",\"x-dashboard-password\"],\"MaxAge\":86400}"
if aws lambda get-function-url-config --function-name "$FN" >/dev/null 2>&1; then
  aws lambda update-function-url-config --function-name "$FN" --cors "$CORS" >/dev/null
else
  aws lambda create-function-url-config --function-name "$FN" --auth-type NONE --cors "$CORS" >/dev/null
  aws lambda add-permission --function-name "$FN" --statement-id public-url --action lambda:InvokeFunctionUrl \
    --principal '*' --function-url-auth-type NONE >/dev/null
  aws lambda add-permission --function-name "$FN" --statement-id public-url-invoke --action lambda:InvokeFunction \
    --principal '*' --invoked-via-function-url >/dev/null 2>&1 || true
fi
URL=$(aws lambda get-function-url-config --function-name "$FN" --query FunctionUrl --output text)
echo "Done. Function URL: $URL"
