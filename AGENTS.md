# AGENTS.md — airtreks-mcp

Canonical agent charter (ownership, forbidden zones, lead-state source of truth):
**`~/.claude/AGENTS.md`** — read it first.

## Ownership
Claude Code owns the AirTreks MCP server (mcp.airtreks.com — REST + MCP tools
over AirTreks/BootsnAll data).

## Repo-specific boundaries (never touch without an in-scope instruction)
- Production env vars, API keys, secrets; APEX / Kite credentials or auth.
- Do not skip, weaken, or delete existing tests.
- **Deploy:** ships **only** via manual `railway up` — there is no GitHub
  auto-deploy. A merged PR is NOT deployed until someone runs the deploy.
- Directory / connector submissions are Sean-interactive (see the repo's
  `DIRECTORY-SUBMISSIONS.md`); don't submit on his behalf without approval.

## Lead state
This server does **not** own lead state. If it exposes lead or order data, the
system of record is **APEX / Kite** (`kite.bootsnall.com/api`) — read-only by
default; see §3 of the canonical charter.
