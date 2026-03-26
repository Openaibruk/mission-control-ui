---
name: datahub-analytics
description: "Access the DataHub Analytics MCP server to retrieve business metrics including operations overview, product sales, user registrations, and margin analysis. Use when a user asks for business intelligence, data insights, sales breakdowns, or customer segmentation."
---

# DataHub Analytics

Access real-time business analytics from the DataHub MCP server.

## API Tools

The DataHub server exposes the following tools:

- `get_operations_overview`: Orders, revenue, KG by date range
- `get_product_sales`: Product-level sales breakdown
- `get_user_registrations`: New user signups and segments
- `get_weekly_historical`: Weekly performance by channel
- `get_product_performance`: Product trends, volatility, rankings
- `get_vendor_performance`: Vendor metrics, category mix
- `get_demand_projections`: Forecasted demand by product
- `get_margin_analysis`: Gross/net margins, cost analysis
- `get_logistics_analytics`: Delivery status, driver metrics
- `get_wallet_analytics`: Wallet transactions and balances
- `get_reviews_analytics`: Customer reviews and ratings
- `get_capacity_planning`: Capacity forecasts
- `get_customer_profile`: Search/lookup customer details
- `get_customer_segmentation`: RFM segments, cohort analysis
- `get_super_leader_analytics`: Super leader performance
- `get_fuel_analytics`: Driver fuel consumption
- `get_active_flash_deals`: Active flash deals

## Usage

Use the CLI script to query tools from the DataHub server:

```bash
# Query the server (replace <tool> with the desired tool name from the list above)
node /home/ubuntu/.openclaw/workspace/skills/datahub-analytics/scripts/query.js <tool> [params-json]
```

### Examples

```bash
# Get operations overview
node /home/ubuntu/.openclaw/workspace/skills/datahub-analytics/scripts/query.js get_operations_overview '{"date_range": "30d"}'

# Get product sales
node /home/ubuntu/.openclaw/workspace/skills/datahub-analytics/scripts/query.js get_product_sales

# Get margin analysis
node /home/ubuntu/.openclaw/workspace/skills/datahub-analytics/scripts/query.js get_margin_analysis
```

---
name: datahub-analytics
description: "Access the DataHub Analytics MCP server to retrieve business metrics including operations overview, product sales, user registrations, and margin analysis. Use when a user asks for business intelligence, data insights, sales breakdowns, or customer segmentation."
---

# DataHub Analytics

Access real-time business analytics from the DataHub MCP server.

## API Tools

The DataHub server exposes the following tools:

- `get_operations_overview`: Orders, revenue, KG by date range
- `get_product_sales`: Product-level sales breakdown
- `get_user_registrations`: New user signups and segments
- `get_weekly_historical`: Weekly performance by channel
- `get_product_performance`: Product trends, volatility, rankings
- `get_vendor_performance`: Vendor metrics, category mix
- `get_demand_projections`: Forecasted demand by product
- `get_margin_analysis`: Gross/net margins, cost analysis
- `get_logistics_analytics`: Delivery status, driver metrics
- `get_wallet_analytics`: Wallet transactions and balances
- `get_reviews_analytics`: Customer reviews and ratings
- `get_capacity_planning`: Capacity forecasts
- `get_customer_profile`: Search/lookup customer details
- `get_customer_segmentation`: RFM segments, cohort analysis
- `get_super_leader_analytics`: Super leader performance
- `get_fuel_analytics`: Driver fuel consumption
- `get_active_flash_deals`: Active flash deals

## Usage

Use the CLI script to query tools from the DataHub server:

```bash
# Query the server with default last 30 days
node /home/ubuntu/.openclaw/workspace/skills/datahub-analytics/scripts/query.js <tool>

# Query with explicit dates
node /home/ubuntu/.openclaw/workspace/skills/datahub-analytics/scripts/query.js get_operations_overview '{"startDate": "2026-02-01", "endDate": "2026-02-28"}'
```
