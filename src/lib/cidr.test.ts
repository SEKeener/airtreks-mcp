import { test } from "node:test";
import assert from "node:assert/strict";
import { ipInCidr, matchPlatform, parseEgressPrefixes, PLATFORM_RANGES } from "./cidr.js";

test("ipInCidr matches inside the Anthropic /21", () => {
  assert.equal(ipInCidr("160.79.104.1", "160.79.104.0/21"), true);
  assert.equal(ipInCidr("160.79.111.255", "160.79.104.0/21"), true);
});

test("ipInCidr rejects outside the range", () => {
  assert.equal(ipInCidr("160.79.112.0", "160.79.104.0/21"), false);
  assert.equal(ipInCidr("160.79.103.255", "160.79.104.0/21"), false);
  assert.equal(ipInCidr("8.8.8.8", "160.79.104.0/21"), false);
});

test("ipInCidr handles IPv4-mapped IPv6", () => {
  assert.equal(ipInCidr("::ffff:160.79.104.7", "160.79.104.0/21"), true);
  assert.equal(ipInCidr("::ffff:8.8.8.8", "160.79.104.0/21"), false);
});

test("ipInCidr rejects garbage safely", () => {
  assert.equal(ipInCidr("unknown", "160.79.104.0/21"), false);
  assert.equal(ipInCidr("2001:db8::1", "160.79.104.0/21"), false);
  assert.equal(ipInCidr("999.1.1.1", "160.79.104.0/21"), false);
  assert.equal(ipInCidr("160.79.104.1", "not-a-cidr"), false);
});

test("matchPlatform identifies Anthropic egress", () => {
  assert.equal(matchPlatform("160.79.104.25")?.name, "anthropic");
  assert.equal(matchPlatform("1.2.3.4"), null);
});

test("matchPlatform identifies OpenAI egress from the snapshot", () => {
  const openai = PLATFORM_RANGES.find((r) => r.name === "openai");
  assert.ok(openai && openai.cidrs.length > 0);
  const sample = openai!.cidrs[0];
  assert.equal(matchPlatform(sample.split("/")[0])?.name, "openai");
});

test("parseEgressPrefixes extracts valid IPv4 CIDRs and drops garbage", () => {
  const body = {
    creationTime: "2026-07-11T02:09:39",
    prefixes: [
      { ipv4Prefix: "20.169.78.48/28" },
      { ipv4Prefix: "not-a-cidr" },
      { ipv6Prefix: "2001:db8::/32" },
      "junk",
      { ipv4Prefix: 42 },
    ],
  };
  assert.deepEqual(parseEgressPrefixes(body), ["20.169.78.48/28"]);
  assert.deepEqual(parseEgressPrefixes(null), []);
  assert.deepEqual(parseEgressPrefixes({ prefixes: "nope" }), []);
});
