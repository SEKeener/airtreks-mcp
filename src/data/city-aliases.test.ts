import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeCode, metroToAirport } from "./city-aliases.js";
import { getAirportRegion } from "./region-bridges.js";
import { planRoute } from "../tools/plan-route.js";

test("normalizeCode resolves metro codes and passes airports through", () => {
  assert.equal(normalizeCode("TYO"), "NRT");
  assert.equal(normalizeCode("lon"), "LHR");
  assert.equal(normalizeCode(" nyc "), "JFK");
  assert.equal(normalizeCode("PDX"), "PDX");
  assert.equal(normalizeCode("XYZ"), "XYZ");
});

test("every alias target has a region mapping", () => {
  for (const [metro, airport] of Object.entries(metroToAirport)) {
    assert.notEqual(getAirportRegion(airport), "unknown", `${metro} -> ${airport} has no region`);
  }
});

test("AIR-496: PDX and other common US airports have regions", () => {
  for (const code of ["PDX", "DEN", "PHX", "BOS", "IAD"]) {
    assert.equal(getAirportRegion(code), "americas", `${code} missing from airportRegions`);
  }
});

test("AIR-496: canonical demo route detects westbound + all regions", async () => {
  const result: any = await planRoute({ cities: ["PDX", "NRT", "BKK", "LHR", "PDX"] });
  assert.equal(result.direction, "westbound");
  assert.deepEqual([...result.regionsCrossed].sort(), ["americas", "asia", "europe"]);
});
