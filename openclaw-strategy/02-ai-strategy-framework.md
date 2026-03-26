# AI Strategy Framework

> Practical guide for adopting AI tools, workflows, and infrastructure across a company.

---

## 1. Tool Categories & Recommendations

### Coding & Development

| Tool | Use Case | Cost Model |
|------|----------|------------|
| **GitHub Copilot** | In-IDE code completion, chat | $10-19/user/mo |
| **Cursor** | AI-native IDE, multi-file edits | $20/user/mo |
| **Claude Code / Aider** | Terminal-based autonomous coding | API token cost |
| **OpenClaw** | Agent orchestration, multi-agent workflows | Self-hosted + API |
| **ChatGPT / Claude** | Architecture discussion, debugging | $20/user/mo |

**Recommendation:** Start with GitHub Copilot for all devs + Claude/ChatGPT for senior devs doing architecture. Add Cursor for teams doing rapid prototyping. Use OpenClaw for orchestrated multi-step dev workflows.

### Content & Marketing

| Tool | Use Case |
|------|----------|
| **ChatGPT / Claude** | Draft copy, brainstorm, edit |
| **Midjourney / DALL-E** | Image generation |
| **ElevenLabs** | Voice/audio content |
| **Descript** | Video/audio editing with AI |

**Recommendation:** Give marketing team a shared ChatGPT or Claude team subscription. One Midjourney seat for the designer. Everything else on-demand.

### Data Analysis

| Tool | Use Case |
|------|----------|
| **ChatGPT Code Interpreter** | Ad-hoc analysis, CSV uploads |
| **Claude** | Data interpretation, SQL generation |
| **Jupyter + AI plugins** | Notebook-based analysis |
| **Metabase / Looker + AI** | BI dashboards with natural language queries |

**Recommendation:** Code Interpreter for non-technical analysts. Claude for SQL generation. Don't build custom analytics AI unless you have 10+ analysts.

### Customer Support

| Tool | Use Case |
|------|----------|
| **Intercom Fin** | AI-powered support agent |
| **Zendesk AI** | Ticket routing + suggested replies |
| **Custom RAG bot** | Domain-specific Q&A on your docs |
| **Voiceflow / Botpress** | No-code chatbot builder |

**Recommendation:** Start with your existing helpdesk's AI features (Intercom Fin, Zendesk AI). Build a custom RAG bot only if off-the-shelf fails on your domain knowledge.

### Internal Productivity

| Tool | Use Case |
|------|----------|
| **Notion AI** | Document summarization, writing |
| **Google Gemini** | Workspace integration (Gmail, Docs, Sheets) |
| **Slack AI** | Channel summaries, search |
| **Otter / Fireflies** | Meeting transcription + summaries |

**Recommendation:** Pick one ecosystem (Google or Microsoft) and use its AI features. Add meeting transcription for teams with 5+ meetings/week.

---

## 2. Workflow Patterns

### Pattern 1: BMAD Method (Already Adopted)
Break → Model → Automate → Deploy

This is your foundation. Every AI workflow should go through these stages:

1. **Break** - Decompose the task into discrete steps
2. **Model** - Define inputs, outputs, and decision points for each step
3. **Automate** - Wire up AI agents and tools to handle each step
4. **Deploy** - Ship, monitor, iterate

### Pattern 2: AI-Augmented Review Loop
```
Human defines task → AI generates draft → Human reviews → AI revises → Human approves
```
Use for: code reviews, content creation, design iterations, document drafting.

### Pattern 3: Triage & Route
```
Incoming item → AI classifies → Routes to right person/tool → Handles simple cases, escalates complex ones
```
Use for: support tickets, bug reports, feature requests, email routing.

### Pattern 4: Research & Synthesize
```
Question → AI gathers info from multiple sources → Synthesizes findings → Presents summary to human
```
Use for: competitive analysis, market research, technical investigations, onboarding docs.

