const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');

const configFile = path.join(process.env.HOME, '.openclaw/openclaw.json');

https.get('https://openrouter.ai/api/v1/models', (resp) => {
  let data = '';
  resp.on('data', (chunk) => data += chunk);
  resp.on('end', () => {
    try {
      const response = JSON.parse(data);
      // Filter for completely free models
      const freeModels = response.data.filter(m => 
        m.pricing && m.pricing.prompt === "0" && m.pricing.completion === "0"
      );
      
      // Select the best free model. Prefer Qwen 72B, Llama 70B, or Gemini Flash Lite.
      const preferred = ["google/gemini-2.0-flash-lite-preview-02-05:free", "qwen/qwen-2.5-72b-instruct:free", "meta-llama/llama-3.3-70b-instruct:free"];
      let selectedModel = freeModels.find(m => preferred.includes(m.id))?.id;
      
      if (!selectedModel && freeModels.length > 0) {
          // Fallback to highest context length free model
          freeModels.sort((a, b) => (b.context_length || 0) - (a.context_length || 0));
          selectedModel = freeModels[0].id;
      }

      if (!selectedModel) {
          console.log("No free models found on OpenRouter!");
          process.exit(1);
      }

      console.log(`[Cost Optimizer] Selected free model: ${selectedModel}`);

      // 1. Update openclaw.json default model
      if (fs.existsSync(configFile)) {
          const configStr = fs.readFileSync(configFile, 'utf8');
          const config = JSON.parse(configStr);
          
          let changed = false;
          if (config.agents && config.agents.list && config.agents.list.length > 0) {
              if (config.agents.list[0].model !== selectedModel) {
                  config.agents.list[0].model = selectedModel;
                  changed = true;
              }
          }

          if (changed) {
              fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
              console.log(`[Cost Optimizer] Updated openclaw.json default model to ${selectedModel}.`);
              console.log(`Restart OpenClaw Gateway to apply changes: openclaw gateway restart`);
          } else {
              console.log(`[Cost Optimizer] openclaw.json is already using the best free model.`);
          }
      }

      // 2. We can also print instructions to update cron jobs if needed.
      console.log(`[Cost Optimizer] Done. To ensure cron jobs use this model, use the "cron" tool to patch "payload.model".`);
    } catch (e) {
      console.error("Error parsing OpenRouter response:", e);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
