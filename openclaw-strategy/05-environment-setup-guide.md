# Environment Setup Best Practices for AI Adoption

**Author:** Kiro (Architect)
**Date:** 2026-03-19
**Audience:** Companies adopting AI agents into their workflows

---

## Executive Summary

Setting up AI environments isn't just about picking a model and hitting "deploy." The infrastructure, security, cost management, and integration decisions you make early will compound — for better or worse. This guide covers practical, battle-tested patterns based on real OpenClaw deployments.

---

## 1. Infrastructure Choices

### 1.1 Deployment Patterns

There are three main patterns. Pick the one that fits your team's size and ops maturity.

#### Pattern A: VPS (Cloud-Hosted) — Recommended for Most Teams

A single Linux VM runs the OpenClaw gateway, agents, and integrations. Simplest to manage.

```
┌─────────────────────────────────┐
│  AWS EC2 / DigitalOcean / Hetzner  │
│  ┌─────────────────────────────┐│
│  │  OpenClaw Gateway (:18789)  ││
│  │  + Agent sessions           ││
│  │  + Skills & cron workers    ││
│  │  + Integration adapters     ││
│  └─────────────────────────────┘│
│  Systemd manages lifecycle      │
└─────────────────────────────────┘
```

**Spec recommendations by team size:**

| Team Size | CPU | RAM | Disk | Est. Monthly Cost |
|-----------|-----|-----|------|-------------------|
| 1-3 people | 2 vCPU | 4 GB | 30 GB | $15-25 |
| 5-15 people | 4 vCPU | 8 GB | 50 GB | $30-50 |
| 15-50 people | 8 vCPU | 16 GB | 100 GB | $60-120 |

**Quick setup (AWS EC2 example):**

```bash
# Launch instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.medium \
  --key-name your-key \
  --security-group-ids sg-xxxxx

# SSH in, install OpenClaw
ssh -i key.pem ubuntu@<IP>
curl -fsSL https://openclaw.dev/install.sh | bash
openclaw gateway start
```

**Systemd service (production):**

```ini
# /etc/systemd/system/openclaw.service
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/bin/openclaw gateway start --foreground
Restart=always
RestartSec=5
Environment=NODE_ENV=production
WorkingDirectory=/home/ubuntu/.openclaw

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now openclaw
sudo systemctl status openclaw
```

#### Pattern B: Local / On-Premise

Run on a local server or developer machine. Good for air-gapped environments or data sovereignty requirements.

- **Pros:** Full data control, no cloud costs, low latency
- **Cons:** No remote access without VPN, single point of failure, manual maintenance
- **Best for:** Regulated industries, teams with existing on-prem infra

#### Pattern C: Hybrid

Gateway on VPS for accessibility, sensitive workloads on local infrastructure. Gateway connects to local agents via secure tunnel (Tailscale, WireGuard).

```
┌──────────┐     Tailscale      ┌──────────────┐
│  VPS     │◄──────────────────►│ Local Server  │
│ Gateway  │   (encrypted)      │ Sensitive     │
│ :18789   │                    │ Workloads     │
└──────────┘                    └──────────────┘
```

### 1.2 Reverse Proxy & TLS

**Always** put a reverse proxy in front of the gateway for production:

```nginx
# /etc/nginx/sites-available/openclaw
server {
    listen 443 ssl http2;
    server_name ai.yourcompany.com;

    ssl_certificate /etc/letsencrypt/live/ai.yourcompany.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ai.yourcompany.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";  # WebSocket support
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }
}
```

```bash
# Install certbot for free TLS
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ai.yourcompany.com
```

### 1.3 Disk & Resource Monitoring

AI workflows accumulate logs, memory files, and session data fast. Set up disk alerts early:

```bash
# Check disk usage weekly (add to cron)
df -h / | awk 'NR==2 {print $5}' | sed 's/%//' | \
  awk '{if ($1 > 80) print "DISK WARNING: " $1"% used"}'

# Find large files
du -sh ~/.openclaw/* | sort -rh | head -10
```

---

## 2. Security Hardening

### 2.1 API Key Management

