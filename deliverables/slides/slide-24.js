const slideConfig = { type: 'content', index: 24, title: 'Recommendation 2' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fill: { color: "E53935" } });
  s.addText("02", { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fontSize: 20, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("RUTHLESS B2B MIGRATION", { x: 1.5, y: 0.55, w: 6, h: 0.6, fontSize: 32, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // Why B2B matters
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.45, w: 4.2, h: 1.2, fill: { color: "FFF5F5" }, rectRadius: 0.1 });
  s.addText("WHY B2B?", { x: 0.6, y: 1.45, w: 4.2, h: 0.25, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", charSpacing: 3 });
  s.addText("A single B2B order (~5,000 ETB) = 60 individual B2C orders. Moving from 16% to 40% B2B share could double gross margins with same logistics.", { x: 0.6, y: 1.75, w: 4.2, h: 0.8, fontSize: 12, fontFace: "Arial", color: "333333", margin: 0, align: "center" });

  // Action plan
  s.addText("ACTION PLAN", { x: 5.2, y: 1.4, w: 3, h: 0.3, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 3 });

  const actions = [
    { n: "1", text: "Assign formal sales agent — not marketing" },
    { n: "2", text: "Target 40 restaurants by end of Q2" },
    { n: "3", text: "Develop BNPL credit (7-14 day cycles, hard caps)" },
    { n: "4", text: "Build B2B portal with recurring orders & invoices" },
    { n: "5", text: "Target avg order: 200kg → 10,000 ETB" }
  ];

  for (let i = 0; i < 5; i++) {
    const y = 1.85 + i * 0.58;
    s.addShape(pres.shapes.OVAL, { x: 5.2, y, w: 0.38, h: 0.38, fill: { color: "E53935" } });
    s.addText(actions[i].n, { x: 5.2, y, w: 0.38, h: 0.38, fontSize: 14, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(actions[i].text, { x: 5.7, y, w: 3.8, h: 0.38, fontSize: 12, fontFace: "Arial", color: "333333", margin: 0, valign: "middle" });
  }

  // Revenue impact card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 2.9, w: 9, h: 1.2, fill: { color: "1A1A1A" }, rectRadius: 0.12 });
  s.addText("REVENUE IMPACT", { x: 0.6, y: 2.9, w: 9, h: 0.3, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", charSpacing: 3 });
  s.addText("40 restaurants × avg 8,000 ETB/month = 320,000 ETB monthly B2B revenue", { x: 0.6, y: 3.2, w: 9, h: 0.35, fontSize: 16, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center" });
  s.addText("+ BNPL fees (3% × 320,000 = 9,600 ETB/month) on top of trade margins", { x: 0.6, y: 3.55, w: 9, h: 0.3, fontSize: 13, fontFace: "Arial", color: "CCCCCC", margin: 0, align: "center" });

  // Gate pricing impact
  s.addText("B2B MIGRATION GATE PRICING", { x: 0.6, y: 4.4, w: 5, h: 0.3, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 3 });
  const gpItems = [
    "Make B2C individually unattractive: +25% markup, 150 ETB delivery",
    "Incentivize aggregation: -15% discount, 10 ETB for group members",
    "Bulk booster for high-tonnage: -5%+ discount, single drop free",
    "Direct DC fulfillment bypasses warehouse, reducing 92% more damage"
  ];
  for (let i = 0; i < 4; i++) {
    const x2 = 0.6 + (i % 2) * 4.5;
    const y2 = 4.7 + Math.floor(i / 2) * 0.28;
    s.addShape(pres.shapes.OVAL, { x: x2, y: y2, w: 0.15, h: 0.15, fill: { color: "E53935" } });
    s.addText(gpItems[i], { x: x2 + 0.22, y: y2 - 0.02, w: 4.1, h: 0.22, fontSize: 10, fontFace: "Arial", color: "444444", margin: 0 });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("24", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-24-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
