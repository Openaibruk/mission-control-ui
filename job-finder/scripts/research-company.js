#!/usr/bin/env node
// Company Research Script
// Usage: node research-company.js --company="Company Name"

const https = require('https');
const fs = require('fs');
const path = require('path');

const RESEARCH_DIR = path.join(__dirname, '..', 'research');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    const [key, value] = arg.replace('--', '').split('=');
    args[key] = value;
  });
  return args;
}

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function searchNews(company) {
  try {
    const query = encodeURIComponent(`${company} news 2026`);
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
    const data = await fetchUrl(url);
    // Extract titles from RSS
    const titles = data.match(/<title>([^<]+)<\/title>/g)?.slice(0, 10).map(t => 
      t.replace(/<\/?title>/g, '')
    ) || [];
    return titles.filter(t => !t.includes('Google News'));
  } catch (e) {
    return [`Error fetching news: ${e.message}`];
  }
}

function generateResearchNote(company, news) {
  const date = new Date().toISOString().split('T')[0];
  const slug = company.toLowerCase().replace(/\s+/g, '-');
  
  return `---
title: ${company} Research
type: company-research
date: ${date}
---

# 🏢 ${company} - Research Notes

**Research Date:** ${date}
**Purpose:** Job application preparation

## Basic Information
- **Industry:** 
- **Headquarters:** 
- **Company Size:** 
- **Founded:** 
- **Website:** 
- **LinkedIn:** 

## Business Overview
- **Products/Services:** 
- **Target Market:** 
- **Business Model:** 
- **Key Competitors:** 

## Recent News & Headlines
${news.length > 0 ? news.map(n => `- ${n}`).join('\n') : '- No recent news found'}

## Culture & Work Environment
- **Glassdoor Rating:** /5
- **Work Model:** (Remote/Hybrid/Onsite)
- **Values:** 
- **Team Size (this department):** 

## Employee Sentiment
### What Employees Like
- 

### What Employees Dislike
- 

## Interview Process (Typical)
1. 
2. 
3. 

## Red Flags to Watch
- [ ] Recent layoffs
- [ ] High turnover
- [ ] Negative press
- [ ] Unrealistic requirements
- [ ] Vague compensation

## My Assessment
**Overall Rating:** ⭐⭐⭐☆☆ (3/5)
**Fit for My Skills:** 
**Growth Potential:** 
**Compensation Competitiveness:** 

## Questions to Ask in Interview
1. 
2. 
3. 

## Next Steps
- [ ] Deep dive on Glassdoor reviews
- [ ] Connect with current/former employees on LinkedIn
- [ ] Research specific team/department
- [ ] Prepare role-specific examples

---
_Research compiled by Job Finder Agent_
`;
}

async function main() {
  const args = parseArgs();
  const company = args.company;
  
  if (!company) {
    console.log('Usage: node research-company.js --company="Company Name"');
    process.exit(1);
  }

  console.log(`🔍 Researching: ${company}\n`);

  if (!fs.existsSync(RESEARCH_DIR)) {
    fs.mkdirSync(RESEARCH_DIR, { recursive: true });
  }

  // Fetch news
  console.log('📰 Fetching recent news...');
  const news = await searchNews(company);

  // Generate research note
  const note = generateResearchNote(company, news);
  const slug = company.toLowerCase().replace(/\s+/g, '-');
  const date = new Date().toISOString().split('T')[0];
  const filename = `${date}-${slug}-research.md`;
  const filepath = path.join(RESEARCH_DIR, filename);

  fs.writeFileSync(filepath, note);
  console.log(`✅ Research note created: ${filepath}`);
  console.log('\n📋 Next Steps:');
  console.log('1. Fill in company details from their website');
  console.log('2. Check Glassdoor for employee reviews');
  console.log('3. Look up interview process on Blind/Glassdoor');
  console.log('4. Research the specific team/department');
  console.log('5. Prepare role-specific STAR stories');

  return filepath;
}

main().catch(console.error);
