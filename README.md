# AirTreks MCP Server

Complex multi-city flight routing intelligence for AI agents. Plan round-the-world trips across 60+ carriers, validate alliance routings, get carrier recommendations, identify surface sector savings, and hand off to human consultants.

**Live endpoint:** `https://mcp.airtreks.com/mcp`

## Tools

### Free (no API key needed, 100 req/day)

| Tool | Description |
|------|-------------|
| `plan_route` | Primary entry point — give it cities, it evaluates Star Alliance RTW, oneworld RTW, and custom mixed-carrier builds, then recommends the best approach |
| `route_validate` | Validate a multi-city routing — checks alliance rules, dead legs, poison carriers, bookability |
| `route_suggest` | Get 3 suggested routings by region, direction, and alliance |
| `hub_check` | Best connection between two airports — dead leg detection + hub fixes |
| `fare_product_match` | Recommend fare type: RTW, Circle Pacific/Atlantic, Open Jaw, or Custom |
| `custom_route_build` | Break complex itineraries into individually-ticketable segments with carrier recommendations |

### API Key Required

| Tool | Description |
|------|-------------|
| `trip_idea_create` | Hand off to an AirTreks human consultant by creating a trip idea in APEX |

Register for an API key: `POST https://mcp.airtreks.com/register` with `{"email": "you@example.com"}`

## Connect

### Remote (recommended)

Add to Claude Desktop, Cursor, or any MCP client:

```json
{
  "mcpServers": {
    "airtreks": {
      "url": "https://mcp.airtreks.com/mcp"
    }
  }
}
```

### Local (stdio)

```bash
npx airtreks-mcp
```

Or add to your MCP client config:

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

## Try It

Ask your AI agent:

> Plan a round-the-world trip: New York → London → Dubai → Bangkok → Tokyo → San Francisco

## Rate Limits

- **Free:** 100 requests/day per IP (no key needed)
- **Registered:** Higher limits with API key
- **trip_idea_create** requires an API key

## Data Sources

- Alliance members and poison carriers from AirTreks routing intelligence
- Dead legs and hub rules from RTW pricing analysis (53 dead legs, 1,400+ failures)
- 20 proven routing templates from top AirTreks bookings
- Fare product rules from consultant knowledge

## Endpoints

| Path | Description |
|------|-------------|
| `/mcp` | MCP protocol endpoint (streamable HTTP) |
| `/health` | Health check |
| `/register` | Get an API key (POST) |
| `/` | Server info |

## License

AGPL-3.0-only
