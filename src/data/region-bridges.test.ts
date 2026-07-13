import { test } from "node:test";
import assert from "node:assert/strict";
import { airportRegions, regionBridges, findBridge } from "./region-bridges.js";
import { cityLongitudes } from "../tools/plan-route.js";

test("AIR-496: every mapped airport has both a region and a longitude", () => {
  const regionOnly = Object.keys(airportRegions).filter((c) => !(c in cityLongitudes));
  const lonOnly = Object.keys(cityLongitudes).filter((c) => !(c in airportRegions));
  assert.deepEqual(regionOnly, [], `airports missing longitudes: ${regionOnly}`);
  assert.deepEqual(lonOnly, [], `airports missing regions: ${lonOnly}`);
});

test("AIR-496: every region pair (including same-region) has a bridge", () => {
  const regions = [...new Set(Object.values(airportRegions))];
  const missing: string[] = [];
  for (const a of regions) {
    for (const b of regions) {
      const hit = regionBridges.some(
        (br) => (br.from === a && br.to === b) || (br.from === b && br.to === a)
      );
      if (!hit) missing.push(`${a}<->${b}`);
    }
  }
  assert.deepEqual(missing, [], `region pairs without bridges: ${missing}`);
});

test("findBridge resolves for representative airport pairs across all regions", () => {
  const representative: Record<string, string> = {
    americas: "PDX", "south-america": "EZE", europe: "LHR", asia: "BKK",
    oceania: "SYD", "middle-east": "DXB", africa: "NBO",
  };
  const codes = Object.values(representative);
  for (const from of codes) {
    for (const to of codes) {
      if (from === to) continue;
      assert.notEqual(findBridge(from, to), null, `no bridge for ${from}->${to}`);
    }
  }
});
