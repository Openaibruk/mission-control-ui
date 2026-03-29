const https = require('https');

async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 429) {
              const retryAfter = res.headers['retry-after'] ? parseInt(res.headers['retry-after']) * 1000 : 2000;
              reject({ status: 429, retryAfter, data });
            } else if (res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            } else {
              try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
            }
          });
        });
        req.on('error', reject);
        if (options.body) req.write(options.body);
        req.end();
      });
    } catch (err) {
      if (err.status === 429 && i < maxRetries - 1) {
        const waitTime = err.retryAfter || Math.pow(2, i) * 1000;
        console.warn(`Rate limit hit (429). Retrying in ${waitTime}ms...`);
        await new Promise(r => setTimeout(r, waitTime));
      } else {
        throw err;
      }
    }
  }
}

module.exports = { fetchWithRetry };
