const fs = require('fs');
const path = '/home/ubuntu/.openclaw/workspace/mission-control-ui/tailwind.config.ts';
if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf8');
  if (!content.includes('@tailwindcss/typography')) {
    console.log("Need to add typography plugin");
  }
}
