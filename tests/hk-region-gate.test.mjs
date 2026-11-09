import assert from "node:assert/strict";
import test from "node:test";
import { regionResponse } from "../lib/hk-region-gate.mjs";

for (const country of ["HK", null, "", "XX", "ZZ", "hk", "HK,US"]) {
  test(`geographic denial: ${country}`, async () => {
    const headers = new Headers();
    if (country !== null) headers.set("x-vercel-ip-country", country);
    headers.set("x-forwarded-for", "8.8.8.8");
    headers.set("cf-ipcountry", "US");
    const response = regionResponse(new Request("https://example.invalid/api/buy", { method: "POST", headers }));
    assert.equal(response.status, country === "HK" ? 403 : 503);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.match(await response.text(), country === "HK" ? /Access Denied \(Hong Kong\)/ : /Service Temporarily Unavailable/);
  });
}
for (const country of ["US", "SG", "JP", "TW", "MO", "CN"]) {
  test(`unchanged region: ${country}`, () => {
    assert.equal(regionResponse(new Request("https://example.invalid/", {headers:{"x-vercel-ip-country":country,"cf-ipcountry":"HK"}})), null);
  });
}
test("HEAD denial has no body", async () => {
  const response = regionResponse(new Request("https://example.invalid/icon.svg", {method:"HEAD",headers:{"x-vercel-ip-country":"HK"}}));
  assert.equal(response.status,403);
  assert.equal(await response.text(),"");
});
