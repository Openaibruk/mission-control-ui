# Department → Subteam Hierarchy

Organization structure for Mission Control agent display.

## Departments
- **Orchestration** — Coordination, routing, synthesis
- **Engineering** — Build, DevOps, infrastructure
- **Quality & Safety** — QA, security, reviews
- **Analytics & Insights** — Data analysis, BI, reporting
- **Marketing & Content** — Strategy, content, design
- **Research** — Deep research, competitive scans

## Subteams (by Department)

### Orchestration
- **Coordination** (Nova)

### Engineering
- **Build** (Henok/Forge)
- **Architecture** (Kiro)
- **Integration** (Cipher)
- **Infrastructure** (Loki)

### Quality & Safety
- **QA** (Cinder, Yonas)
- **Security** (Onyx)

### Analytics & Insights
- **Data Science** (Amen)
- **Business Intelligence** (Lyra)
- **Operations Analytics** (Orion)

### Marketing & Content
- **Strategy** (Nahom)
- **Content** (Bini)
- **Design** (Lidya)

### Research
- **Deep Research** (Autoscientist, Researcher)

## Agent → Department/Subteam Mapping

| Agent | Department | Subteam |
|-------|-----------|---------|
| Nova | Orchestration | Coordination |
| Henok | Engineering | Build |
| Forge | Engineering | Build |
| Kiro | Engineering | Architecture |
| Cipher | Engineering | Integration |
| Loki | Engineering | Infrastructure |
| Cinder | Quality & Safety | QA |
| Yonas | Quality & Safety | QA |
| Onyx | Quality & Safety | Security |
| Amen | Analytics & Insights | Data Science |
| Orion | Analytics & Insights | Operations Analytics |
| Lyra | Analytics & Insights | Business Intelligence |
| Nahom | Marketing & Content | Strategy |
| Bini | Marketing & Content | Content |
| Lidya | Marketing & Content | Design |
| Autoscientist | Research | Deep Research |
| Aria | (unassigned) | (unassigned) |
| Aroma | (unassigned) | (unassigned) |
| Vision | (inactive) | (inactive) |

This mapping should be loaded into the `agents` table with `department` and `subTeam` columns.
