# MCP Directory Submissions

## Metadata pack (canonical - copy from here, never retype)

| Field | Value |
|-------|-------|
| Name | AirTreks MCP (`io.github.SEKeener/airtreks-mcp`) |
| One-sentence description | Multi-city flight routing intelligence — plan RTW trips, validate alliances, get carrier picks. |
| Long description | Complex multi-city flight routing intelligence for AI agents. 7 tools: plan round-the-world trips across 60+ carriers, validate Star Alliance and oneworld alliance routings, get segment-by-segment carrier recommendations, identify surface sector savings, and hand off to human consultants. No API key needed (100 req/day free). |
| Tool list | `plan_route`, `route_validate`, `route_suggest`, `hub_check`, `fare_product_match`, `custom_route_build` (free) + `trip_idea_create` (API key) |
| Transport | Streamable HTTP at `https://mcp.airtreks.com/mcp`; stdio via `npx airtreks-mcp` |
| Auth model | Free tier: none, 100 req/day per IP. API key (for `trip_idea_create` + higher limits): `POST https://mcp.airtreks.com/register` |
| Repo | https://github.com/SEKeener/airtreks-mcp |
| Homepage | https://airtreks.com (server: https://mcp.airtreks.com) |
| Icon (PNG 512, light) | https://airtreks.com/brand/airtreks-icon-512.png |
| Icon (PNG 512, dark) | https://airtreks.com/brand/airtreks-icon-dark-512.png |
| Icon (SVG, light) | https://airtreks.com/brand/airtreks-icon.svg |
| Icon (SVG, dark) | https://airtreks.com/brand/airtreks-icon-dark.svg |
| Manifest | https://mcp.airtreks.com/.well-known/mcp/server.json |
| Contact | sean@airtreks.com |

Icon URLs are the canonical brand set from AIR-479 (`airtreks-media-v3:packages/brand/brand-assets.md`). Use the 512 PNG wherever a directory asks for a logo; SVG where accepted.

Claude Desktop / Cursor config snippet (remote, recommended):

```json
{
  "mcpServers": {
    "airtreks": {
      "url": "https://mcp.airtreks.com/mcp"
    }
  }
}
```

Local stdio alternative:

```json
{
  "mcpServers": {
    "airtreks": {
      "command": "npx",
      "args": ["airtreks-mcp"]
    }
  }
}
```

## Status

| Directory | Status | Link |
|-----------|--------|------|
| awesome-mcp-servers (punkpeye) | PR open; Glama badge added 2026-07-13; merge blocked on Glama quality score (needs Glama release, see below) | https://github.com/punkpeye/awesome-mcp-servers/pull/7293 |
| Official MCP Registry | Published 2026-07-13 (v1.0.2, remotes + icons) | https://registry.modelcontextprotocol.io/v0/servers?search=airtreks |
| npm | Published (v1.0.1, 355 downloads) | https://www.npmjs.com/package/airtreks-mcp |
| mcp.so | Needs GitHub login to submit (Sean, ~2 min; form contents below) | https://mcp.so/submit |
| mcpservers.org | Submitted 2026-06-25, still pending review (re-verified 2026-07-13) | https://mcpservers.org/submit |
| PulseMCP | Listed (auto-ingested; verified 2026-07-13) | https://www.pulsemcp.com/servers/sekeener-airtreks |
| Glama.ai | Listed, but no quality score until a Glama "release" is created (Sean, admin UI; see below) | https://glama.ai/mcp/servers/SEKeener/airtreks-mcp |
| GitHub MCP Registry (github.com/mcp) | Not listed; curated only - email nomination to partnerships@github.com (Sean; draft below) | https://github.com/mcp |
| Smithery | Not listed, no auto-sync from official registry; submit endpoint URL at smithery.ai/new (Sean, browser OAuth; steps below) | https://smithery.ai/new |
| Anthropic Claude connectors directory | Not submitted; requires Claude Team/Enterprise org owner + server prereqs (see below) | https://claude.com/docs/connectors/building/submission |
| OpenAI Apps (ChatGPT) | Evaluated 2026-07-13: worthwhile, tools-only servers qualify; requires OpenAI org + identity verification (see below) | https://developers.openai.com/apps-sdk/deploy/submission |

---

## Official MCP Registry

Published 2026-07-13 as `io.github.SEKeener/airtreks-mcp` v1.0.2 (isLatest, active) with the streamable-http remote and the 4 canonical icons. To publish a new version: bump `version` in `server.json` (registry rejects duplicates), then `mcp-publisher login github && mcp-publisher publish` from the repo root.

---

## mcp.so — https://mcp.so/submit

- **Type:** MCP Server
- **Name:** AirTreks MCP
- **URL:** https://github.com/SEKeener/airtreks-mcp
- **Server Config:**
```json
{
  "mcpServers": {
    "airtreks": {
      "url": "https://mcp.airtreks.com/mcp"
    }
  }
}
```

---

## mcpservers.org — https://mcpservers.org/submit

- **Server Name:** AirTreks MCP
- **Short Description:** Complex multi-city flight routing intelligence for AI agents. 7 tools: plan round-the-world trips across 60+ carriers, validate Star Alliance and oneworld alliance routings, get segment-by-segment carrier recommendations, identify surface sector savings, and hand off to human consultants. No API key needed (100 req/day free).
- **Link:** https://github.com/SEKeener/airtreks-mcp
- **Category:** Other (or Finance if no Travel option)
- **Contact Email:** sean@airtreks.com

---

