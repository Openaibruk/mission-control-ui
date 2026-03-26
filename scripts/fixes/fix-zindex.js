const fs = require('fs');
const path = '/home/ubuntu/.openclaw/workspace/mission-control-ui/src/components/shared/MarkdownPreviewModal.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace('z-50', 'z-[60]');
fs.writeFileSync(path, content);
