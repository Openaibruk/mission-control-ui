# AI Environment Setup Guide for Companies

*A practical guide for adopting AI tools like OpenClaw in production environments.*

---

## 1. Infrastructure Requirements

### VPS / Cloud (Recommended for Most Teams)

- **Minimum:** 2 vCPU, 2GB RAM, 20GB disk — handles a single OpenClaw instance with moderate usage
- **Recommended:** 4 vCPU, 4GB RAM, 40GB+ disk — supports multiple agents, vector memory, and concurrent sessions
- **Providers:** AWS EC2, DigitalOcean, Hetzner, Vultr, Railway
- **OS:** Ubuntu 22.04+ or Debian 12 — best Node.js and systemd support
- **Networking:** Static IP, open ports (HTTPS/443, WSS), firewall via `ufw` or cloud security groups

### Local / On-Premises

- Suitable for air-gapped or highly regulated environments
- Requires local Node.js runtime and outbound HTTPS to model providers (OpenRouter, Anthropic, OpenAI)
- Consider self-hosted models (Ollama, llama.cpp) for fully offline setups — trade-off is quality vs. privacy

### Key Decisions

| Factor | VPS/Cloud | Local |
|--------|-----------|-------|
| Setup time | Minutes | Hours–days |
| Maintenance | Provider-managed | Your team |
| Latency | Low (co-located APIs) | Variable |
| Data sovereignty | Depends on region | Full control |
| Cost | $10–50/mo typical | Hardware + power |

---

## 2. Environment Setup

### Node.js Runtime

```bash
# Install Node.js 22+ (LTS recommended)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs

# Verify
node -v  # Should be v22.x+
npm -v
```

### OpenClaw Installation

```bash
npm install -g openclaw
openclaw init
openclaw gateway start
```

### API Keys & Providers

- **OpenRouter** — multi-model gateway (Claude, GPT, Gemini, etc.) via single API key
- **Anthropic** — direct Claude access for higher rate limits
- **OpenAI** — direct GPT access
- **Google AI** — Gemini models

Store keys in environment variables or `.env` files — never in code.

```bash
# .env example
OPENROUTER_API_KEY=sk-or-v1-...
ANTHROPIC_API_KEY=sk-ant-...
```

### OAuth Configuration (Google Workspace, etc.)

- Create a Google Cloud project → enable required APIs (Gmail, Calendar, Drive, Chat)
- Configure OAuth consent screen → add scopes
- Generate client credentials → store securely
- Run initial auth flow to obtain refresh tokens

### Webhooks & External Connections

- Configure webhook endpoints for real-time integrations (Telegram, Slack, Discord)
- Use a reverse proxy (nginx/Caddy) for TLS termination
- Set up health check endpoints at `/health` for monitoring

---

## 3. Security Best Practices

### Secrets Management

- **Never** commit API keys, tokens, or credentials to Git
- Use `.env` files with `.gitignore` entries
- For production: use AWS Secrets Manager, HashiCorp Vault, or encrypted env vars
- Rotate keys quarterly or immediately on suspected compromise

### Access Control

- Run OpenClaw as a non-root user with minimal privileges
- Use systemd service files with `User=` and `ProtectHome=` directives
- Firewall rules: only expose necessary ports (443, SSH)
- Disable SSH password auth — use key-based only
- Enable 2FA on all cloud provider accounts

### Network Security

```bash
# UFW example
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Data Protection

- Encrypt disk volumes (LUKS, AWS EBS encryption)
- Regular backups of agent memory, configs, and databases
- Audit logs: who accessed what, when
- Set up log rotation to prevent disk exhaustion

### Agent Permissions

- Agents should have **least-privilege** access to tools
- Separate API keys per agent/environment (dev vs. prod)
- Review and restrict outbound network access where possible
- Sandbox file operations to workspace directory

---

## 4. Team Onboarding

### Agent Configuration

1. **Define roles** — each agent has a purpose (customer support, devops, content, etc.)
2. **Create AGENTS.md** — shared instructions for all agents
3. **Set up SOUL.md** — define tone, personality, boundaries
4. **Configure memory** — enable vector store + FTS for long-term context

### Skills Loading

```bash
# Browse available skills
openclaw skills list

