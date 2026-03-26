import PptxGenJS from 'pptxgenjs';
import fs from 'fs';

const pptx = new PptxGenJS();

// ChipChip Brand Colors
const RED = 'E53935';
const WHITE = 'FFFFFF';
const BLACK = '1A1A1A';
const LIGHT_GRAY = 'F5F5F5';
const DARK_GRAY = '333333';

// Brand settings
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'ChipChip';
pptx.subject = 'Strategy 2026-2027';
pptx.title = 'ChipChip Strategy 2026-2027';

// Helper: add slide with brand styling
function addSlide(title, content) {
  const slide = pptx.addSlide();
  
  // White background
  slide.background = { color: WHITE };
  
  // Top red bar
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: RED } });
  
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.3, w: 12, h: 0.7,
    fontSize: 28, fontFace: 'Montserrat', bold: true, color: BLACK,
  });
  
  // Red underline
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.95, w: 1.5, h: 0.04, fill: { color: RED }, rectRadius: 0.02 });
  
  // Content
  if (content) {
    slide.addText(content.text, content.opts || {});
  }
  
  // Footer
  slide.addText('ChipChip · 2026-2027 Strategy', {
    x: 0.5, y: 7.1, w: 12, h: 0.3,
    fontSize: 9, fontFace: 'Montserrat', color: '999999', align: 'center'
  });
  
  return slide;
}

// ========== SLIDE 1: Title ==========
const slide1 = pptx.addSlide();
slide1.background = { color: WHITE };
// Red circle accent
slide1.addShape(pptx.ShapeType.ellipse, { x: 8.5, y: 1.5, w: 4, h: 4, fill: { color: RED, transparency: 85 } });
slide1.addShape(pptx.ShapeType.ellipse, { x: 9, y: 2, w: 3, h: 3, fill: { color: RED, transparency: 90 } });
// Title
slide1.addText('CHIPCHIP', {
  x: 0.8, y: 2.0, w: 8, h: 1.2,
  fontSize: 52, fontFace: 'Montserrat', bold: true, color: RED
});
slide1.addText('STRATEGY 2026–2027', {
  x: 0.8, y: 3.0, w: 8, h: 0.8,
  fontSize: 36, fontFace: 'Montserrat', bold: true, color: BLACK
});
slide1.addText('From Chaos to Control · From Loss to Profit · From Growth to Scale', {
  x: 0.8, y: 3.8, w: 8, h: 0.5,
  fontSize: 14, fontFace: 'Montserrat', color: DARK_GRAY, italic: true
});
// Red bar at bottom
slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 6.8, w: '100%', h: 0.06, fill: { color: RED } });
slide1.addText('CONFIDENTIAL', {
  x: 0.8, y: 6.9, w: 5, h: 0.3,
  fontSize: 10, fontFace: 'Montserrat', color: '999999'
});

// ========== SLIDE 2: Agenda ==========
const slide2 = addSlide('AGENDA');
slide2.addText([
  { text: '01', options: { fontSize: 24, bold: true, color: RED } }, { text: '   Executive Summary & Vision\n\n', options: { fontSize: 16, color: BLACK } },
  { text: '02', options: { fontSize: 24, bold: true, color: RED } }, { text: '   Business Model & Revenue\n\n', options: { fontSize: 16, color: BLACK } },
  { text: '03', options: { fontSize: 24, bold: true, color: RED } }, { text: '   Strategic Pillars\n\n', options: { fontSize: 16, color: BLACK } },
  { text: '04', options: { fontSize: 24, bold: true, color: RED } }, { text: '   Year 1 Execution Plan (2026)\n\n', options: { fontSize: 16, color: BLACK } },
  { text: '05', options: { fontSize: 24, bold: true, color: RED } }, { text: '   Year 2 Scale Plan (2027)\n\n', options: { fontSize: 16, color: BLACK } },
  { text: '06', options: { fontSize: 24, bold: true, color: RED } }, { text: '   Financial Projections\n\n', options: { fontSize: 16, color: BLACK } },
  { text: '07', options: { fontSize: 24, bold: true, color: RED } }, { text: '   KPIs & Metrics\n\n', options: { fontSize: 16, color: BLACK } },
  { text: '08', options: { fontSize: 24, bold: true, color: RED } }, { text: '   Organization & Risk\n\n', options: { fontSize: 16, color: BLACK } },
], { x: 1.0, y: 1.5, w: 11, h: 5.5, valign: 'top', lineSpacingMultiple: 1.3 });

