const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/.env.local' });

// Singleton client to save connections
let clientInstance = null;

function getSupabaseClient() {
  if (!clientInstance) {
    clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return clientInstance;
}

module.exports = { getSupabaseClient };
