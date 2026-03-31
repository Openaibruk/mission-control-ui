const slideConfig = { type: 'content', index: 7, title: 'Revenue Streams (Detailed)' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("REVENUE STREAMS", { x: 0.6, y: 0.3, w: 8, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Unit Economics & Gate Pricing", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // Per-KG Spread Table
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.45, w: 4.2, h: 2.8, fill: { color: "F8F8F8" }, rectRadius: 0.1 });
  s.addText("PER-KG SPREAD", { x: 0.6, y: 1.45, w: 4.2, h: 0.35, fontSize: 11, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "top" });

  const spread = [
    ["Supplier buy price", "40 ETB", ""],
    ["Platform sell price", "46 ETB", ""],
    ["Total spread", "6 ETB/kg", "bold"],
    ["→ Leader/Captain cut", "2-3 ETB"],
    ["→ ChipChip share", "~2 ETB"],
    ["→ Operations buffer", "~1 ETB"]
  ];
  for (let i = 0; i < spread.length; i++) {
    const isBold = spread[i][2] === "bold";
    const y = 1.82 + i * 0.34;
    s.addText(spread[i][0], { x: 0.8, y, w: 2.4, h: 0.28, fontSize: isBold ? 12 : 12, fontFace: "Arial", color: "1A1A1A", bold: isBold, margin: 0 });
    s.addText(spread[i][1], { x: 3.2, y, w: 1.4, h: 0.28, fontSize: isBold ? 13 : 12, fontFace: "Arial", color: isBold ? "E53935" : "333333", bold: isBold, margin: 0, align: "right" });
  }

  // Gate Pricing Table
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.0, y: 1.45, w: 4.6, h: 2.8, fill: { color: "F8F8F8" }, rectRadius: 0.1 });
  s.addText("GATE PRICING MODEL", { x: 5.0, y: 1.45, w: 4.6, h: 0.35, fontSize: 11, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "top" });

  const gates = [
    ["Individual B2C", "+25% markup", "150 ETB", "Discourage"],
    ["Group Member", "-15% discount", "10 ETB", "Incentivize"],
    ["High-Volume (5kg+)", "Tiered discount", "FREE", "Reward basket size"],
    ["Super Groups (50kg+)", "Bulk discount", "FREE", "Maximize efficiency"]
  ];
  for (let i = 0; i < gates.length; i++) {
    const y = 1.86 + i * 0.6;
    s.addText(gates[i][0], { x: 5.15, y, w: 1.5, h: 0.5, fontSize: 11, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });
    s.addText(gates[i][1], { x: 6.65, y, w: 1.1, h: 0.5, fontSize: 10, fontFace: "Arial", color: "333333", margin: 0 });
    s.addText(gates[i][2], { x: 7.75, y, w: 0.7, h: 0.5, fontSize: 10, fontFace: "Arial", color: gates[i][2] === "FREE" ? "E53935" : "333333", bold: gates[i][2] === "FREE", margin: 0, align: "center" });
    s.addText(gates[i][3], { x: 8.45, y, w: 1.1, h: 0.5, fontSize: 9, fontFace: "Arial", color: "888888", margin: 0, italic: true });
  }

  // Monthly Revenue Split
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.45, w: 9, h: 0.85, fill: { color: "FFF5F5" }, rectRadius: 0.1 });
  s.addText("REVENUE MIX TARGET    ", { x: 0.6, y: 4.52, w: 9, h: 0.3, fontSize: 10, fontFace: "Arial", color: "888888", margin: 0 });

  const revPct = [
    { n: "Trade Margin", p: 50, c: "E53935" },
    { n: "BNPL Financing", p: 35, c: "FF6B6B" },
    { n: "SaaS/Platform", p: 15, c: "FFB3B3" }
  ];
  let bx = 0.6;
  for (let i = 0; i < revPct.length; i++) {
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 4.82, w: revPct[i].p / 100 * 8.9, h: 0.32, fill: { color: revPct[i].c } });
    s.addText(`${revPct[i].n}: ${revPct[i].p}%`, { x: bx, y: 4.55, w: 2.8, h: 0.28, fontSize: 9, fontFace: "Arial", color: "333333", margin: 0 });
    bx += revPct[i].p / 100 * 8.9 + 0.05;
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("7", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 11, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout='LAYOUT_16x9'; createSlide(pr,{}); pr.writeFile({fileName:"slide-07-preview.pptx"}); }
module.exports = { createSlide, slideConfig };
