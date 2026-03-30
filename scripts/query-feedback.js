#!/usr/bin/env node
// query-feedback.js — Check Supabase feedback table for pending entries
const https = require('https');
require('dotenv').config();

const url = new URL(process.env.SUPABASE_URL + '/rest/v1/feedback?select=*&status=eq.pending&order=created_at.asc');
const headers = {
  'apikey': process.env.SUPABASE_ANON_KEY,
  'Authorization': 'Bearer ' + process.env.SUPABASE_ANON_KEY,
  'Content-Type': 'application/json',
};

https.get({ hostname: url.hostname, path: url.pathname + url.search, headers }, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    try {
      const items = JSON.parse(body);
      if (!items || items.length === 0) {
        console.log('NO_REPLY');
      } else {
        console.log(JSON.stringify(items, null, 2));
      }
    } catch (e) {
      console.error('Parse error:', e.message);
      console.log('NO_REPLY');
    }
  });
}).on('error', (e) => {
  console.error('Request error:', e.message);
  console.log('NO_REPLY');
});
