#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { routeValidateSchema, routeValidate } from "./tools/route-validate.js";
import { routeSuggestSchema, routeSuggest } from "./tools/route-suggest.js";
import { hubCheckSchema, hubCheck } from "./tools/hub-check.js";
import { fareProductMatchSchema, fareProductMatch } from "./tools/fare-product-match.js";

const server = new McpServer({
  name: "airtreks",
  version: "1.0.0",
});

// --- Tools ---

server.tool(
  "route_validate",
  "Validate a multi-city flight routing for feasibility. Checks alliance carrier rules, identifies dead legs, warns about poison carriers, and estimates bookability. Use this before building an itinerary to catch routing problems early.",
  routeValidateSchema,
  async (args) => ({
    content: [{ type: "text", text: JSON.stringify(routeValidate(args), null, 2) }],
  })
);

server.tool(
  "route_suggest",
  "Get suggested multi-stop flight routings based on regions, direction, and alliance preference. Returns up to 3 proven routing templates with bookability ratings. Great for trip planning inspiration.",
  routeSuggestSchema,
  async (args) => ({
    content: [{ type: "text", text: JSON.stringify(routeSuggest(args), null, 2) }],
  })
);

server.tool(
  "hub_check",
  "Check the best connection between two airports. Identifies dead legs (routes that fail on alliance fares), suggests hub routing fixes, and shows proven carrier combinations. Essential for transpacific, kangaroo, and intra-Asia routing.",
  hubCheckSchema,
  async (args) => ({
    content: [{ type: "text", text: JSON.stringify(hubCheck(args), null, 2) }],
  })
);

server.tool(
  "fare_product_match",
  "Recommend the best fare product type for a route — RTW, Circle Pacific, Circle Atlantic, Open Jaw, or Custom Multi-City. Considers stop count, direction, and backtracking to match the right alliance fare structure.",
  fareProductMatchSchema,
  async (args) => ({
    content: [{ type: "text", text: JSON.stringify(fareProductMatch(args), null, 2) }],
  })
);

// --- Start ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AirTreks MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
