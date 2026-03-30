const SUPERSET_URL = "http://64.227.129.135:8088";
const SUPERSET_API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6dHJ1ZSwiaWF0IjoxNzczMjIyMDk5LCJqdGkiOiI1Y2I4YzA2NS01MTUzLTQxMzgtYWFjZi00N2RmYTIwYmI4NjAiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjozMSwibmJmIjoxNzczMjIyMDk5LCJjc3JmIjoiNGVhODk0NjktMzRmNy00ZjkxLTg2NTUtNWM4YjI4MDRjYjVlIiwiZXhwIjo0OTI2ODIyMDk5fQ.1gQny-6r_vm3IObZ5idx-Wy1YKJZCm2_X8x7R2AUJJc";

async function querySuperset() {
  const sql = `
    SELECT 
      SUM(total_amount) as total_revenue,
      COUNT(DISTINCT id) as total_orders,
      AVG(total_amount) as aov
    FROM sales_b2b_salesinvoice
    WHERE date(created_at) = date('2026-03-29');
  `;

  const clientId = Math.random().toString(36).substring(2, 13);

  try {
    const res = await fetch(`${SUPERSET_URL}/api/v1/sqllab/execute/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPERSET_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        database_id: 6,
        json: true,
        runAsync: false,
        schema: 'main',
        sql: sql,
        tab: 'test',
        expand_data: true,
      })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
querySuperset();