**Rule #1: Never commit API keys to git.** Ever.

#### Key Storage Hierarchy

1. **Environment variables** — for CI/CD and system services
2. **`.env` files** — for local development (gitignored)
3. **Secret managers** — for production (AWS Secrets Manager, Vault, etc.)
4. **OpenClaw config** — gateway stores keys in `~/.openclaw/openclaw.json`

#### OpenClaw Key Configuration

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-xxx"
    }
  }
}
```

**Best practice:** Use a dedicated API key per environment and rotate quarterly.

```bash
# Generate a key rotation script
#!/bin/bash
# rotate-keys.sh — run quarterly
echo "1. Generate new key in OpenRouter dashboard"
echo "2. Update openclaw.json"
echo "3. Restart gateway: sudo systemctl restart openclaw"
echo "4. Revoke old key in dashboard"
echo "5. Test: openclaw status"
```

#### SSH & Server Access

```bash
# Disable password auth (key-only)
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Enable firewall (only SSH + HTTP(S))
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 80/tcp    # HTTP (redirect to HTTPS)
sudo ufw enable
```

### 2.2 OpenClaw Auth Settings

```json
{
  "gateway": {
    "controlUi": {
      "dangerouslyDisableDeviceAuth": false
    }
  }
}
```

- **Production:** Keep device auth enabled (`false` above)
- **Development only:** Disable if running locally behind VPN
- **Never** disable device auth on a public-facing instance

### 2.3 Secret Scanning

Prevent accidental leaks:

```bash
# Install gitleaks for pre-commit scanning
brew install gitleaks  # or: go install github.com/gitleaks/gitleaks/v8@latest

# Add to .gitconfig
git config --global core.hooksPath ~/.git-hooks

# Pre-commit hook (~/.git-hooks/pre-commit)
#!/bin/bash
gitleaks protect --staged --verbose
```

### 2.4 Network Isolation

```bash
# OpenClaw gateway should bind to localhost only
# openclaw.json
{
  "gateway": {
    "host": "127.0.0.1",
    "port": 18789
  }
}
```

Use the reverse proxy (nginx) as the only public entry point. Never expose the gateway port directly.

---

## 3. Model Selection Strategy

### 3.1 The Tiered Approach

Don't use one model for everything. Route by task complexity:

```
                    ┌─────────────────────┐
                    │   Task Arrives       │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │ Tier 1: Free/Cheap   │
                    │ gemini-2.5-flash     │
                    │ (90% of tasks)       │
                    └─────────┬───────────┘
                              │ fails / complex
                    ┌─────────▼───────────┐
                    │ Tier 2: Mid-range    │
                    │ minimax-m2.5         │
                    │ (general reasoning)  │
                    └─────────┬───────────┘
                              │ fails / critical
                    ┌─────────▼───────────┐
                    │ Tier 3: Premium      │
                    │ claude-opus-4.6      │
                    │ (complex/critical)   │
                    └─────────────────────┘
```

### 3.2 Model Configuration

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openrouter/google/gemini-2.5-flash",
        "fallback": [
          "openrouter/minimax/minimax-m2.5",
          "openrouter/anthropic/claude-opus-4.6"
        ]
      }
    }
  }
}
```

### 3.3 Cost Control Rules

| Rule | Implementation |
|------|---------------|
| Set daily spend caps | OpenRouter dashboard → Usage Limits |
| Route cron jobs to cheapest model | `"model": "openrouter/google/gemini-2.5-flash"` in cron config |
| Use subagents for isolation | Spawn cheap subagents for parallel work |
| Monitor token usage | Weekly review via `openclaw status` or dashboard |
| Reserve expensive models | Manual override only — never as default |

### 3.4 When to Use Which Model

- **gemini-2.5-flash:** Summarization, data extraction, simple Q&A, cron tasks, batch processing
- **minimax-m2.5:** Daily agent work, coding, multi-step reasoning, general assistant tasks
- **claude-opus-4.6:** Complex architecture decisions, difficult debugging, nuanced analysis, when cheaper models give wrong answers

### 3.5 Evaluating New Models

