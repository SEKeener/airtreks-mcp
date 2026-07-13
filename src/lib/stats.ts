/**
 * Usage stats tracker for the MCP server.
 * Persists to /data/stats.json via Railway volume.
 *
 * Protected by STATS_SECRET env var.
 */

import { readJson, writeJson } from "./store.js";

interface SerializedDayStats {
  date: string;
  requests: number;
  uniqueIps: string[];
  toolCalls: Record<string, number>;
  routes: Record<string, number>;
  errors: number;
  rateLimitHits: number;
}

interface DayStats {
  date: string;
  requests: number;
  uniqueIps: Set<string>;
  toolCalls: Record<string, number>;
  routes: Record<string, number>;
  errors: number;
  rateLimitHits: number;
}

const days = new Map<string, DayStats>();
let dirty = false;

// Load from disk on startup
function loadFromDisk() {
  const saved = readJson<SerializedDayStats[]>("stats.json", []);
  for (const d of saved) {
    days.set(d.date, {
      ...d,
      uniqueIps: new Set(d.uniqueIps || []),
    });
  }
}

function saveToDisk() {
  if (!dirty) return;
  const serialized = Array.from(days.values()).map((d) => ({
    ...d,
    uniqueIps: Array.from(d.uniqueIps),
  }));
  writeJson("stats.json", serialized);
  dirty = false;
}

// Save every 30 seconds if dirty. unref: don't hold the process open (the
// HTTP server does that in prod; tests import this module and must exit).
setInterval(saveToDisk, 30 * 1000).unref();

// Save on process exit
process.on("SIGTERM", saveToDisk);
process.on("SIGINT", saveToDisk);

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDay(date?: string): DayStats {
  const d = date || today();
  if (!days.has(d)) {
    days.set(d, {
      date: d,
      requests: 0,
      uniqueIps: new Set(),
      toolCalls: {},
      routes: {},
      errors: 0,
      rateLimitHits: 0,
    });
  }
  return days.get(d)!;
}

export function trackRequest(ip: string) {
  const day = getDay();
  day.requests++;
  day.uniqueIps.add(ip);
  dirty = true;
}

export function trackToolCall(toolName: string, args?: Record<string, any>) {
  const day = getDay();
  day.toolCalls[toolName] = (day.toolCalls[toolName] || 0) + 1;

  const cities = args?.cities as string[] | undefined;
  if (cities && cities.length >= 2) {
    const route = cities.map((c: string) => c.toUpperCase()).join("-");
    day.routes[route] = (day.routes[route] || 0) + 1;
  }
  dirty = true;
}

export function trackError() {
  getDay().errors++;
  dirty = true;
}

export function trackRateLimitHit() {
  getDay().rateLimitHits++;
  dirty = true;
}

function serializeDay(day: DayStats) {
  const topRoutes = Object.entries(day.routes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([route, count]) => ({ route, count }));

  const toolBreakdown = Object.entries(day.toolCalls)
    .sort(([, a], [, b]) => b - a)
    .map(([tool, count]) => ({ tool, count }));

  return {
    date: day.date,
    requests: day.requests,
    uniqueIps: day.uniqueIps.size,
    toolCalls: toolBreakdown,
    totalToolCalls: Object.values(day.toolCalls).reduce((a, b) => a + b, 0),
    topRoutes,
    errors: day.errors,
    rateLimitHits: day.rateLimitHits,
  };
}

export function getStats() {
  const allDays = Array.from(days.values())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 90)
    .map(serializeDay);

  const todayStats = serializeDay(getDay());

  return {
    serverStarted: startTime,
    uptime: Math.round((Date.now() - startTimeMs) / 1000),
    today: todayStats,
    history: allDays,
  };
}

const startTimeMs = Date.now();
const startTime = new Date().toISOString();

// Load on import
loadFromDisk();
