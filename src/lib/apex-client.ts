/**
 * APEX API client for the MCP server.
 * Ported from airtreks-rtw/server/lib/kite-client.js.
 *
 * Env vars:
 *   APEX_API_URL       — https://kite.bootsnall.com/api (default)
 *   APEX_CLIENT_ID     — OAuth client ID
 *   APEX_CLIENT_SECRET — OAuth client secret
 *   APEX_BEARER_TOKEN  — Pre-generated bearer token (optional, skips OAuth)
 */

const APEX_API_URL = process.env.APEX_API_URL || "https://kite.bootsnall.com/api";
const CLIENT_ID = process.env.APEX_CLIENT_ID || "";
const CLIENT_SECRET = process.env.APEX_CLIENT_SECRET || "";

let cachedToken: string | null = process.env.APEX_BEARER_TOKEN || null;
let tokenExpiry = cachedToken ? Date.now() + 365 * 24 * 3600 * 1000 : 0;

export function isConfigured(): boolean {
  return !!(cachedToken || (CLIENT_ID && CLIENT_SECRET));
}

async function getToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  if (!CLIENT_ID || !CLIENT_SECRET) return null;

  const oauthUrl = APEX_API_URL.replace("/api", "") + "/oauth/token";

  const res = await fetch(oauthUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: "",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`APEX OAuth failed (${res.status}): ${text}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
  return cachedToken;
}

async function post(endpoint: string, body: Record<string, unknown>): Promise<any> {
  const token = await getToken();
  if (!token) throw new Error("APEX API not configured — set APEX_BEARER_TOKEN or APEX_CLIENT_ID/SECRET");

  const url = `${APEX_API_URL}${endpoint}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(`APEX API error (${res.status}): ${JSON.stringify(data)}`);
  }

  return data;
}

export interface CreateTripIdeaOpts {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  stops: string[];
  dates?: string[];
  passengers?: number;
  cabin?: string;
  notes?: string;
  readiness?: string;
  planningStyle?: string;
  priority?: string;
  flexibleDates?: boolean;
}

export async function createTripIdea(opts: CreateTripIdeaOpts): Promise<{ id: number | string; raw: any }> {
  const {
    firstName = "",
    lastName = "",
    email,
    phone = "",
    stops,
    dates = [],
    passengers = 1,
    cabin = "economy",
    notes = "",
    readiness = "50/50",
    planningStyle,
    priority,
    flexibleDates = false,
  } = opts;

  // Build citylist in APEX format
  const citylist = [];
  for (let i = 0; i < stops.length - 1; i++) {
    citylist.push({ city: stops[i], departure_date: dates[i] || null });
  }
  citylist.push({ city: stops[stops.length - 1], departure_date: null });

  const cabinCode = cabin === "business" ? "C" : "Y";
  const serviceclass = cabin === "business" ? 2 : 1;
  const route = stops.join("-");

  const readinessMap: Record<string, string> = {
    "for sure": "For sure",
    "For sure": "For sure",
    "50/50": "50/50",
    dreaming: "Dreaming/Not confident",
    "Dreaming/Not confident": "Dreaming/Not confident",
  };
  const apexReadiness = readinessMap[readiness] || "50/50";

  const questions_answers: Record<string, string[]> = {
    "How confident do you feel booking flights for this trip?": [apexReadiness],
    "How do you want to plan?": [planningStyle || "I want expert guidance from humans"],
    "What matters most?": [priority || "Not sure yet"],
  };

  const user_route_filters = {
    flexible_dates: !!flexibleDates,
    include_nearby: false,
    cabin: cabinCode,
  };

  const payload: Record<string, unknown> = {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    start_date: dates[0] || null,
    end_date: dates[dates.length - 1] || null,
    passengers_number: passengers,
    startcity: stops[0],
    endcity: stops[stops.length - 1],
    citylist,
    serviceclass,
    notes,
    route,
    origin: "mcp-agent",
    ref: "",
    source: 0,
    passengers: Array.from({ length: passengers }, (_, i) => ({
      first_name: i === 0 ? firstName : `Passenger ${i + 1}`,
      last_name: i === 0 ? lastName : "",
    })),
    questions_answers,
    user_route_filters,
    currency: "USD",
    currency_rate: "1",
  };

  const result = await post("/tripideas/add-from-indie", payload);
  const id = result.id || result.data?.id;
  return { id, raw: result };
}
