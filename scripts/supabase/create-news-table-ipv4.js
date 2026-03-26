const { Client } = require('pg');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Construct connection string
const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
if (!match) {
  console.error('Could not parse Supabase URL');
  process.exit(1);
}
const projectRef = match[1];
const host = `db.${projectRef}.supabase.co`;
const port = 5432;
const database = 'postgres';
const user = 'postgres';
const password = serviceKey;

// Use connection string
const connectionString = `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}?sslmode=require`;

const client = new Client({
  connectionString,
  // Force IPv4? Not needed if DNS resolves IPv4 first
});

async function run() {
  await client.connect();
  try {
    console.log('Connected to Supabase DB');
    const sql = `
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
    `;
    await client.query(sql);
    console.log('Created news table');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_news_type_published ON news(type, published_at DESC);
    `);
    console.log('Created index');

    await client.query(`
      ALTER TABLE news ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public read access" ON news;
      CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
    `);
    console.log('Set RLS policy');

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}
run().catch(e => {
  console.error(e);
  process.exit(1);
});
