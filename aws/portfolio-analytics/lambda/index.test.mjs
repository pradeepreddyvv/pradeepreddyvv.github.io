// node --test aws/portfolio-analytics/lambda/index.test.mjs  — runs without AWS (in-memory db).
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createHandler, visitFrom, passwordOk } from "./index.mjs";

const HASH = createHash("sha256").update("s3cret").digest("hex");
function setup() {
  const rows = [];
  const h = createHandler({ put: async i => { rows.push(i); }, scanAll: async () => rows.slice() }, { DASHBOARD_PASSWORD_SHA256: HASH });
  const call = (method, rawPath, { body, headers = {} } = {}) => h({ rawPath, headers, body, requestContext: { http: { method, sourceIp: "203.0.113.9" } } });
  return { rows, call };
}

test("POST /visit stores whitelisted, trimmed fields with server time and IP", async () => {
  const { rows, call } = setup();
  const r = await call("POST", "/visit", { body: JSON.stringify({ city: " Tempe ", country: "United States", country_code: "US", page: "/", ip: "1.1.1.1", visited_at: "1999-01-01", evil: "x", latitude: 33.4 }) });
  assert.equal(r.statusCode, 204);
  assert.equal(rows.length, 1);
  const v = rows[0];
  assert.equal(v.city, "Tempe"); assert.equal(v.ip, "203.0.113.9"); assert.equal(v.latitude, 33.4);
  assert.notEqual(v.visited_at, "1999-01-01"); assert.equal(v.evil, undefined); assert.ok(v.id);
});

test("markup in visitor fields is stripped (the dashboard renders them)", () => {
  const v = visitFrom({ city: "<img src=x onerror=alert(1)>Paris" });
  assert.equal(v.city, "img src=x onerror=alert(1)Paris");
  assert.equal(visitFrom({}).city, "Unknown");
});

test("bad JSON and oversized bodies are rejected", async () => {
  const { call } = setup();
  assert.equal((await call("POST", "/visit", { body: "{nope" })).statusCode, 400);
  assert.equal((await call("POST", "/visit", { body: JSON.stringify({ city: "x".repeat(5000) }) })).statusCode, 413);
});

test("GET /visits needs the dashboard password and returns newest first", async () => {
  const { rows, call } = setup();
  rows.push({ id: "1", visited_at: "2026-03-20T00:00:00Z" }, { id: "2", visited_at: "2026-10-04T00:00:00Z" });
  assert.equal((await call("GET", "/visits")).statusCode, 401);
  assert.equal((await call("GET", "/visits", { headers: { "x-dashboard-password": "wrong" } })).statusCode, 401);
  const ok = await call("GET", "/visits", { headers: { "x-dashboard-password": "s3cret" } });
  assert.equal(ok.statusCode, 200);
  assert.deepEqual(JSON.parse(ok.body).visits.map(v => v.id), ["2", "1"]);
});

test("unknown routes 404; password check is strict", async () => {
  const { call } = setup();
  assert.equal((await call("GET", "/nope")).statusCode, 404);
  assert.equal(passwordOk("s3cret", ""), false);
  assert.equal(passwordOk("", HASH), false);
});
