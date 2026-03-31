const slideConfig = { type: 'content', index: 22, title: "What Needs Urgent Attention" };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("URGENT ATTENTION REQUIRED", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Critical Issues to Fix Now", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const issues = [
    { title: "Still Burning Cash", desc: "10.16M ETB burn vs 7.4M ETB revenue = -2.7M monthly gap. Must reach breakeven or runway expires.", severity: "🔴 CRITICAL" },
    { title: "CP1 Still Negative", desc: "Contribution margin at -16.68% vs +5% target. Every SKU order must meet margin floor. No exceptions.", severity: "🔴 CRITICAL" },
    { title: "Carrots Losing Money", desc: "Carrots alone cause 45.5% of warehouse losses (20,861 ETB/week). Consider suspending or repricing immediately.", severity: "🔴 CRITICAL" },
    { title: "No CRM System", desc: "Customer data lives in spreadsheets. No lifecycle management, retention tracking, or automated campaigns.", severity: "🟠 HIGH" },
    { title: "BNPL Not Launched", desc: "35% of target revenue from financing — still zero. 7-14 day cycle credit is the single biggest opportunity.", severity: "🟠 HIGH" },
    { title: "B2B Pipeline Broken", desc: "B2B still 58% below W1 levels. 40-restaurant pipeline disrupted. Needs dedicated sales agent immediately.", severity: "🟠 HIGH" },
    { title: "Tech UI Broken", desc: "SettingsView non-functional, FeedbackView stale data, no drag-and-drop Kanban, hardcoded org charts.", severity: "🟡 MEDIUM" },
    { title: "Sales Momentum Fading", desc: "W6 daily rate 5,419 ETB (down 9.6% from W5). Growth decelerating. Root cause unknown.", severity: "🟡 MEDIUM" }
  ];

  for (let i = 0; i < 8; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.5 + col * 2.35;
    const y = 1.4 + row * 1.8;
    const isCrit = issues[i].severity.includes("CRITICAL");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.15, h: 1.55, fill: { color: isCrit ? "FFF5F5" : "F8F8F8" }, rectRadius: 0.1 });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.15, h: 0.05, fill: { color: isCrit ? "E53935" : "CCCCCC" } });
    s.addText(issues[i].severity, { x, y: y + 0.12, w: 2.15, h: 0.25, fontSize: 9, fontFace: "Arial", color: isCrit ? "E53935" : "FF9800", bold: true, margin: 0, align: "center" });
    s.addText(issues[i].title, { x: x + 0.15, y: y + 0.3, w: 1.85, h: 0.35, fontSize: 12, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });
    s.addText(issues[i].desc, { x: x + 0.15, y: y + 0.65, w: 1.85, h: 0.8, fontSize: 9, fontFace: "Arial", color: "555555", margin: 0 });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("22", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-22-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
