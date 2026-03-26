#!/usr/bin/env node
// Apply to Job - automated job application workflow
// Usage: node apply-to-job.js --url=<job-url> --company=<company> --role=<title>

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TRACKER_DIR = path.join(__dirname, '..', 'tracker');
const PROFILE_DIR = path.join(__dirname, '..', 'profile');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    const [key, value] = arg.replace('--', '').split('=');
    args[key] = value;
  });
  return args;
}

function loadProfile() {
  const profilePath = path.join(PROFILE_DIR, 'myProfile.md');
  const skillsPath = path.join(PROFILE_DIR, 'mySkills.md');
  
  return {
    profile: fs.existsSync(profilePath) ? fs.readFileSync(profilePath, 'utf8') : '',
    skills: fs.existsSync(skillsPath) ? fs.readFileSync(skillsPath, 'utf8') : ''
  };
}

function createJobTracker(args) {
  const date = new Date().toISOString().split('T')[0];
  const companySlug = (args.company || 'unknown').toLowerCase().replace(/\s+/g, '-');
  const roleSlug = (args.role || 'position').toLowerCase().replace(/\s+/g, '-');
  const filename = `${date}-${companySlug}-${roleSlug}.md`;
  const filepath = path.join(TRACKER_DIR, filename);

  const content = `---
title: ${args.role || 'Position'} - ${args.company || 'Company'}
type: job-application
status: new
applied: ${date}
source: ${args.source || 'direct'}
url: ${args.url || ''}
salary: ${args.salary || 'TBD'}
location: ${args.location || 'TBD'}
---

# ${args.role || 'Position'} - ${args.company || 'Company'}

**Status:** 🆕 New  
**Applied:** ${date}  
**Source:** ${args.source || 'Direct application'}  
**URL:** ${args.url || 'N/A'}  

## Job Description
${args.description || '_Paste job description here after reviewing the posting_'}

## Requirements Match
_Review each requirement against your profile_

| Requirement | Match | Evidence |
|-------------|-------|----------|
| | | |

## Application Materials
- [ ] Resume tailored
- [ ] Cover letter written  
- [ ] Portfolio/work samples prepared
- [ ] References contacted

## Timeline
- **Found:** ${date}
- **Applied:** 
- **Follow-up:** 
- **Interview:** 
- **Decision:** 

## Interview Prep
- [ ] Company research (see linked note)
- [ ] Role requirements reviewed
- [ ] STAR stories prepared
- [ ] Questions to ask ready
- [ ] Salary research done

## Notes
_Application tracked by Job Finder Agent_
`;

  fs.writeFileSync(filepath, content);
  console.log(`✅ Job tracker created: ${filepath}`);
  return filepath;
}

function updateMasterTracker(jobInfo) {
  const masterPath = path.join(TRACKER_DIR, 'master-tracker.md');
  let content = '';
  
  if (fs.existsSync(masterPath)) {
    content = fs.readFileSync(masterPath, 'utf8');
  }
  
  const date = new Date().toISOString().split('T')[0];
  const newRow = `| ${date} | ${jobInfo.company || 'TBD'} | ${jobInfo.role || 'TBD'} | 🆕 New | ${jobInfo.source || 'Direct'} | [Link](${jobInfo.url || '#'}) |`;
  
  if (!content.includes(masterPath)) {
    // Create master tracker if it doesn't exist
    content = `---
title: Job Application Master Tracker
type: tracker
lastUpdated: ${date}
---

# 📊 Job Application Master Tracker

**Total Applications:** 
**Active:** 
**Interview Stage:** 
**Offers:** 

## All Applications

| Date | Company | Role | Status | Source | Link |
|------|---------|------|--------|--------|------|
${newRow}

## Status Summary
- 🆕 **New:** 
- 📝 **Applied:** 
- 📞 **Phone Screen:** 
- 💼 **Interview:** 
- 🎯 **Final Round:** 
- ✅ **Offer:** 
- ❌ **Rejected:** 
- ⏸️ **Withdrawn:** 

## Success Metrics
- **Applications per week target:** 10
- **Response rate:** 
- **Interview conversion:** 
- **Average time to response:** 
`;
  } else {
    // Append to existing table
    const tableEnd = content.indexOf('\n## Status Summary');
    if (tableEnd > -1) {
      content = content.slice(0, tableEnd) + newRow + '\n' + content.slice(tableEnd);
    }
  }
  
  fs.writeFileSync(masterPath, content);
  console.log(`✅ Master tracker updated: ${masterPath}`);
}

// Main
const args = parseArgs();
if (!args.company && !args.role) {
  console.log('Usage: node apply-to-job.js --company="Company" --role="Role Title" [--url="..."] [--source="linkedin"] [--salary="..."] [--location="Remote"]');
  process.exit(1);
}

console.log('📝 Creating job application tracker...\n');
const filepath = createJobTracker(args);
updateMasterTracker(args);

console.log('\n📋 Next Steps:');
console.log('1. Review the job posting and fill in the description');
console.log('2. Compare requirements against your profile');
console.log('3. Tailor your resume');
console.log('4. Write a cover letter');
console.log('5. Apply and update the tracker status');
console.log('\n💡 Tip: Ask your AI assistant to help tailor your resume for this specific role');