# Install skills for your use case
openclaw skills install gws-gmail
openclaw skills install gws-calendar
openclaw skills install github
```

Skills are the primary way to extend agent capabilities. Each skill is a self-contained module with instructions and tool access.

### Onboarding Checklist

- [ ] Agent identity defined (name, role, capabilities)
- [ ] AGENTS.md + SOUL.md configured
- [ ] API keys provisioned and tested
- [ ] Skills installed for required integrations
- [ ] Memory store initialized
- [ ] Communication channels connected (Telegram, Slack, etc.)
- [ ] Test run: agent completes a basic workflow end-to-end
- [ ] Monitoring and alerting configured

### Multi-Agent Teams

- Use `@AgentName` mentions for cross-agent communication
- Configure shared memory spaces for team coordination
- Define clear ownership boundaries to prevent conflicts
- Use subagents for isolated, short-lived tasks

---

## 5. Integration Patterns

### Google Workspace

- **Gmail:** Read, send, reply, forward, triage inbox
- **Calendar:** Create events, show agendas, meeting prep
- **Drive:** Upload, share, organize files
- **Chat:** Post updates to spaces, respond to messages
- **Docs/Sheets:** Read and write documents programmatically

### Slack / Discord / Telegram

- Connect via gateway webhooks or native integrations
- Use channel-specific agents (e.g., #support → support agent)
- Set up mention-based routing for multi-agent setups

### CRM & Business Tools

- REST API integrations via custom skills
- Webhook triggers for real-time data flow
- Database connections (Supabase, PostgreSQL) for structured data

### CI/CD & DevOps

- GitHub integration for PR reviews, issue management, CI monitoring
- Deployment automation via Vercel/CLI skills
- Incident response agents with monitoring integrations

### Architecture Patterns

```
User Message → Gateway → Agent → Skill → External API
                              ↓
                          Memory Store ← → Vector DB
```

- **Event-driven:** Webhooks push events, agents react
- **Request-response:** User asks, agent acts
- **Scheduled:** Cron triggers periodic tasks (health checks, reports)
- **Pipeline:** Multi-agent chains for complex workflows

---

## 6. Cost Optimization

### Model Routing

- Use **free/cheap models** for routine tasks (summarization, triage, simple Q&A)
- Reserve **premium models** (Claude Opus, GPT-4) for complex reasoning, code, creative work
- OpenRouter makes this easy: single key, many models, pay-per-token

### Token Management

- Keep system prompts concise — every token costs
- Use memory retrieval instead of stuffing full context
- Set `max_tokens` limits on responses
- Monitor token usage via dashboard (e.g., OpenClaw token cost tracking)

### Practical Tips

| Strategy | Savings |
|----------|---------|
| Use free models for low-stakes tasks | 80-100% |
| Compress system prompts | 20-40% |
| RAG instead of full-context | 50-70% |
| Cache repeated queries | Variable |
| Batch similar requests | 10-30% |

### Budget Controls

- Set monthly spending alerts per API key
- Track cost per agent, per channel
- Review weekly: which models are overused for simple tasks?
- Consider self-hosted models for high-volume, low-complexity workloads

---

## 7. Monitoring & Maintenance

### Health Checks

```bash
# Gateway status
openclaw gateway status

# Service health (systemd)
systemctl status openclaw-gateway

# Disk usage
df -h /

# Memory
free -h
```

Set up automated health checks via cron or uptime monitors (UptimeRobot, Healthchecks.io).

### Logging

- OpenClaw logs to standard output → captured by systemd journal
- Use `journalctl -u openclaw-gateway -f` for live logs
- Set up log rotation: `/etc/logrotate.d/openclaw`
- Ship logs to centralized logging for production (ELK, Grafana Loki, CloudWatch)

### Updates

```bash
# Update OpenClaw
npm update -g openclaw

# Update skills
openclaw skills update --all

# Update Node.js (major versions)
# Re-run nodesource installer, then:
openclaw gateway restart
```

### Maintenance Schedule

| Frequency | Task |
|-----------|------|
| Daily | Check gateway status, review error logs |
| Weekly | Disk usage check, token cost review |
| Monthly | Update packages, rotate non-critical secrets |
| Quarterly | Security audit, key rotation, backup verification |
| Yearly | Infrastructure review, cost optimization, architecture assessment |

### Alerting

- Disk usage > 80% → alert
- Gateway down → auto-restart + alert
- Token spend > budget → alert
- Failed health checks → alert
- Unusual API error rates → alert

### Backup Strategy

- **Daily:** Automated snapshot of workspace, configs, memory store
- **Weekly:** Full backup including agent state and databases
- **Test restores** quarterly — a backup you've never tested isn't a backup

---

## Quick Start Checklist

1. [ ] Provision infrastructure (VPS or local)
2. [ ] Install Node.js 22+ and OpenClaw
3. [ ] Configure API keys (OpenRouter recommended)
4. [ ] Set up OAuth for required integrations
5. [ ] Configure firewall and security basics
6. [ ] Create first agent with AGENTS.md + SOUL.md
7. [ ] Install skills for your use case
8. [ ] Connect communication channel (Telegram/Slack)
9. [ ] Run test workflow end-to-end
10. [ ] Set up monitoring and backups

---

*Guide generated for companies adopting AI tools. Adapt sections to your specific needs, compliance requirements, and scale.*
