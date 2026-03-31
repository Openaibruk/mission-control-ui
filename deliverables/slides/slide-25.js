const slideConfig = { type: 'content', index: 25, title: 'Recommendation 3' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fill: { color: "E53935" } });
  s.addText("03", { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fontSize: 20, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("BNPL LAUNCH", { x: 1.5, y: 0.55, w: 6, h: 0.6, fontSize: 32, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // BNPL Revenue potential
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.45, w: 4.2, h: 1.2, fill: { color: "FFF5F5" }, rectRadius: 0.1 });
  s.addText("TARGET: 35% OF TOTAL REVENUE", { x: 0.6, y: 1.45, w: 4.2, h: 0.25, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", charSpacing: 3 });
  s.addText([
    { text: "20 restaurants ", options: { bold: true, color: "1A1A1A" } },
    { text: "× 4 orders/month × 5,000 ETB × 3% fee", options: { color: "666666" } }
  ], { x: 0.6, y: 1.75, w: 4.2, h: 0.3, fontSize: 12, fontFace: "Arial", margin: 0, align: "center" });
  s.addText("= 12,000 ETB/month pure revenue", { x: 0.6, y: 2.1, w: 4.2, h: 0.35, fontSize: 18, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "middle" });

  // Phased rollout
  s.addText("PHASED ROLLOUT", { x: 5.2, y: 1.4, w: 3, h: 0.3, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 3 });

  const phases = [
    { n: "1", title: "Pilot", desc: "Top 20 restaurants\n7-day cycle, 3% fee\nHard credit caps" },
    { n: "2", title: "Scale", desc: "SGL working capital\n14-day cycle options\nAutomated scoring" },
    { n: "3", title: "Expand", desc: "Supplier financing\nCredit ledger (blockchain)\nMarket-wide products" }
  ];

  for (let i = 0; i < 3; i++) {
    const x = 5.2 + i * 1.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.8, w: 1.3, h: 2.0, fill: { color: i === 0 ? "1A1A1A" : "F8F8F8" }, rectRadius: 0.1 });
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: 1.9, w: 0.6, h: 0.6, fill: { color: i === 0 ? "E53935" : "E53935" } });
    s.addText(phases[i].n, { x: x + 0.35, y: 1.9, w: 0.6, h: 0.6, fontSize: 18, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(phases[i].title, { x, y: 2.5, w: 1.3, h: 0.25, fontSize: 12, fontFace: "Arial", color: i === 0 ? "FFFFFF" : "1A1A1A", bold: true, margin: 0, align: "center" });
    s.addText(phases[i].desc, { x, y: 2.75, w: 1.3, h: 0.95, fontSize: 9, fontFace: "Arial", color: i === 0 ? "CCCCCC" : "666666", margin: 0, align: "center" });
  }

  // Key safeguards
  s.addText("KEY SAFEGUARDS", { x: 0.6, y: 2.9, w: 4, h: 0.3, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 3 });

  const safeguards = [
    "Short cycles: 7-14 days maximum — no long credit exposure",
    "Hard caps: system-enforced credit limits — no emotional overrides",
    "Auto-block: missed payment = immediate freeze — restart only after full repayment",
    "Automated scoring: order history → dynamic credit limits",
    "Start small: highest-trust restaurants first, expand after validation"
  ];
  for (let i = 0; i < 5; i++) {
    s.addShape(pres.shapes.OVAL, { x: 0.75, y: 3.2 + i * 0.3, w: 0.14, h: 0.14, fill: { color: "E53935" } });
    s.addText(safeguards[i], { x: 1.0, y: 3.15 + i * 0.3, w: 4, h: 0.27, fontSize: 11, fontFace: "Arial", color: "333333", margin: 0 });
  }

  // Deepest moat callout
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.2, y: 3.95, w: 4.4, h: 1.3, fill: { color: "FFF5F5" }, rectRadius: 0.1 });
  s.addText("WHY BNPL IS OUR BIGGEST MOAT", { x: 5.2, y: 3.95, w: 4.4, h: 0.25, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", charSpacing: 3 });
  s.addText("Credit products create the deepest moat. Customers can't leave because they owe you or depend on your credit. BNPL is the single most defensible competitive advantage in the entire business model.", { x: 5.3, y: 4.25, w: 4.2, h: 0.9, fontSize: 12, fontFace: "Arial", color: "333333", margin: 0 });

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("25", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-25-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
