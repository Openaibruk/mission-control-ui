const fs = require('fs');
const file = '/home/ubuntu/.openclaw/openclaw.json';
const config = JSON.parse(fs.readFileSync(file, 'utf8'));

config.agents.defaults.models['openrouter/stepfun/step-3.5-flash'] = { "alias": "Step-3.5 Flash" };

fs.writeFileSync(file, JSON.stringify(config, null, 2));
