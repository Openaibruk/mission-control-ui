const fs = require('fs');
const content = fs.readFileSync('src/components/agents/AgentGrid.tsx', 'utf8');
let braces = 0;
let parens = 0;
const lines = content.split('\n');
for (let i=0; i<lines.length; i++) {
  const line = lines[i];
  for (let c of line) {
    if (c === '{') braces++;
    if (c === '}') braces--;
    if (c === '(') parens++;
    if (c === ')') parens--;
  }
  if (braces < 0) {
    console.log(`Extra closing brace at line ${i+1}: ${line}`);
    break;
  }
}
console.log(`End: braces=${braces}, parens=${parens}`);
