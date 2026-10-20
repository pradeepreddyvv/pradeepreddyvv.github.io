// Portfolio analytics API (AWS Lambda + Function URL + DynamoDB). Replaces the Supabase "visits" table.
//   POST /visit   — record one page view (public; fields are whitelisted and trimmed, time + IP come from the server)
//   GET  /visits  — every visit, newest first (dashboard only: header x-dashboard-password, checked against a SHA-256 hash)
// CORS is handled by the Function URL config (deploy.sh), so this code never sets CORS headers itself.
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

const FIELDS = { fingerprint: 64, city: 100, region: 100, country: 100, country_code: 4, timezone: 64, page: 200, referrer: 500, user_agent: 400, screen_resolution: 20 };
const MAX_BODY = 4096;

const json = (statusCode, body) => ({ statusCode, headers: { "content-type": "application/json", "cache-control": "no-store" }, body: JSON.stringify(body) });
const clean = (v, max) => typeof v === "string" ? v.replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, max) || null : null;
const num = v => typeof v === "number" && Number.isFinite(v) ? v : null;

export function visitFrom(body, { ip, now = new Date(), id = randomUUID() } = {}) {
  const item = { id, visited_at: now.toISOString(), ip: ip || null, latitude: num(body.latitude), longitude: num(body.longitude) };
  for (const [k, max] of Object.entries(FIELDS)) item[k] = clean(body[k], max);
  item.city ??= "Unknown"; item.region ??= "Unknown"; item.country ??= "Unknown"; item.country_code ??= "--";
  return item;
}

export function passwordOk(given, hashHex) {
  if (!given || !hashHex) return false;
  const a = createHash("sha256").update(String(given)).digest(), b = Buffer.from(hashHex, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** `db` = { put(item), scanAll() } so tests can run without AWS. */
export function createHandler(db, env = process.env) {
  return async event => {
    const method = event.requestContext?.http?.method, path = (event.rawPath || "/").replace(/\/+$/, "") || "/";
    try {
      if (method === "POST" && path === "/visit") {
        const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString() : event.body || "";
        if (raw.length > MAX_BODY) return json(413, { error: "Too large" });
        let body; try { body = JSON.parse(raw || "{}"); } catch { return json(400, { error: "Bad JSON" }); }
        if (!body || typeof body !== "object") return json(400, { error: "Bad JSON" });
        await db.put(visitFrom(body, { ip: event.requestContext?.http?.sourceIp }));
        return { statusCode: 204, body: "" };
      }
      if (method === "GET" && path === "/visits") {
        if (!passwordOk(event.headers?.["x-dashboard-password"], env.DASHBOARD_PASSWORD_SHA256)) return json(401, { error: "Wrong password" });
        const visits = (await db.scanAll()).sort((a, b) => String(b.visited_at).localeCompare(String(a.visited_at)));
        return json(200, { visits });
      }
      return json(404, { error: "Not found" });
    } catch (e) {
      console.error("analytics error", String(e).slice(0, 300));
      return json(500, { error: "Server error" });
    }
  };
}

let realDb;
async function dynamo() {
  if (realDb) return realDb;
  const { DynamoDBClient } = await import("@aws-sdk/client-dynamodb");
  const { DynamoDBDocumentClient, PutCommand, ScanCommand } = await import("@aws-sdk/lib-dynamodb");
  const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true } });
  const TableName = process.env.TABLE_NAME;
  return realDb = {
    put: item => doc.send(new PutCommand({ TableName, Item: item })),
    async scanAll() {
      const out = []; let ExclusiveStartKey;
      do { const r = await doc.send(new ScanCommand({ TableName, ExclusiveStartKey })); out.push(...(r.Items || [])); ExclusiveStartKey = r.LastEvaluatedKey; } while (ExclusiveStartKey);
      return out;
    },
  };
}
export const handler = async event => createHandler(await dynamo())(event);
