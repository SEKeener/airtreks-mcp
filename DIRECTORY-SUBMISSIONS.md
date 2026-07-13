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
| awesome-mcp-servers (punkpeye) | PR submitted (open) | https://github.com/punkpeye/awesome-mcp-servers/pull/7293 |
| Official MCP Registry | Published 2026-07-13 (v1.0.2, remotes + icons) | https://registry.modelcontextprotocol.io/v0/servers?search=airtreks |
| npm | Published (v1.0.1, 355 downloads) | https://www.npmjs.com/package/airtreks-mcp |
| mcp.so | Needs GitHub login to submit | https://mcp.so/submit |
| mcpservers.org | Submitted 2026-06-25, pending review | https://mcpservers.org/submit |
| PulseMCP | Auto-ingests from Official MCP Registry | https://www.pulsemcp.com |
| Glama.ai | Listed (auto-indexed, 27 downloads) | https://glama.ai/mcp/servers?search=airtreks |

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

Click "Add Server" and paste:
- **GitHub URL:** https://github.com/SEKeener/airtreks-mcp

---

## Notes

- All directories allow editing after submission
- mcpservers.org has a $39 premium option for faster approval + badge (optional)
- Glama auto-indexes from GitHub — may already discover us
- PulseMCP auto-enriches metadata from GitHub