// ========== SLIDE 3: Executive Summary ==========
const slide3 = addSlide('EXECUTIVE SUMMARY');
slide3.addText([
  { text: 'What is ChipChip?\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: 'Asset-light food trade infrastructure platform connecting farmers to consumers via a distributed network of Super Leaders and B2B Captains in Addis Ababa, Ethiopia.\n\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: 'The 2026 Reset\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: 'Strategic shift from chaotic growth to disciplined, sustainable scale. Moving from B2C-heavy losses to profitable B2B + B2B2C operations.\n\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: 'Key Principles:\n', options: { fontSize: 16, bold: true, color: BLACK, breakLine: true } },
  { text: '• Discipline First — Technology enforces discipline, not chaos\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: '• Volume Quality — Bad volume is worse than no volume\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: '• One Owner — One KPI, One Owner. Shared = No one owns it\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.5, h: 5.5, valign: 'top', lineSpacingMultiple: 1.2 });

// ========== SLIDE 4: Vision ==========
const slide4 = addSlide('VISION & MISSION');
slide4.addText([
  { text: 'End-State Vision (Month 12)\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: '• 0% B2C Volume (migrated to aggregation)\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: '• 100% B2B + B2B2C Mix (profitable, predictable)\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: '• ChipChip as the "Veins of the Economy"\n\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: 'Mission\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: 'Stop touching products. Start controlling flows.\n\n', options: { fontSize: 16, bold: true, color: BLACK, breakLine: true } },
  { text: '• Demand Aggregator\n', options: { fontSize: 14, color: DARK_GRAY, breakLine: true } },
  { text: '• Flow Designer\n', options: { fontSize: 14, color: DARK_GRAY, breakLine: true } },
  { text: '• Settlement Engine\n', options: { fontSize: 14, color: DARK_GRAY, breakLine: true } },
  { text: '• Risk Controller\n', options: { fontSize: 14, color: DARK_GRAY, breakLine: true } },
  { text: '• SLA Enforcer\n', options: { fontSize: 14, color: DARK_GRAY, breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.5, h: 5.5, valign: 'top', lineSpacingMultiple: 1.2 });

// ========== SLIDE 5: Business Model ==========
const slide5 = addSlide('BUSINESS MODEL');
slide5.addText([
  { text: 'Three Revenue Streams\n\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: 'Trade Margin (50%)\n', options: { fontSize: 16, bold: true, color: BLACK, breakLine: true } },
  { text: 'Spread between supplier buy price and platform sell price. Example: 40 ETB/kg supplier → 46 ETB/kg platform = 6 ETB/kg margin split.\n\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: 'Financing / BNPL (35%)\n', options: { fontSize: 16, bold: true, color: BLACK, breakLine: true } },
  { text: 'Buy Now Pay Later for leaders, restaurants, suppliers. Short cycle (7-14 days), hard cap, auto-block. Example: 50,000 ETB order × 3% = 1,500 ETB revenue.\n\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: 'Platform Tools / SaaS (15%)\n', options: { fontSize: 16, bold: true, color: BLACK, breakLine: true } },
  { text: 'AI-powered tools: demand forecasting, price benchmarking, marketing automation.\n\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.5, h: 5.5, valign: 'top', lineSpacingMultiple: 1.2 });

// ========== SLIDE 6: Strategic Pillars ==========
const slide6 = addSlide('STRATEGIC PILLARS');
// Three circles
slide6.addShape(pptx.ShapeType.ellipse, { x: 0.8, y: 1.8, w: 3.5, h: 3.5, fill: { color: RED, transparency: 90 }, line: { color: RED, width: 2 } });
slide6.addText('DEMAND\nNETWORK', { x: 0.8, y: 3.0, w: 3.5, h: 1, fontSize: 16, fontFace: 'Montserrat', bold: true, color: RED, align: 'center' });

slide6.addShape(pptx.ShapeType.ellipse, { x: 4.8, y: 1.8, w: 3.5, h: 3.5, fill: { color: RED, transparency: 90 }, line: { color: RED, width: 2 } });
slide6.addText('SUPPLY\nMARKETPLACE', { x: 4.8, y: 3.0, w: 3.5, h: 1, fontSize: 16, fontFace: 'Montserrat', bold: true, color: RED, align: 'center' });

slide6.addShape(pptx.ShapeType.ellipse, { x: 8.8, y: 1.8, w: 3.5, h: 3.5, fill: { color: RED, transparency: 90 }, line: { color: RED, width: 2 } });
slide6.addText('TRUST &\nDATA', { x: 8.8, y: 3.0, w: 3.5, h: 1, fontSize: 16, fontFace: 'Montserrat', bold: true, color: RED, align: 'center' });

slide6.addText([
  { text: 'Consumer groups, Super Leaders, B2B buyers → ', options: { fontSize: 11, color: DARK_GRAY } },
  { text: 'Aggregating demand at scale', options: { fontSize: 11, bold: true, color: BLACK } },
], { x: 0.8, y: 5.6, w: 3.5, h: 0.8, align: 'center' });

slide6.addText([
  { text: 'Farmers, cooperatives, wholesalers → ', options: { fontSize: 11, color: DARK_GRAY } },
  { text: 'Connecting supply with demand', options: { fontSize: 11, bold: true, color: BLACK } },
], { x: 4.8, y: 5.6, w: 3.5, h: 0.8, align: 'center' });

slide6.addText([
  { text: 'Reputation, credit scoring, open data → ', options: { fontSize: 11, color: DARK_GRAY } },
  { text: 'Building trust infrastructure', options: { fontSize: 11, bold: true, color: BLACK } },
], { x: 8.8, y: 5.6, w: 3.5, h: 0.8, align: 'center' });

// ========== SLIDE 7: Year 1 Plan ==========
const slide7 = addSlide('YEAR 1 — FOUNDATION & GROWTH (2026)');
slide7.addText([
  { text: 'Q1 2026: Reset & Foundation\n', options: { fontSize: 16, bold: true, color: RED, breakLine: true } },
  { text: '• Strategic reset complete\n• B2B pipeline established\n• Super Leader network activated\n• Operations SOPs defined\n\n', options: { fontSize: 12, color: BLACK, breakLine: true } },
  { text: 'Q2 2026: Validate Unit Economics\n', options: { fontSize: 16, bold: true, color: RED, breakLine: true } },
  { text: '• CP1 (Core Platform 1) breakeven ✓\n• BNPL pilot with select restaurants\n• Logistics optimization\n• 6-week Super Leader onboarding\n\n', options: { fontSize: 12, color: BLACK, breakLine: true } },
  { text: 'Q3 2026: Scale B2B\n', options: { fontSize: 16, bold: true, color: RED, breakLine: true } },
  { text: '• B2B Captains program launch\n• Restaurant supply chain automation\n• Demand forecasting AI\n• Quality control system upgrade\n\n', options: { fontSize: 12, color: BLACK, breakLine: true } },
  { text: 'Q4 2026: Expand\n', options: { fontSize: 16, bold: true, color: RED, breakLine: true } },
  { text: '• Multi-city expansion prep\n• Supplier financing products\n• Platform tools SaaS pilot\n• CP2 breakeven target\n', options: { fontSize: 12, color: BLACK, breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.5, h: 5.5, valign: 'top', lineSpacingMultiple: 1.15 });

// ========== SLIDE 8: Year 2 Plan ==========
const slide8 = addSlide('YEAR 2 — SCALE & OPTIMIZE (2027)');
slide8.addText([
  { text: 'Q1 2027: Platform Maturity\n', options: { fontSize: 16, bold: true, color: RED, breakLine: true } },
  { text: '• Full B2B + B2B2C transition\n• SaaS tools general availability\n• Advanced credit scoring\n• Multi-city operations\n\n', options: { fontSize: 12, color: BLACK, breakLine: true } },
  { text: 'Q2 2027: Ecosystem Growth\n', options: { fontSize: 16, bold: true, color: RED, breakLine: true } },
  { text: '• Third-party integrations\n• API marketplace\n• Supply chain automation\n• Data products launch\n\n', options: { fontSize: 12, color: BLACK, breakLine: true } },
  { text: 'Q3-Q4 2027: Market Leadership\n', options: { fontSize: 16, bold: true, color: RED, breakLine: true } },
  { text: '• Regional expansion\n• Strategic partnerships\n• IPO readiness assessment\n• Full ecosystem maturity\n', options: { fontSize: 12, color: BLACK, breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.5, h: 5.5, valign: 'top', lineSpacingMultiple: 1.15 });

// ========== SLIDE 9: Financial Projections ==========
const slide9 = addSlide('FINANCIAL PROJECTIONS');
slide9.addText([
  { text: 'Revenue Mix Target\n\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: '2026: Trade Margin 65% · BNPL 25% · SaaS 10%\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: '2027: Trade Margin 50% · BNPL 35% · SaaS 15%\n\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: 'Key Milestones\n\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: '✓ CP1 Breakeven — Achieved Feb 2026 (+13% margin)\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: '○ CP2 Breakeven — Target Q4 2026\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: '○ Full Platform Profitability — Target Q2 2027\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: '○ Self-Sustaining Operations — Target Q4 2027\n\n', options: { fontSize: 14, color: BLACK, breakLine: true } },
  { text: 'Cost Discipline\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: '• Headcount freeze except critical roles\n• Marketing spend tied to CAC targets\n• Logistics cost per delivery benchmarked weekly\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.5, h: 5.5, valign: 'top', lineSpacingMultiple: 1.2 });

// ========== SLIDE 10: KPIs ==========
const slide10 = addSlide('KEY PERFORMANCE INDICATORS');
slide10.addText([
  { text: 'Weekly Tracked\n\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: '• Order Volume (kg) — Total, by segment, by channel\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: '• Revenue per kg — Gross margin, net margin\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: '• Customer Acquisition Cost — B2B vs B2C\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: '• Delivery Success Rate — On-time, quality complaints\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: '• Super Leader Performance — Group size, order frequency\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: '• B2B Captain Metrics — Restaurant count, avg order size\n\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: 'Quarterly Targets\n\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: '• Revenue growth rate\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: '• Gross margin percentage\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: '• Customer retention (B2B)\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: '• Supplier reliability score\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
  { text: '• Platform NPS\n', options: { fontSize: 13, color: BLACK, breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.5, h: 5.5, valign: 'top', lineSpacingMultiple: 1.15 });

// ========== SLIDE 11: Organization ==========
const slide11 = addSlide('ORGANIZATION & TEAM');
slide11.addText([
  { text: 'Current Headcount: ~107 (Feb 2026)\n\n', options: { fontSize: 16, bold: true, color: RED, breakLine: true } },
  { text: 'Core & Layer Model\n', options: { fontSize: 16, bold: true, color: BLACK, breakLine: true } },
  { text: '• Core: Full-time essential roles (engineering, ops, finance)\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: '• Layer: Contract/project-based roles (marketing, content)\n\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: 'Key Departments\n\n', options: { fontSize: 16, bold: true, color: BLACK, breakLine: true } },
  { text: '• Engineering & Product — Platform, mobile, AI/ML\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: '• Operations — Logistics, packaging, QC, warehouse\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: '• Sales & Marketing — B2B sales, brand, community\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: '• Finance & Legal — Accounting, compliance, contracts\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
  { text: '• People & Culture — Hiring, training, performance\n', options: { fontSize: 13, color: DARK_GRAY, breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.5, h: 5.5, valign: 'top', lineSpacingMultiple: 1.2 });

// ========== SLIDE 12: Risks ==========
const slide12 = addSlide('KEY RISKS & MITIGATIONS');
slide12.addText([
  { text: 'Risk Matrix\n\n', options: { fontSize: 18, bold: true, color: RED, breakLine: true } },
  { text: 'HIGH — Competitive Pressure\n', options: { fontSize: 14, bold: true, color: RED, breakLine: true } },
  { text: 'Mitigation: Speed of execution, local network effects, data moat\n\n', options: { fontSize: 12, color: DARK_GRAY, breakLine: true } },
  { text: 'HIGH — Cash Flow Constraints\n', options: { fontSize: 14, bold: true, color: RED, breakLine: true } },
  { text: 'Mitigation: Strict BNPL caps, weekly cash reviews, supplier payment terms\n\n', options: { fontSize: 12, color: DARK_GRAY, breakLine: true } },
  { text: 'MEDIUM — Supply Chain Disruption\n', options: { fontSize: 14, bold: true, color: 'F59E0B', breakLine: true } },
  { text: 'Mitigation: Multi-supplier strategy, buffer stock, quality gates\n\n', options: { fontSize: 12, color: DARK_GRAY, breakLine: true } },
  { text: 'MEDIUM — Regulatory Changes\n', options: { fontSize: 14, bold: true, color: 'F59E0B', breakLine: true } },
  { text: 'Mitigation: Legal counsel, compliance monitoring, flexible contracts\n\n', options: { fontSize: 12, color: DARK_GRAY, breakLine: true } },
  { text: 'LOW — Technology Risk\n', options: { fontSize: 14, bold: true, color: '3B82F6', breakLine: true } },
  { text: 'Mitigation: Proven stack, automated backups, staged rollouts\n', options: { fontSize: 12, color: DARK_GRAY, breakLine: true } },
], { x: 0.8, y: 1.3, w: 11.5, h: 5.5, valign: 'top', lineSpacingMultiple: 1.2 });

// ========== SLIDE 13: Call to Action ==========
const slide13 = pptx.addSlide();
slide13.background = { color: WHITE };
// Large red circle
slide13.addShape(pptx.ShapeType.ellipse, { x: 4, y: 1.5, w: 5, h: 5, fill: { color: RED, transparency: 80 } });
slide13.addText([
  { text: 'THE FUTURE OF FOOD TRADE\n', options: { fontSize: 14, bold: true, color: RED, breakLine: true, align: 'center' } },
  { text: '\nDiscipline First.\nVolume Quality.\nOne Owner.\n', options: { fontSize: 24, bold: true, color: BLACK, breakLine: true, align: 'center' } },
  { text: '\nChipChip 2026–2027\n', options: { fontSize: 16, color: DARK_GRAY, breakLine: true, align: 'center' } },
], { x: 2, y: 2, w: 9, h: 4, align: 'center', valign: 'middle' });

// Save
const outPath = '/home/ubuntu/.openclaw/workspace/chipchip/ChipChip_Strategy_2026-2027.pptx';
await pptx.writeFile({ fileName: outPath });
console.log('Saved:', outPath);
