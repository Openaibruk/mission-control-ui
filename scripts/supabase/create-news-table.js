const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use service role key for DDL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  // Create news table if not exists
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS news (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        type text NOT NULL CHECK (type IN ('news', 'business')),
        title text NOT NULL,
        source text NOT NULL,
        date date NOT NULL,
        url text,
        summary text,
        category text,
        created_at timestamptz DEFAULT now(),
        published_at timestamptz DEFAULT now(),
        UNIQUE(title, source, date)
      );
      
      CREATE INDEX IF NOT EXISTS idx_news_type_published ON news(type, published_at DESC);
      
      ALTER TABLE news ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
    `
  });

  if (error) {
    console.error('Error creating news table:', error);
  } else {
    console.log('News table created successfully');
  }
}
run().catch(console.error);
