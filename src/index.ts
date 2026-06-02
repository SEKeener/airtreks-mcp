#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";

import { checkRateLimit, getRateLimitHeaders } from "./lib/rate-limit.js";
import { trackRequest, trackToolCall, trackError, trackRateLimitHit, getStats } from "./lib/stats.js";
import { lookupKey, registerKey, listKeys } from "./lib/api-keys.js";
import { routeValidateSchema, routeValidate } from "./tools/route-validate.js";
import { routeSuggestSchema, routeSuggest } from "./tools/route-suggest.js";
import { hubCheckSchema, hubCheck } from "./tools/hub-check.js";
import { fareProductMatchSchema, fareProductMatch } from "./tools/fare-product-match.js";
import { customRouteBuildSchema, customRouteBuild } from "./tools/custom-route-build.js";
import { planRouteSchema, planRoute } from "./tools/plan-route.js";
import { tripIdeaCreateSchema, tripIdeaCreate } from "./tools/trip-idea-create.js";

function tracked(name: string, fn: (args: any) => any) {
  return async (args: any) => {
    trackToolCall(name, args);
    try {
      const result = await fn(args);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (err: any) {
      trackError();
      return { content: [{ type: "text" as const, text: JSON.stringify({ error: err.message }) }] };
    }
  };
}

function registerTools(server: McpServer, includeLeadTools = false) {
  server.tool(
    "plan_route",
    "The primary entry point for any multi-city trip. Give it your cities — it automatically evaluates Star Alliance RTW, oneworld RTW, AND custom mixed-carrier builds, then recommends the best approach. Handles direction detection, backtracking analysis, alliance feasibility, surface sectors, and carrier selection. The customer doesn't need to know if their trip is alliance or custom — this tool figures it out.",
    planRouteSchema,
    tracked("plan_route", planRoute)
  );

  if (includeLeadTools) {
    server.tool(
      "trip_idea_create",
      "Create a trip idea in AirTreks APEX system — hands off to a human consultant. Automatically runs plan_route to include full routing analysis, carrier recommendations, and consultant value assessment in the lead. The consultant starts informed, not cold. Use this when the customer is ready to get a real quote.",
      tripIdeaCreateSchema,
      tracked("trip_idea_create", tripIdeaCreate)
    );
  }

  server.tool(
    "route_validate",
    "Validate a multi-city flight routing for feasibility. Checks alliance carrier rules, identifies dead legs, warns about poison carriers, and estimates bookability. Use this before building an itinerary to catch routing problems early.",
    routeValidateSchema,
    tracked("route_validate", routeValidate)
  );

  server.tool(
    "route_suggest",
    "Get suggested multi-stop flight routings based on regions, direction, and alliance preference. Returns up to 3 proven routing templates with bookability ratings. Great for trip planning inspiration.",
    routeSuggestSchema,
    tracked("route_suggest", routeSuggest)
  );

  server.tool(
    "hub_check",
    "Check the best connection between two airports. Identifies dead legs (routes that fail on alliance fares), suggests hub routing fixes, and shows proven carrier combinations. Essential for transpacific, kangaroo, and intra-Asia routing.",
    hubCheckSchema,
    tracked("hub_check", hubCheck)
  );

  server.tool(
    "fare_product_match",
    "Recommend the best fare product type for a route — RTW, Circle Pacific, Circle Atlantic, Open Jaw, or Custom Multi-City. Considers stop count, direction, and backtracking to match the right alliance fare structure.",
    fareProductMatchSchema,
    tracked("fare_product_match", fareProductMatch)
  );

  server.tool(
    "custom_route_build",
    "Break a complex multi-city itinerary into individually-ticketable segments with carrier recommendations. Handles routes that don't fit alliance fare rules — mixed carriers, LCCs, Gulf bridge connections, surface sectors. This is how AirTreks consultants build 90% of itineraries. Use this for any route with 4+ stops, backtracking, or region combinations that alliance fares can't cover.",
    customRouteBuildSchema,
    tracked("custom_route_build", customRouteBuild)
  );
}

// --- Stdio mode (local / Claude Code) ---

async function startStdio() {
  const server = new McpServer({ name: "airtreks", version: "1.0.0" });
  registerTools(server, true); // local dev gets all tools
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AirTreks MCP server running on stdio");
}

// --- HTTP mode (Railway / remote) ---

async function startHttp() {
  const PORT = parseInt(process.env.PORT || "3000", 10);

  // Session store: sessionId -> { transport, server, lastUsed, hasApiKey }
  const sessions = new Map<string, { transport: StreamableHTTPServerTransport; server: McpServer; lastUsed: number; hasApiKey: boolean }>();

  // Clean up stale sessions every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [sid, session] of sessions) {
      if (now - session.lastUsed > 10 * 60 * 1000) { // 10 min TTL
        session.transport.close().catch(() => {});
        session.server.close().catch(() => {});
        sessions.delete(sid);
      }
    }
  }, 5 * 60 * 1000);

  function createSession(hasApiKey: boolean): { sid: string; transport: StreamableHTTPServerTransport; server: McpServer } {
    const sid = randomUUID();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => sid,
    });
    const mcpServer = new McpServer({ name: "airtreks", version: "1.0.0" });
    registerTools(mcpServer, hasApiKey);

    transport.onclose = () => sessions.delete(sid);
    sessions.set(sid, { transport, server: mcpServer, lastUsed: Date.now(), hasApiKey });

    return { sid, transport, server: mcpServer };
  }

  const httpServer = createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://localhost:${PORT}`);

    // Health check
    if (url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", server: "airtreks-mcp", version: "1.0.0", sessions: sessions.size, rateLimit: "100/day per IP" }));
      return;
    }

    // Register endpoint — get an API key
    if (url.pathname === "/register" && req.method === "POST") {
      const regSecret = process.env.REGISTER_SECRET || "";
      let body = "";
      for await (const chunk of req) body += chunk;
      try {
        const { email, name, secret } = JSON.parse(body);
        if (!email) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "email is required" }));
          return;
        }
        // If REGISTER_SECRET is set, require it (prevents spam)
        if (regSecret && secret !== regSecret) {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid registration secret. Contact partnerships@airtreks.com for access." }));
          return;
        }
        const key = registerKey(email, name || "");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          apiKey: key.key,
          email: key.email,
          tier: key.tier,
          dailyLimit: key.dailyLimit,
          usage: "Include header: X-API-Key: " + key.key,
          mcpEndpoint: "https://mcp.airtreks.com/mcp",
        }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body. Send {\"email\": \"you@example.com\", \"name\": \"Your Name\"}" }));
      }
      return;
    }

    // Key management (admin)
    if (url.pathname === "/keys") {
      const secret = process.env.STATS_SECRET || "";
      const provided = url.searchParams.get("key") || req.headers["x-stats-key"] as string || "";
      if (!secret || provided !== secret) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(listKeys(), null, 2));
      return;
    }

    // MCP endpoint
    if (url.pathname === "/mcp") {
      if (req.method !== "POST" && req.method !== "GET" && req.method !== "DELETE") {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      // Auth + rate limiting on POST requests
      if (req.method === "POST") {
        const apiKey = req.headers["x-api-key"] as string || "";
        const keyRecord = apiKey ? lookupKey(apiKey) : null;
        const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
          || req.socket.remoteAddress || "unknown";

        // Track by key email or IP
        trackRequest(keyRecord?.email || ip);

        // Rate limit: API key uses key's limit, anonymous uses IP-based 100/day
        const bucketKey = keyRecord ? keyRecord.key : `ip:${ip}`;
        const dailyLimit = keyRecord ? keyRecord.dailyLimit : 100;
        const rl = checkRateLimit(bucketKey, dailyLimit);

        if (!rl.allowed) {
          trackRateLimitHit();
          const upgradeMsg = keyRecord
            ? `${keyRecord.tier} tier: ${rl.limit} requests/day. Contact partnerships@airtreks.com for higher limits.`
            : `Free tier: ${rl.limit} requests/day. Register for an API key for higher limits: POST https://mcp.airtreks.com/register`;
          res.writeHead(429, { "Content-Type": "application/json", ...getRateLimitHeaders(rl) });
          res.end(JSON.stringify({
            error: "Rate limit exceeded",
            limit: rl.limit,
            resetAt: new Date(rl.resetAt).toISOString(),
            message: upgradeMsg,
            register: keyRecord ? undefined : "POST https://mcp.airtreks.com/register with {\"email\": \"you@example.com\"}",
          }));
          return;
        }
      }

      const sessionId = req.headers["mcp-session-id"] as string | undefined;

      // Existing session
      if (sessionId && sessions.has(sessionId)) {
        const session = sessions.get(sessionId)!;
        session.lastUsed = Date.now();
        await session.transport.handleRequest(req, res);
        return;
      }

      // New session (POST without session ID = initialization)
      if (req.method === "POST" && !sessionId) {
        const hasKey = !!(req.headers["x-api-key"] && lookupKey(req.headers["x-api-key"] as string));
        const { transport, server: mcpServer } = createSession(hasKey);
        await mcpServer.connect(transport);
        await transport.handleRequest(req, res);
        return;
      }

      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid or expired session. Send an initialize request without a session ID to start a new session." }));
      return;
    }

    // Stats dashboard (protected)
    if (url.pathname === "/stats") {
      const secret = process.env.STATS_SECRET || "";
      const provided = url.searchParams.get("key") || req.headers["x-stats-key"] as string || "";
      if (!secret || provided !== secret) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Unauthorized. Provide ?key= or X-Stats-Key header." }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getStats(), null, 2));
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
        free_tools: ["plan_route", "route_validate", "route_suggest", "hub_check", "fare_product_match", "custom_route_build"],
        api_key_tools: ["trip_idea_create"],
        rate_limit: "100 requests/day (free), higher with API key",
        register: "POST /register with {\"email\": \"you@example.com\"}",
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