Before switching defaults, run a 1-week parallel test:

1. Route 10% of traffic to the candidate model
2. Compare: accuracy, latency, cost, failure rate
3. Check for regressions on your specific use cases
4. Only promote to default after metrics are clear

---

## 4. Integration Setup

### 4.1 Essential Integrations

#### GitHub (Code & CI/CD)

```bash
# Install and authenticate
gh auth login
gh auth status

# Configure OpenClaw GitHub integration
# openclaw.json → skills.github config
```

**Patterns:**
- Auto-create PRs for code changes
- Monitor issues with `gh-issues` skill
- CI/CD hooks via GitHub Actions

#### Google Workspace (Productivity)

```bash
# Set up GWS skills
# Each service (Gmail, Calendar, Drive, etc.) needs OAuth

# Calendar — meeting prep, agenda generation
# Gmail — triage, reply drafts, task extraction
# Drive — file management, document generation
# Docs — collaborative writing
```

**OAuth setup:**
1. Create project in Google Cloud Console
2. Enable required APIs (Gmail, Calendar, Drive, etc.)
3. Configure OAuth consent screen
4. Download credentials to `~/.openclaw/credentials/`
5. Authorize via `openclaw auth google`

#### Slack / Telegram / Discord (Communication)

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "BOT_TOKEN"
    },
    "slack": {
      "enabled": true,
      "botToken": "xoxb-xxx",
      "appToken": "xapp-xxx"
    }
  }
}
```

### 4.2 Integration Architecture

```
┌──────────────────────────────────────────┐
│              OpenClaw Gateway            │
├──────────┬──────────┬──────────┬─────────┤
│ GitHub   │ GWS      │ Telegram │ Slack   │
│ Skill    │ Skills   │ Channel  │ Channel │
├──────────┴──────────┴──────────┴─────────┤
│          Agent Sessions & Cron           │
├──────────────────────────────────────────┤
│          Memory & Knowledge Base         │
└──────────────────────────────────────────┘
```

### 4.3 Integration Best Practices

1. **Start with 2-3 integrations** — don't connect everything on day one
2. **Use skill-based architecture** — each integration is a skill with its own SKILL.md
3. **Rate-limit external API calls** — batch writes, respect 429s
4. **Log all external actions** — so you can audit what the AI did
5. **Test in sandbox first** — use test repos/channels before production

### 4.4 Paperclip / Multi-Agent Orchestration

For companies running multiple agents (like our ChipChip setup with 12 agents):

```bash
# Paperclip connects to OpenClaw gateway
# paperclip-config.yml
gateway:
  url: ws://127.0.0.1:18789
  adapter: openclaw

# Each agent has its own role/context
# Orchestrated via gateway session management
```

---

## 5. Monitoring & Maintenance

### 5.1 Essential Monitoring

#### Gateway Health

```bash
# Quick health check
openclaw gateway status

# Systemd status
sudo systemctl status openclaw

# Resource usage
htop
df -h /
free -m
```

#### Automated Health Check Script

```bash
#!/bin/bash
# /home/ubuntu/.openclaw/workspace/scripts/health-check.sh

echo "=== OpenClaw Health Check ==="
echo "Time: $(date)"
echo ""

# Gateway
echo "--- Gateway ---"
if curl -s http://127.0.0.1:18789/health > /dev/null 2>&1; then
  echo "✓ Gateway responding"
else
  echo "✗ Gateway DOWN — restarting..."
  sudo systemctl restart openclaw
fi

# Disk
echo ""
echo "--- Disk ---"
DISK_PCT=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%')
if [ "$DISK_PCT" -gt 80 ]; then
  echo "⚠ Disk at ${DISK_PCT}% — cleanup needed"
else
  echo "✓ Disk OK (${DISK_PCT}%)"
fi

# Memory
echo ""
echo "--- Memory ---"
MEM_PCT=$(free | awk '/Mem:/ {printf("%.0f", $3/$2 * 100)}')
if [ "$MEM_PCT" -gt 85 ]; then
  echo "⚠ Memory at ${MEM_PCT}%"
