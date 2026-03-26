# Paperclip Server Recovery Configuration
# Date: 2026-03-17 (post crash recovery)

## Company
- **Name:** ChipChip
- **ID:** 5746d174-95f0-42f3-bd98-a0ed78e4f5a3
- **Prefix:** CHI
- **Description:** Logistics and delivery platform

## Server
- **URL:** http://localhost:3100
- **Health:** http://localhost:3100/api/health
- **Mode:** local_trusted
- **Database:** Embedded PostgreSQL on port 54329
- **Migrations:** 35 applied

## Org Hierarchy

```
Nova (CEO)
├── Kiro (CTO)
│   ├── Henok (Engineer)
│   ├── Cinder (QA)
│   │   └── Yonas (QA)
│   ├── Onyx (Security)
│   └── Forge (DevOps)
├── Nahom (CMO)
│   ├── Bini (Content)
│   ├── Lidya (Designer)
│   └── Amen (Analytics)
└── Pulse (Operations)
```

## Agent API Keys
See: chipchip/paperclip-agent-keys.txt

## Adapter
All agents use `openclaw_gateway` adapter type.
Device keys need to be generated via the OpenClaw gateway for pairing.

## Gateway Adapter Status
- **Status:** CONNECTED ✅
- **Test result:** PASS (URL valid, auth present, probe OK)
- **Tested at:** 2026-03-17T11:52:00Z
