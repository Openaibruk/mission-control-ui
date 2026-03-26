# 🎯 Job Finder Agent

Automated job search, application tracking, and interview preparation system powered by OpenClaw.

## Quick Start

### Daily Workflow
```bash
# Run daily job search
node scripts/daily-job-search.js

# Apply to a specific job
node scripts/apply-to-job.js --company="Company" --role="Role" --url="..."

# Research a company
node scripts/research-company.js --company="Company Name"

# Check application status
node scripts/follow-up-tracker.js
```

### Agent Commands (via OpenClaw)
```
/search-jobs                    → Run daily job search
/apply --company=X --role=Y     → Create application tracker
/research --company=X           → Research company
/job-status                     → Application status report
```

## Directory Structure

```
job-finder/
├── README.md           ← You are here
├── config.json         ← Job search preferences
├── profile/
│   ├── myProfile.md    ← Your professional profile
│   └── mySkills.md     ← Skills matrix & gap analysis
├── scripts/
│   ├── daily-job-search.js    ← Automated job board search
│   ├── apply-to-job.js        ← Application tracker creator
│   ├── research-company.js    ← Company research generator
│   └── follow-up-tracker.js   ← Follow-up reminders
├── tracker/
│   ├── master-tracker.md      ← All applications overview
│   └── YYYY-MM-DD-*.md        ← Individual applications
├── research/
│   └── YYYY-MM-DD-company.md  ← Company research notes
├── templates/
│   ├── job-template.md        ← Job posting template
│   ├── interview-prep-template.md
│   └── company-research-template.md
└── search-results/
    ├── daily-search-YYYY-MM-DD.md
    └── results-YYYY-MM-DD.json
```

## Cron Schedule

| Task | Frequency | Time | Description |
|------|-----------|------|-------------|
| Daily Job Search | Daily | 9:00 AM EAT | Search all job boards |
| Follow-up Check | Daily | 10:00 AM EAT | Remind about pending follow-ups |
| Weekly Report | Monday | 8:00 AM EAT | Application stats & metrics |
| Skills Update | Sunday | 6:00 PM EAT | Review & update skills matrix |

## Job Boards Covered

1. **LinkedIn** - Professional network jobs
2. **Indeed** - General job board
3. **RemoteOK** - Remote positions (API)
4. **WeWorkRemotely** - Remote jobs (API)
5. **EthioJobs** - Ethiopian job market
6. **BrighterMonday** - East Africa jobs

## Obsidian Integration

All notes are formatted for Obsidian with:
- YAML frontmatter for metadata
- Tags for filtering and search
- Wiki-links for connecting related notes
- Dataview-compatible properties

To sync to your local Obsidian vault:
1. Copy files from `tracker/`, `research/`, `profile/` to your vault
2. Or use Obsidian REST API MCP tools to create notes directly

## Profile & Skills

Edit `profile/myProfile.md` and `profile/mySkills.md` to:
- Update work experience
- Add new skills as you learn them
- Track certifications and training
- Identify gaps for target roles

The agent uses these to:
- Match you with suitable job postings
- Tailor application materials
- Prepare for interviews
- Track career development

## Tips for Success

1. **Apply consistently** - Aim for 10+ applications per week
2. **Customize each application** - Use the agent to tailor your resume
3. **Track everything** - Log all applications and follow-ups
4. **Research companies** - Never apply without research
5. **Prepare for interviews** - Use the interview prep template
6. **Follow up** - The agent will remind you after 5 days
7. **Network** - Connect with people at target companies
8. **Learn continuously** - Fill skill gaps identified in your matrix

---

*Powered by OpenClaw AI - Your personal job search assistant* 🦞
