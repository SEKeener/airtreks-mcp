# MCP Directory Submissions

## Status

| Directory | Status | Link |
|-----------|--------|------|
| awesome-mcp-servers (punkpeye) | PR submitted | https://github.com/punkpeye/awesome-mcp-servers/pull/7293 |
| Official MCP Registry | Needs npm publish + mcp-publisher login | Run 4 commands below |
| mcp.so | Copy-paste below | https://mcp.so/submit |
| mcpservers.org | Copy-paste below | https://mcpservers.org/submit |
| PulseMCP | Copy-paste below | https://www.pulsemcp.com/submit |
| Glama.ai | Submit GitHub URL | https://glama.ai/mcp/servers (click Add Server) |

---

## Official MCP Registry (run these 4 commands)

```bash
cd ~/Projects/airtreks-mcp
npm adduser
npm publish --access public
mcp-publisher login github
mcp-publisher publish
```

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
