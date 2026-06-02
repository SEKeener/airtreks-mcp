/**
 * Usage stats tracker for the MCP server.
 * In-memory — resets on deploy. Good enough for v1.
 *
 * Protected by STATS_SECRET env var.
 */

interface DayStats {
  date: string;
  requests: number;
  uniqueIps: Set<string>;
  toolCalls: Record<string, number>;
  routes: Record<string, number>;   // top routes requested
  errors: number;
  rateLimitHits: number;
}

const days = new Map<string, DayStats>();

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
}

export function trackToolCall(toolName: string, args?: Record<string, any>) {
  const day = getDay();
  day.toolCalls[toolName] = (day.toolCalls[toolName] || 0) + 1;

  // Extract route from common args
  const cities = args?.cities as string[] | undefined;
  if (cities && cities.length >= 2) {
    const route = cities.map((c: string) => c.toUpperCase()).join("-");
    day.routes[route] = (day.routes[route] || 0) + 1;
  }
}

export function trackError() {
  getDay().errors++;
}

export function trackRateLimitHit() {
  getDay().rateLimitHits++;
}

function serializeDay(day: DayStats) {
  // Sort routes by count descending
  const topRoutes = Object.entries(day.routes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([route, count]) => ({ route, count }));

  // Sort tools by count descending
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
    .slice(0, 30) // last 30 days
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
