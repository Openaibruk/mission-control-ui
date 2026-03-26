#!/usr/bin/env node
// Job Application Follow-up Reminder System
// Tracks applications and sends reminders

const fs = require('fs');
const path = require('path');

const TRACKER_DIR = path.join(__dirname, '..', 'tracker');

function getApplicationsNeedingFollowUp() {
  if (!fs.existsSync(TRACKER_DIR)) return [];
  
  const files = fs.readdirSync(TRACKER_DIR).filter(f => f.endsWith('.md') && f !== 'master-tracker.md');
  const now = new Date();
  const followUps = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(TRACKER_DIR, file), 'utf8');
    
    // Parse frontmatter
    const fmMatch = content.match(/---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    
    const fm = fmMatch[1];
    const status = fm.match(/status:\s*(.+)/)?.[1]?.trim();
    const applied = fm.match(/applied:\s*(.+)/)?.[1]?.trim();
    const company = fm.match(/title:\s*(.+?)\s*-/)?.[1]?.trim() || file;
    
    if (status === 'applied' && applied) {
      const appliedDate = new Date(applied);
      const daysSince = Math.floor((now - appliedDate) / (1000 * 60 * 60 * 24));
      
      if (daysSince >= 5 && daysSince <= 14) {
        followUps.push({
          file,
          company,
          applied,
          daysSince,
          action: daysSince >= 7 ? 'Send follow-up email' : 'Consider following up'
        });
      }
    }
  }

  return followUps;
}

function getApplicationStats() {
  if (!fs.existsSync(TRACKER_DIR)) return { total: 0 };
  
  const files = fs.readdirSync(TRACKER_DIR).filter(f => f.endsWith('.md') && f !== 'master-tracker.md');
  const stats = { total: files.length, byStatus: {} };

  for (const file of files) {
    const content = fs.readFileSync(path.join(TRACKER_DIR, file), 'utf8');
    const status = content.match(/status:\s*(.+)/)?.[1]?.trim() || 'unknown';
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
  }

  return stats;
}

function generateReport() {
  const followUps = getApplicationsNeedingFollowUp();
  const stats = getApplicationStats();
  const date = new Date().toISOString().split('T')[0];

  let report = `# 📊 Job Search Status - ${date}

## Application Statistics
- **Total Applications:** ${stats.total}
${Object.entries(stats.byStatus).map(([s, c]) => `- **${s}:** ${c}`).join('\n')}

## Follow-up Needed
`;

  if (followUps.length === 0) {
    report += '✅ No applications need follow-up right now.\n';
  } else {
    report += '| Company | Applied | Days Ago | Action |\n|---------|---------|----------|--------|\n';
    for (const f of followUps) {
      report += `| ${f.company} | ${f.applied} | ${f.daysSince} | ${f.action} |\n`;
    }
  }

  report += `
## Weekly Goals
- **Applications target:** 10
- **This week:** ${stats.byStatus['new'] || 0} new
- **Response rate:** ${stats.total > 0 ? Math.round(((stats.byStatus['interview'] || 0) / stats.total) * 100) : 0}%

## Tips
- Follow up 5-7 business days after applying
- Customize resume for each application
- Track all interactions in the job tracker files
- Research companies before applying
`;

  return report;
}

// Main
const report = generateReport();
console.log(report);

// Save report
const date = new Date().toISOString().split('T')[0];
const reportPath = path.join(TRACKER_DIR, `status-report-${date}.md`);
fs.writeFileSync(reportPath, report);
console.log(`\n📄 Report saved to: ${reportPath}`);
