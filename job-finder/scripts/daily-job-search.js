#!/usr/bin/env node
// Daily Job Search - runs from cron or manually
// Usage: node daily-job-search.js [--role=business-analyst] [--location=remote]

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROLES = [
  'business analyst',
  'operations manager banking',
  'compliance officer fintech',
  'project manager financial services',
  'business analyst remote Africa',
  'compliance consultant remote'
];

const OUTPUT_DIR = path.join(__dirname, 'search-results');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function searchLinkedInJobs(query, location = 'remote') {
  // LinkedIn doesn't have public API, so we generate search URLs
  const encodedQuery = encodeURIComponent(query);
  const encodedLocation = encodeURIComponent(location);
  return {
    source: 'LinkedIn',
    query: query,
    searchUrl: `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=${encodedLocation}`,
    note: 'Open URL in browser to view results'
  };
}

async function searchIndeed(query, location = 'remote') {
  const encodedQuery = encodeURIComponent(query);
  const encodedLocation = encodeURIComponent(location);
  return {
    source: 'Indeed',
    query: query,
    searchUrl: `https://www.indeed.com/jobs?q=${encodedQuery}&l=${encodedLocation}`,
    note: 'Open URL in browser to view results'
  };
}

async function searchRemoteOK(query) {
  const encodedQuery = encodeURIComponent(query);
  try {
    const url = `https://remoteok.com/api?tag=${encodedQuery.replace(/\s+/g, '-')}`;
    const data = await fetchUrl(url);
    const jobs = JSON.parse(data);
    // Filter out the legal/first item
    const filtered = jobs.filter(j => j.position).slice(0, 10);
    return {
      source: 'RemoteOK',
      query: query,
      jobs: filtered.map(j => ({
        title: j.position,
        company: j.company,
        url: `https://remoteok.com/remote-jobs/${j.id}`,
        location: j.location || 'Remote',
        salary: j.salary || 'Not specified',
        tags: j.tags || [],
        date: j.date
      }))
    };
  } catch (e) {
    return { source: 'RemoteOK', query: query, error: e.message };
  }
}

async function searchWeWorkRemotely(category = 'business') {
  try {
    const url = 'https://weworkremotely.com/categories/remote-business-jobs.json';
    const data = await fetchUrl(url);
    const parsed = JSON.parse(data);
    const jobs = (parsed.jobs || []).slice(0, 10).map(j => ({
      title: j.title,
      company: j.company?.name || 'Unknown',
      url: `https://weworkremotely.com${j.url}`,
      location: 'Remote',
      date: j.date
    }));
    return { source: 'WeWorkRemotely', jobs };
  } catch (e) {
    return { source: 'WeWorkRemotely', error: e.message };
  }
}

async function searchEthioJobs(query) {
  return {
    source: 'EthioJobs',
    query: query,
    searchUrl: `https://www.ethiojobs.net/jobs?query=${encodeURIComponent(query)}`,
    note: 'Ethiopian job board - open URL in browser'
  };
}

function generateObsidianNote(results) {
  const date = new Date().toISOString().split('T')[0];
  const lines = [
    '---',
    `title: Daily Job Search - ${date}`,
    'type: job-search',
    `date: ${date}`,
    '---',
    '',
    `# 📋 Daily Job Search - ${date}`,
    '',
    `## Search Queries`,
    ...ROLES.map(r => `- ${r}`),
    '',
    '## Results by Source',
    ''
  ];

  for (const result of results) {
    lines.push(`### ${result.source}`);
    lines.push(`Query: ${result.query || 'N/A'}`);
    
    if (result.jobs && result.jobs.length > 0) {
      lines.push(`Found: ${result.jobs.length} jobs`);
      lines.push('');
      for (const job of result.jobs.slice(0, 5)) {
        lines.push(`#### ${job.title}`);
        lines.push(`- **Company:** ${job.company}`);
        lines.push(`- **Location:** ${job.location}`);
        if (job.salary) lines.push(`- **Salary:** ${job.salary}`);
        if (job.tags?.length) lines.push(`- **Tags:** ${job.tags.join(', ')}`);
        lines.push(`- **URL:** ${job.url}`);
        lines.push(`- **Status:** 🔍 New`);
        lines.push('');
      }
    } else if (result.searchUrl) {
      lines.push(`Search URL: ${result.searchUrl}`);
      lines.push(`Note: ${result.note || 'Open in browser'}`);
      lines.push('');
    } else if (result.error) {
      lines.push(`⚠️ Error: ${result.error}`);
      lines.push('');
    }
  }

  lines.push('## Action Items');
  lines.push('- [ ] Review all new listings');
  lines.push('- [ ] Shortlist top 5 matches');
  lines.push('- [ ] Customize resume for each application');
  lines.push('- [ ] Apply to selected positions');
  lines.push('- [ ] Log applications in tracker');
  lines.push('');
  lines.push('## Notes');
  lines.push('_Generated by Job Finder Agent_');

  return lines.join('\n');
}

async function main() {
  console.log('🔍 Starting daily job search...\n');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allResults = [];
  
  for (const role of ROLES.slice(0, 3)) { // Limit to 3 queries
    console.log(`Searching: ${role}`);
    
    const [linkedin, indeed, remoteOK, ethiojobs] = await Promise.all([
      searchLinkedInJobs(role),
      searchIndeed(role),
      searchRemoteOK(role),
      searchEthioJobs(role)
    ]);
    
    allResults.push(linkedin, indeed, remoteOK, ethiojobs);
  }

  // Also check WeWorkRemotely
  const wwr = await searchWeWorkRemotely();
  allResults.push(wwr);

  // Generate Obsidian note
  const note = generateObsidianNote(allResults);
  const date = new Date().toISOString().split('T')[0];
  const filename = `daily-search-${date}.md`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filepath, note);
  console.log(`\n✅ Search complete! Results saved to: ${filepath}`);
  
  // Also output JSON for agent processing
  const jsonPath = path.join(OUTPUT_DIR, `results-${date}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(allResults, null, 2));
  console.log(`📊 JSON data: ${jsonPath}`);
  
  return { note, results: allResults, filepath };
}

main().catch(console.error);
