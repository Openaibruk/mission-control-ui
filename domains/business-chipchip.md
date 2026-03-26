# Domain: Business Focus (ChipChip)

**Path:** `/home/ubuntu/.openclaw/workspace/chipchip/` (and related backend/frontend directories)
**Database:** Supabase (`vgrdeznxllkdolvrhlnm`), ClickHouse (Analytics)
**Focus:** ChipChip logistics/delivery platform, DataHub Analytics, workflows.

## Key Tech Stack
- Supabase Edge Functions
- ClickHouse (Analytics backend)

## Key Agents & Skills
- **Agents:** Orion, Lyra (Analytics), Henok, Cinder, Kiro (Dev Team)
- **Skills:** `datahub-analytics`, `telegram-supplier-communicator`

## Golden Rules
1. **Methodology:** Base development decisions on the BMAD methodology (bug fix track vs full feature track).
2. **Playbook:** Always read `chipchip/workflows/dev-team-playbook.md` when starting development tasks.
3. **Data Access:** Do not modify the ClickHouse database schema without Bruk's explicit approval. Use the DataHub MCP to query business metrics.
