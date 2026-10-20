#!/usr/bin/env python3
"""Copy Supabase `visits` rows (a JSON export) into the DynamoDB table. Idempotent: Supabase row N becomes id "sb-N",
so running it again overwrites the same items instead of duplicating them.
  AWS_PROFILE=portfolio python3 aws/portfolio-analytics/import-supabase.py visits.json
"""
import json, os, subprocess, sys, tempfile

TABLE, REGION = "portfolio-visits", os.environ.get("AWS_REGION", "us-west-2")

def attr(v):
    if v is None: return {"NULL": True}
    if isinstance(v, bool): return {"BOOL": v}
    if isinstance(v, (int, float)): return {"N": str(v)}
    return {"S": str(v)}

rows = json.load(open(sys.argv[1]))
items = []
for r in rows:
    item = {k: attr(v) for k, v in r.items() if k != "id"}
    item["id"] = {"S": f"sb-{r['id']}"}
    items.append(item)

for i in range(0, len(items), 25):
    pending = {TABLE: [{"PutRequest": {"Item": it}} for it in items[i:i + 25]]}
    for attempt in range(6):
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f: json.dump(pending, f)
        out = subprocess.run(["aws", "--region", REGION, "dynamodb", "batch-write-item", "--request-items", f"file://{f.name}", "--output", "json"],
                             capture_output=True, text=True, check=True)
        os.unlink(f.name)
        pending = json.loads(out.stdout or "{}").get("UnprocessedItems") or {}
        if not pending: break
        subprocess.run(["sleep", str(2 ** attempt)])
    else:
        sys.exit(f"Gave up on batch starting at row {i}")
    print(f"wrote {min(i + 25, len(items))}/{len(items)}")