else
  echo "✓ Memory OK (${MEM_PCT}%)"
fi

# Token costs (if dashboard available)
echo ""
echo "--- Token Usage ---"
echo "Check: openclaw status (token summary)"
```

### 5.2 Log Management

```bash
# OpenClaw logs location
ls ~/.openclaw/logs/

# Rotate logs (add to cron)
# /etc/logrotate.d/openclaw
/home/ubuntu/.openclaw/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 0644 ubuntu ubuntu
}
```

### 5.3 Scheduled Maintenance (Cron)

```bash
# crontab -e

# Daily health check at 6 AM
0 6 * * * /home/ubuntu/.openclaw/workspace/scripts/health-check.sh >> /var/log/openclaw-health.log 2>&1

# Weekly disk cleanup (Sunday 3 AM)
0 3 * * 0 find ~/.openclaw/logs -name "*.log.gz" -mtime +14 -delete

# Monthly OpenClaw update check (1st of month)
0 9 1 * * echo "Check for OpenClaw updates: openclaw --version"
```

### 5.4 Observability Dashboard

For teams wanting real-time visibility, deploy a lightweight dashboard:

**Option A: OpenClaw Mission Control** (recommended)
- Built-in dashboard at the gateway URL
- Shows: agents, tasks, activity, token costs, feedback
- No additional infra needed

**Option B: Custom Prometheus + Grafana**
```bash
# Export key metrics
# - Gateway uptime
# - Active sessions
# - Token usage by model
# - API error rates
# - Response latency p50/p95
```

### 5.5 Alerting

```bash
# Simple Telegram/email alert on failure
#!/bin/bash
# alert.sh — called when health check fails

# Telegram
curl -s "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \
  -d "chat_id=${TG_CHAT_ID}" \
  -d "text=⚠️ OpenClaw health check failed at $(date)"

# Or email
echo "OpenClaw health check failed" | mail -s "ALERT: OpenClaw Down" admin@company.com
```

---

## 6. Quick Start Checklist

For a team starting from zero:

- [ ] **Week 1:** Set up VPS, install OpenClaw, configure gateway with systemd
- [ ] **Week 1:** Set up reverse proxy with TLS
- [ ] **Week 1:** Configure model routing (free tier → paid fallback)
- [ ] **Week 1:** Set up API keys with proper storage (not in git)
- [ ] **Week 2:** Connect GitHub integration
- [ ] **Week 2:** Connect primary communication channel (Telegram/Slack)
- [ ] **Week 2:** Set up health check script and disk monitoring
- [ ] **Week 3:** Connect Google Workspace (calendar, email)
- [ ] **Week 3:** Set up automated log rotation
- [ ] **Week 3:** Configure spend caps on model providers
- [ ] **Week 4:** Build custom skills for your team's workflows
- [ ] **Week 4:** Set up alerting for failures
- [ ] **Ongoing:** Weekly token cost review, monthly security audit

---

## 7. Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Using expensive model as default | Route to free/cheap first, expensive only on fallback |
| No disk monitoring | Set up alerts at 80% threshold |
| API keys in git | Use .env files, secret managers, gitignore |
| Gateway exposed publicly | Bind to 127.0.0.1, use reverse proxy |
| No log rotation | Configure logrotate for OpenClaw logs |
| Connecting all integrations day 1 | Start with 2-3, add as needed |
| No spend caps | Set daily limits in provider dashboards |
| Single point of failure | Systemd auto-restart + health monitoring |

---

## Appendix: File Layout Reference

```
~/.openclaw/
├── openclaw.json          # Main config (gateway, models, providers)
├── credentials/           # OAuth tokens and service account keys
├── logs/                  # Gateway and agent logs
├── memory/                # Agent memory databases
└── workspace/
    ├── AGENTS.md          # Agent behavior rules
    ├── SOUL.md            # Agent personality
    ├── TOOLS.md           # Local setup notes
    ├── scripts/           # Utility scripts (health checks, etc.)
    └── skills/            # Installed skills
```

---

*This guide reflects real production deployments. Adapt to your team's scale and compliance requirements.*
