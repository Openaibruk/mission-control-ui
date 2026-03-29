const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceSkillsPath = path.resolve(__dirname, '../../skills');
const globalSkillsPath = '/home/ubuntu/.npm-global/lib/node_modules/openclaw/skills';
const outPath = path.resolve(__dirname, '../../apps/mission-control-ui/public/api/skills.json');

function scanSkills(basePath, source) {
  if (!fs.existsSync(basePath)) return [];
  try {
    const cmd = `find ${basePath} -maxdepth 3 -name "SKILL.md" -type f`;
    const result = execSync(cmd).toString().trim().split('\n');
    
    return result.filter(f => f).map(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const nameMatch = content.match(/name:\s*"?([^"\n]+)"?/);
      const descMatch = content.match(/description:\s*"?([^"\n]+)"?/);
      
      const dirName = path.basename(path.dirname(filePath));
      const parentDirName = path.basename(path.dirname(path.dirname(filePath)));
      
      let category = parentDirName === 'skills' ? 'Core' : parentDirName;
      if (category === 'gws') category = 'Google Workspace';
      if (category === 'github' || category === 'vercel-cli') category = 'DevOps';
      if (category === 'datahub-analytics' || category === 'b2b-analytics') category = 'Business';
      if (category === 'weather') category = 'Utilities';
      if (category === 'healthcheck') category = 'Security';
      
      return {
        id: nameMatch ? nameMatch[1] : dirName,
        name: nameMatch ? nameMatch[1] : dirName,
        description: descMatch ? descMatch[1] : 'No description provided.',
        category: category.charAt(0).toUpperCase() + category.slice(1),
        path: filePath,
        source: source
      };
    });
  } catch (e) {
    console.error(`Error scanning ${basePath}:`, e);
    return [];
  }
}

const workspaceSkills = scanSkills(workspaceSkillsPath, 'workspace');
const globalSkills = scanSkills(globalSkillsPath, 'npm');

const allSkills = [...workspaceSkills, ...globalSkills];

// Remove duplicates by name (workspace overrides npm)
const uniqueSkillsMap = new Map();
globalSkills.forEach(s => uniqueSkillsMap.set(s.name, s));
workspaceSkills.forEach(s => uniqueSkillsMap.set(s.name, s));

const finalSkills = Array.from(uniqueSkillsMap.values());

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ skills: finalSkills }, null, 2));
console.log(`✅ Synced ${finalSkills.length} skills to skills.json`);

// Also push to github if not run standalone
if (process.argv.includes('--push')) {
  try {
    const cwd = path.resolve(__dirname, '../../apps/mission-control-ui');
    execSync(`git add public/api/skills.json`, { cwd, stdio: 'ignore' });
    execSync('git diff --staged --quiet', { cwd });
    console.log('✅ No changes to commit');
  } catch (e) {
    try {
      const cwd = path.resolve(__dirname, '../../apps/mission-control-ui');
      execSync(`git commit -m "chore(skills): sync skills.json"`, { cwd, stdio: 'ignore' });
      execSync('git push origin main', { cwd, stdio: 'ignore' });
      console.log('✅ Pushed skills.json to GitHub');
    } catch(e2) {
      console.error('Failed to push:', e2.message);
    }
  }
}