## PulseMCP — https://www.pulsemcp.com/submit

- **URL:** https://github.com/SEKeener/airtreks-mcp
- (PulseMCP auto-enriches from the GitHub repo README)

---

## Glama.ai — https://glama.ai/mcp/servers

Listed at https://glama.ai/mcp/servers/SEKeener/airtreks-mcp, but the quality score is unset. Glama requires a Glama "release" (not a GitHub release) before it scores tool-definition quality and server coherence:

1. Log into Glama, open the server's admin page.
2. Deploy via the Dockerfile admin interface (repo already has a Dockerfile), then publish the release.
3. Score appears at https://glama.ai/mcp/servers/SEKeener/airtreks-mcp/score - this is what unblocks the awesome-mcp-servers PR merge.

---

## GitHub MCP Registry — https://github.com/mcp

Curated, ~148 servers as of 2026-07-13. No auto-ingest from the Official MCP Registry and no self-service submission (self-publication announced as "coming" Oct 2025, not shipped). Only path: email nomination, reviewed by GitHub against stability, security, maintenance, and docs quality.

Draft email (send from Sean's account to partnerships@github.com):

> **Subject:** GitHub MCP Registry inclusion request: AirTreks MCP (io.github.SEKeener/airtreks-mcp)
>
> Hi - I'd like to nominate AirTreks MCP for the GitHub MCP Registry.
>
> - Official MCP Registry: published as `io.github.SEKeener/airtreks-mcp` v1.0.2 (streamable-http remote + icons)
> - Repo: https://github.com/SEKeener/airtreks-mcp (TypeScript, MIT, active)
> - Hosted endpoint: https://mcp.airtreks.com/mcp - no auth needed, 100 req/day free
> - What it does: complex multi-city flight routing intelligence - 7 tools to plan round-the-world trips across 60+ carriers, validate Star Alliance/oneworld routings, and get segment-by-segment carrier recommendations. 20+ years of AirTreks (airtreks.com) consultant knowledge as an API; no other MCP server covers this niche.
>
> Happy to provide anything else you need.
>
> Sean Keener, AirTreks - sean@airtreks.com

---

## Smithery — https://smithery.ai/new

Not listed (verified via registry.smithery.ai 2026-07-13); Smithery does not sync from the Official MCP Registry. Current flow is URL-based "bring your own hosting" - no smithery.yaml, no repo changes needed (the old smithery.yaml GitHub-deploy flow is retired).

1. Log in at smithery.ai (browser OAuth) and claim a namespace (first-come).
2. Go to https://smithery.ai/new and paste `https://mcp.airtreks.com/mcp` (or CLI: `smithery mcp publish "https://mcp.airtreks.com/mcp" -n <namespace>/airtreks-mcp`).
3. Smithery auto-scans the endpoint for tools (probe on 2026-07-13 confirmed our endpoint responds correctly to their initialize handshake, no auth wall). If a WAF is ever added in front of mcp.airtreks.com, allowlist User-Agent `SmitheryBot/1.0`.
4. After publish, complete the official-vendor verification checklist in server Settings (mcp.airtreks.com is on the brand domain, so this should pass).

---

## Anthropic Claude connectors directory

Self-serve and open, authless servers explicitly supported - but gated on a **Claude Team or Enterprise org** (personal Pro/Max accounts cannot submit). Submission portal: https://claude.ai/admin-settings/directory/submissions/new (org Owner only); docs: https://claude.com/docs/connectors/building/submission. Submissions are auto-scanned and listed as community connectors by default.

Server prereqs to fix BEFORE submitting (tracked in AIR-482):
- Every tool needs a `title` plus `readOnlyHint: true` (or `destructiveHint`) annotation - missing annotations are a top rejection cause.
- Public privacy policy URL (missing = immediate rejection) and a public docs URL.
- Per-IP rate limit: Claude egress comes from one CIDR (160.79.104.0/21), so all Claude users would share our 100 req/day per-IP bucket - raise or exempt that range first.

Owner steps (Sean): have/create a Team org, walk the ~11-step portal (progress auto-saves), accept the 7 policy acknowledgments + directory terms, monitor https://claude.ai/admin-settings/directory/submissions. Listing copy can be lifted verbatim from the metadata pack above.

---

## OpenAI Apps (ChatGPT)

**Verdict: worth submitting.** Submission is open (apps are submitted as plugins via the plugin portal), tools-only MCP servers qualify - UI widgets and screenshots are optional. OpenAI repositioned ChatGPT toward discovery with third-party apps handling travel (Expedia and Booking.com live), and the multi-stop/RTW niche is empty. Docs: https://developers.openai.com/apps-sdk/deploy/submission.

Requirements: OpenAI org with **identity/business verification** matching the publish name (Sean, government ID / business docs), `api.apps.write` permission, public HTTPS MCP endpoint (have it), privacy policy (shared with Anthropic prereq), tool annotations matching behavior (shared), per-tool test cases verified on ChatGPT web + mobile, square PNG logo (have it - brand pack), country availability declaration, global (not EU) data residency. Same per-IP rate-limit caveat as Anthropic. Estimated ~1-2 days prep + verification wait + ~1-2 week review.

---

## Notes

- All directories allow editing after submission
- mcpservers.org has a $39 premium option for faster approval + badge (optional; pending free review since 06-25)
- Glama auto-indexed us from GitHub; quality score still needs a Glama release (see Glama section)
- PulseMCP auto-ingested us from the Official MCP Registry (listed 2026-07-13)
