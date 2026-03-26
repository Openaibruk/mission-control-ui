# HR Recruiter Agent Builder - Technical Design Document

## 1. Overview
The HR Recruiter Agent is designed to automate the sourcing, screening, and recruitment of top talent, specifically targeting Business Analysts and Tech Talent for ChipChip. By repurposing our existing workspace scraping and search architecture, the agent will autonomously scan professional networks and job boards (LinkedIn, EthioJobs), evaluate candidate profiles against our criteria, and compile a structured pipeline of qualified leads.

## 2. Architecture & Folder Structure

The project will reside within the OpenClaw workspace as a dedicated skill or background agent task.

```text
/home/ubuntu/.openclaw/workspace/skills/hr-recruiter/
├── SKILL.md                 # Agent skill definition and execution instructions
├── config/
│   ├── search_queries.json  # Search parameters for BAs and Tech Talent
│   ├── screening_rubric.md  # Criteria for evaluating scraped profiles
│   └── target_platforms.yml # Selectors and API endpoints for LinkedIn/EthioJobs
├── scripts/
│   ├── scrape_linkedin.js   # Puppeteer/Playwright script for LinkedIn scraping
│   ├── scrape_ethiojobs.js  # Script for EthioJobs scraping
│   └── evaluate_profile.js  # LLM-based screening logic against the rubric
├── cron/
│   └── daily_sourcing.sh    # Entry point for the cron job to run the pipeline
├── data/
│   ├── raw_profiles/        # Scraped HTML/JSON before processing
│   └── qualified_leads.csv  # Final output pipeline of screened candidates
└── utils/
    └── notification.js      # Alerts to HR (e.g., via Telegram/Slack) when a top candidate is found
```

## 3. Search & Scraping Logic

### 3.1. Target Platforms
- **LinkedIn:** Use headless browser automation (e.g., Playwright) to perform boolean searches. 
  - *Example Search BAs:* `("Business Analyst" OR "Data Analyst") AND ("Addis Ababa" OR "Ethiopia") AND ("Fintech" OR "E-commerce")`
  - *Example Search Tech:* `("Software Engineer" OR "Full Stack Developer" OR "Backend Developer") AND ("Node.js" OR "React") AND "Addis Ababa"`
- **EthioJobs:** Scrape the resume database or newly posted profiles using platform-specific search parameters mapping to our tech and BA requirements.

### 3.2. Data Extraction
The scraper will extract key data points from each profile:
- Name and Contact Info (if available)
- Current Job Title & Company
- Years of Experience
- Key Skills and Endorsements
- Education

### 3.3. LLM-Based Screening
Once a profile is scraped, it is passed to an LLM evaluator (using our existing agent architecture). The LLM analyzes the extracted text against `screening_rubric.md`.
- **Scoring:** Assigns a match score (0-100).
- **Filtering:** Profiles scoring above a threshold (e.g., 80+) are added to `qualified_leads.csv`.

## 4. Cron Job Integration

To ensure a continuous pipeline of talent, the system will run autonomously via cron.

### 4.1. Cron Configuration
Add the following entry to the system crontab (`crontab -e`) to run the sourcing pipeline daily at 2:00 AM EAT:
```cron
# Run HR Recruiter Sourcing Pipeline daily at 2:00 AM
0 2 * * * /bin/bash /home/ubuntu/.openclaw/workspace/skills/hr-recruiter/cron/daily_sourcing.sh >> /home/ubuntu/.openclaw/workspace/logs/hr_recruiter.log 2>&1
```

### 4.2. Execution Flow
1. **Trigger:** Cron triggers `daily_sourcing.sh`.
2. **Scraping Phase:** The script initiates `scrape_linkedin.js` and `scrape_ethiojobs.js`.
3. **Processing Phase:** Extracted profiles are fed into `evaluate_profile.js`.
4. **Update Phase:** Qualified candidates are appended to `qualified_leads.csv` or pushed directly to the Mission Control Supabase database.
5. **Notification:** A summary message (e.g., "Found 3 high-match Software Engineers today") is sent to the designated Telegram channel via `notification.js`.

## 5. Security & Rate Limiting
- **Rate Limits:** Implement randomized delays (jitter) between page loads to avoid triggering CAPTCHAs or IP bans on LinkedIn.
- **Session Management:** Rotate user agents and manage authentication cookies securely to maintain scraping sessions.
- **Data Privacy:** Ensure scraped data is stored securely and compliant with local data protection regulations, deleting raw HTML after processing.