### Pattern 5: Multi-Agent Orchestration
```
Orchestrator breaks task → Spawns specialist agents → Each handles a subtask → Results merged → Human reviews final output
```
Use for: complex development tasks, content pipelines, data processing workflows. This is what OpenClaw does with subagents.

### Pattern 6: Continuous Background Monitoring
```
AI watches for triggers (new email, commit, metric change) → Evaluates significance → Takes action or alerts human
```
Use for: CI/CD monitoring, email triage, anomaly detection, social media monitoring.

### Implementing a New Workflow

1. **Identify the pain point** - Where do people waste time on repetitive work?
2. **Map the current flow** - Document every step, decision, and handoff
3. **Pick the right pattern** - Which pattern above matches?
4. **Prototype with existing tools** - Don't build custom until you've proven value
5. **Measure before/after** - Time saved, error rate, satisfaction
6. **Standardize and share** - Document the workflow, train the team

---

## 3. Infrastructure Checklist

### API & Model Access

- [ ] **Choose primary providers:** OpenAI, Anthropic, Google (pick 2 for redundancy)
- [ ] **Set up API accounts** with billing alerts at $50, $100, $500 thresholds
- [ ] **Use OpenRouter** (or similar) for unified access to multiple models + usage tracking
- [ ] **Document which model for what:** e.g., Claude for coding, GPT-4 for content, Gemini for analysis
- [ ] **Set up a proxy/gateway** (like OpenClaw) to centralize API key management

### Compute & Hosting

- [ ] **Self-host where it makes sense:** OpenClaw on a VPS ($20-50/mo) beats paying per-seat for many SaaS AI tools
- [ ] **GPU access on-demand:** RunPod, Lambda, or Vast.ai for training/fine-tuning (don't buy GPUs unless you're running models 24/7)
- [ ] **Containerize AI workflows:** Docker for reproducibility, easy deployment

### Data & Storage

- [ ] **Vector database:** Qdrant, Pinecone, or pgvector (PostgreSQL extension) for RAG
- [ ] **Document store:** S3/GCS for source documents, with metadata indexing
- [ ] **Embedding pipeline:** Automated ingestion of company docs, code, knowledge base

### Monitoring & Observability

- [ ] **Usage dashboard:** Track API calls, tokens, costs per team/project
- [ ] **Error logging:** Capture failed API calls, rate limits, quality issues
- [ ] **Cost alerts:** Automated notifications when spending exceeds thresholds
- [ ] **Quality metrics:** Track hallucination rates, user satisfaction, task completion rates

### Development Environment

- [ ] **AI-enhanced IDEs** available to all developers (Copilot, Cursor)
- [ ] **Shared prompt library** for common tasks (stored in Git, versioned)
- [ ] **CI/CD integration:** AI code review in PR pipeline
- [ ] **Sandbox environments** for testing AI-generated code safely

---

## 4. Cost Optimization

### Model Selection Strategy

Use the cheapest model that gets the job done:

| Task Complexity | Recommended Model | Approx Cost |
|----------------|-------------------|-------------|
| Simple (formatting, classification) | GPT-4o-mini, Claude Haiku | $0.25-1.00/M tokens |
| Medium (summarization, drafting) | GPT-4o, Claude Sonnet | $3-15/M tokens |
| Complex (architecture, deep analysis) | Claude Opus, GPT-4 | $15-75/M tokens |
| Coding (agent-based) | Claude Sonnet, GPT-4o | $3-15/M tokens |

**Rule of thumb:** Start cheap. Escalate to expensive models only when cheap ones fail.

### Cost Control Measures

1. **Set hard budget caps** per team/month. Not suggestions—hard stops.
2. **Cache aggressively.** If you're asking the same question twice, you're burning money. Use prompt caching and response caching.
3. **Batch non-urgent work.** Process overnight when possible (some providers offer batch discounts).
4. **Use smaller models for routing.** A cheap model decides if a task needs a powerful model. Saves 60-80% on routine tasks.
5. **Kill idle agents.** Set timeouts on all AI workflows. An agent looping for 10 minutes costs real money.
6. **Self-host open-source models** for high-volume, low-complexity tasks (e.g., Llama 3 for internal chat).

