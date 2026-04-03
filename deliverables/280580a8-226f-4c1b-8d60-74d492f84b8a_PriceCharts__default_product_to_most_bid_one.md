# PriceCharts: Default Product Selection Logic Update

## 📋 Overview
This deliverable outlines the implementation to change the PriceCharts dropdown default selection from alphabetical-first to the product with the highest number of bids within the last 14 days. This improves initial user experience by surfacing active, high-interest products immediately upon page load.

## 🎯 Requirements
- Query bid activity per product for a rolling 14-day window.
- Identify the product with the maximum bid count.
- Set this product as the default selected value in the dropdown.
- Maintain deterministic behavior for ties and zero-bid scenarios.
- Preserve existing dropdown functionality and data structure.

## 🛠 Implementation Details

### 1. Backend / Data Layer
**Objective:** Extend the product listing endpoint to calculate and return a `defaultProductId`.

**SQL Logic (PostgreSQL/MySQL compatible):**
```sql
WITH product_bid_counts AS (
    SELECT 
        p.id AS product_id,
        COUNT(b.id) AS bid_count_14d
    FROM products p
    LEFT JOIN bids b 
      ON b.product_id = p.id 
      AND b.created_at >= CURRENT_DATE - INTERVAL '14 days'
    GROUP BY p.id
)
SELECT 
    product_id 
FROM product_bid_counts
ORDER BY bid_count_14d DESC, product_id ASC
LIMIT 1;
```

**API Response Payload Update:**
```json
{
  "products": [ ... ],
  "metadata": {
    "defaultProductId": "prod_8x92k",
    "calculatedAt": "2024-05-20T14:30:00Z"
  }
}
```

### 2. Frontend / UI Layer
**Objective:** Initialize the dropdown state using `metadata.defaultProductId` instead of `products[0].id`.

**JavaScript/React Example:**
```javascript
// Before
const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || null);

// After
const [selectedProduct, setSelectedProduct] = useState(
  response.metadata?.defaultProductId || products[0]?.id || null
);
```

**Dropdown Component Initialization:**
```javascript
useEffect(() => {
  if (products.length > 0) {
    const defaultId = metadata?.defaultProductId || products[0].id;
    setSelectedProduct(defaultId);
    loadPriceChart(defaultId); // Trigger initial chart render
  }
}, [products, metadata]);
```

## ⚠️ Edge Cases & Fallback Logic
| Scenario | Behavior |
|----------|----------|
| **Zero bids in 14 days** | Fallback to alphabetical first product (`products[0]`) |
| **Tie in bid counts** | Deterministic tiebreaker: lowest `product_id` or alphabetical name |
| **API failure / delayed load** | Show skeleton state; default to `null` until data resolves |
| **User manually changes selection** | Preserve user choice; do not override on subsequent re-renders unless explicitly refreshed |

## 🧪 Testing Strategy
- **Unit Tests:** Validate sorting logic and fallback behavior with mock datasets.
- **Integration Tests:** Verify API returns correct `defaultProductId` for known bid distributions.
- **UI Tests:** Confirm dropdown initializes with the correct product and chart loads accordingly.
- **Performance Tests:** Ensure bid-count aggregation does not degrade API response time (<200ms target). Index recommendation: `CREATE INDEX idx_bids_product_created ON bids(product_id, created_at);`

## ✅ Verification & Deployment Checklist
- [ ] Backend query optimized with appropriate database indexes
- [ ] API contract updated and documented for frontend consumers
- [ ] Frontend default logic implemented and type-safe
- [ ] Staging validation with real/seeded bid data
- [ ] Analytics event added: `pricechart_default_selected` (for tracking UX impact)
- [ ] Rollout via feature flag or incremental deployment
- [ ] Monitor error rates and initial page load metrics post-deploy

## 📊 Success Metrics
- **↓ 40%** reduction in immediate dropdown changes on page load
- **↑ 15%** increase in chart interactions within first 10 seconds
- Zero regression in dropdown functionality or chart rendering