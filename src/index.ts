#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

import { routeValidateSchema, routeValidate } from "./tools/route-validate.js";
import { routeSuggestSchema, routeSuggest } from "./tools/route-suggest.js";
import { hubCheckSchema, hubCheck } from "./tools/hub-check.js";
import { fareProductMatchSchema, fareProductMatch } from "./tools/fare-product-match.js";

function registerTools(server: McpServer) {
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
}

// --- Stdio mode (local / Claude Code) ---

async function startStdio() {
  const server = new McpServer({ name: "airtreks", version: "1.0.0" });
  registerTools(server);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AirTreks MCP server running on stdio");
}

// --- HTTP mode (Railway / remote) ---

async function startHttp() {
  const PORT = parseInt(process.env.PORT || "3000", 10);

  // Track transports by session for stateful mode
  const transports = new Map<string, StreamableHTTPServerTransport>();

  const httpServer = createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://localhost:${PORT}`);

    // Health check
    if (url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", server: "airtreks-mcp", version: "1.0.0" }));
      return;
    }

    // MCP endpoint
    if (url.pathname === "/mcp") {
      // Check for existing session
      const sessionId = req.headers["mcp-session-id"] as string | undefined;

      if (sessionId && transports.has(sessionId)) {
        const transport = transports.get(sessionId)!;
        await transport.handleRequest(req, res);
        return;
      }

      // New session — only on POST (initialization)
      if (req.method === "POST" && !sessionId) {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
        });

        transport.onclose = () => {
          const sid = [...transports.entries()].find(([, t]) => t === transport)?.[0];
          if (sid) transports.delete(sid);
        };

        const server = new McpServer({ name: "airtreks", version: "1.0.0" });
        registerTools(server);
        await server.connect(transport);

        // Intercept the response to capture the session ID
        const origWriteHead = res.writeHead.bind(res);
        res.writeHead = function (statusCode: number, ...args: any[]) {
          const headers = res.getHeaders();
          const sid = headers["mcp-session-id"] as string | undefined;
          if (sid) transports.set(sid, transport);
          return origWriteHead(statusCode, ...args);
        } as typeof res.writeHead;

        await transport.handleRequest(req, res);
        return;
      }

      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Bad request — missing or invalid session" }));
      return;
    }

    // Root — info page
    if (url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        name: "AirTreks MCP Server",
        version: "1.0.0",
        description: "Complex flight routing intelligence for AI agents",
        mcp_endpoint: "/mcp",
        tools: ["route_validate", "route_suggest", "hub_check", "fare_product_match"],
        docs: "https://github.com/SEKeener/airtreks-mcp",
      }));
      return;
    }

    res.writeHead(404);
    res.end();
  });

  httpServer.listen(PORT, () => {
    console.log(`AirTreks MCP server running on http://0.0.0.0:${PORT}`);
    console.log(`MCP endpoint: http://0.0.0.0:${PORT}/mcp`);
    console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  });
}

// --- Entry point ---

const mode = process.env.MCP_TRANSPORT || (process.env.PORT ? "http" : "stdio");

if (mode === "http") {
  startHttp().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
} else {
  startStdio().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
