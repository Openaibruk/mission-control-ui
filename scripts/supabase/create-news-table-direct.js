const { Client } = require('pg');
require('dotenv').config();

// Extract Supabase DB connection details from .env
const supabaseUrl = process.env.SUPABASE_URL; // https://xyz.supabase.co
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Parse the host from URL
const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
if (!match) {
  console.error('Could not parse Supabase URL');
  process.exit(1);
}
const host = `db.${match[1]}.supabase.co`;
const port = 5432;
const database = 'postgres';
const user = 'postgres';
const password = serviceKey; // Service role key acts as password

const client = new Client({
  host,
  port,
  database,
  user,
  password,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  try {
    await client.query(`
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
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_news_type_published ON news(type, published_at DESC);
    `);
    // Enable RLS and public read policy
    await client.query(`
      ALTER TABLE news ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public read access" ON news;
      CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
    `);
    console.log('News table created successfully');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}
run().catch(console.error);
