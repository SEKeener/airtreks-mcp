# AirTreks MCP Server

Complex flight routing intelligence for AI agents. Validates multi-city itineraries, suggests proven RTW routing templates, identifies dead legs, and recommends fare products.

## Tools

| Tool | Description |
|------|-------------|
| `route_validate` | Validate a multi-city routing — checks alliance rules, dead legs, poison carriers, bookability |
| `route_suggest` | Get 3 suggested routings by region, direction, and alliance |
| `hub_check` | Best connection between two airports — dead leg detection + hub fixes |
| `fare_product_match` | Recommend fare type: RTW, Circle Pacific/Atlantic, Open Jaw, or Custom |

## Run

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

## Add to Claude Code

Already configured in `~/.claude.json`. Restart Claude Code to pick up.

## Add to any MCP client

```json
{
  "mcpServers": {
    "airtreks": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/supernova/projects/airtreks-mcp/dist/index.js"]
    }
  }
}
```

## Data Sources

- Alliance members and poison carriers from AirTreks routing intelligence (April 2026)
- Dead legs and hub rules from RTW pricing analysis (53 dead legs, 1,400+ failures)
- 20 proven routing templates from top AirTreks bookings
- Fare product rules from consultant knowledge

## Architecture

```
src/
  index.ts          — MCP server entry point (stdio transport)
  data/
    alliances.ts    — Star Alliance (26) + oneworld (14) carrier data
    hubs.ts         — Dead legs, hub rules, known connections
    fare-products.ts — RTW, CP, CA, OJ, Custom fare product definitions
    routes.ts       — 20 routing templates
  tools/
    route-validate.ts
    route-suggest.ts
    hub-check.ts
    fare-product-match.ts
```
