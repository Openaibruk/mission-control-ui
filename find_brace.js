const fs = require('fs');
const content = fs.readFileSync('src/components/agents/AgentGrid.tsx', 'utf8');

// A very simple recursive descent parser to find the unmatched brace
let stack = [];
for(let i=0; i<content.length; i++) {
  let c = content[i];
  if(c === '{') stack.push({line: content.slice(0,i).split('\n').length, index: i});
  if(c === '}') {
    if(stack.length === 0) {
       console.log("Unmatched } at line", content.slice(0,i).split('\n').length);
       break;
    }
    stack.pop();
  }
}
if(stack.length > 0) {
  console.log("Unmatched { at line", stack[stack.length-1].line);
}