### ROI Tracking

Measure every AI workflow against:
- **Time saved** (hours/week freed up)
- **Cost of AI** (API fees + tool subscriptions)
- **Net value** (time saved × hourly rate - AI cost)

If net value is negative after 30 days, kill it.

### Budget Allocation (Starting Point)

For a 20-person company starting out:
- **Dev tools** (Copilot, API access): $500-800/mo
- **Content/productivity** (ChatGPT teams, Notion AI): $300-500/mo
- **Infrastructure** (VPS, vector DB, monitoring): $100-200/mo
- **Buffer** (experiments, spikes): $200-300/mo
- **Total:** ~$1,100-1,800/mo

Scale up only when you've proven ROI on what you have.

---

## 5. Security & Governance

### Data Classification

Before connecting any AI tool, classify your data:

| Level | Description | AI Usage Rules |
|-------|-------------|----------------|
| **Public** | Marketing content, public docs | Safe for any AI tool |
| **Internal** | Internal docs, non-sensitive code | OK with approved tools, no public APIs |
| **Confidential** | Customer data, financials, PII | Self-hosted models only, or enterprise API with DPA |
| **Restricted** | Legal, HR, trade secrets | No external AI. Self-hosted with audit logs only. |

### Rules of Engagement

1. **Never paste customer PII into public AI tools.** Not ChatGPT, not Claude web, not Bard. Use API with data processing agreements.
2. **No company code in public AI playgrounds.** Use Copilot (has enterprise terms) or self-hosted.
3. **Review AI-generated code before merge.** Always. No exceptions. AI can introduce vulnerabilities.
4. **Log all AI interactions** that touch confidential data. Audit trail is non-negotiable.
5. **Rotate API keys quarterly.** Use environment variables, never hardcode.

### Governance Structure

**AI Champion (1 person):**
- Owns the AI strategy and tool selection
- Reviews new tool requests
- Monitors costs and usage
- Reports to leadership quarterly

**Team Leads:**
- Responsible for AI adoption in their team
- Identify workflow automation opportunities
- Escalate security concerns

**Everyone:**
- Complete AI security awareness training (1 hour, once)
- Follow data classification rules
- Report AI errors/hallucinations that cause issues

### Incident Response

When AI does something wrong:
1. **Contain:** Stop the workflow, disable the integration
2. **Assess:** What data was exposed? What damage was done?
3. **Fix:** Correct the output, notify affected parties if needed
4. **Learn:** Update prompts, add guardrails, document the failure
5. **Resume:** Re-enable with fixes applied

### Vendor Evaluation Checklist

Before adopting any AI tool:
- [ ] Data processing agreement (DPA) in place?
- [ ] Data retention policy acceptable?
- [ ] SOC 2 or equivalent certification?
- [ ] Can you delete your data on request?
- [ ] Does it train on your data? (If yes, can you opt out?)
- [ ] Where is data processed? (EU/US compliance considerations)

---

## Quick Start: First 30 Days

**Week 1:**
- Set up OpenRouter or direct API accounts for 2 providers
- Deploy GitHub Copilot to all developers
- Pick one non-dev team and give them ChatGPT/Claude access

**Week 2:**
- Identify 3 repetitive workflows to automate
- Set up cost monitoring and budget alerts
- Write your data classification policy (1 page, keep it simple)

**Week 3:**
- Prototype one workflow automation (pick the easiest win)
- Run AI security awareness session (1 hour)
- Start tracking time saved

**Week 4:**
- Review first month's costs and usage
- Decide: scale up, hold, or cut
- Document what worked, share with team

---

*This framework is a living document. Update it as tools change, costs shift, and your team's needs evolve.*
