const slideConfig = { type: 'content', index: 26, title: 'Recommendation 4' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fill: { color: "E53935" } });
  s.addText("04", { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fontSize: 20, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("AUTO-BLOCK SYSTEMS", { x: 1.5, y: 0.55, w: 6, h: 0.6, fontSize: 32, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  s.addText("Technology must enforce discipline — humans are too emotional.", { x: 0.6, y: 1.45, w: 8, h: 0.35, fontSize: 14, fontFace: "Arial", color: "E53935", bold: true, margin: 0 });

  const blocks = [
    { title: "CP1 Auto-Block", desc: "System rejects any order below margin floor. No manager override. No exceptions. Enforced at checkout.", icon: "🛡" },
    { title: "BNPL Enforcement Engine", desc: "Hard caps on credit. Auto-block on missed payment. System prevents manual override — no favoritism.", icon: "🔒" },
    { title: "Automated Reconciliation", desc: "Order → delivery → payment → margin calculation, all automated. Flag deviations instantly.", icon: "⚙" },
    { title: "Flash Sale Automation", desc: "Auto-trigger when warehouse damage >1% or shelf-life >36 hours. Reduces ~45,000 ETB/week in spoilage.", icon: "⚡" },
    { title: "SKU Auto-Suspension", desc: "Any product with negative CP1 for 2 consecutive weeks gets suspended automatically.", icon: "🚫" },
    { title: "KPI Alert System", desc: "Real-time alerts when key metrics deviate from targets — burn rate, margin, SGL activity.", icon: "🔔" }
  ];

  for (let i = 0; i < 6; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.6 + col * 3.1;
    const y = 1.95 + row * 1.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.85, h: 1.25, fill: { color: i < 2 ? "FFF5F5" : "F8F8F8" }, rectRadius: 0.12 });
    s.addText(blocks[i].icon, { x: x + 0.1, y: y + 0.05, w: 0.5, h: 0.45, fontSize: 22, fontFace: "Arial", margin: 0, valign: "middle" });
    s.addText(blocks[i].title, { x: x + 0.6, y: y + 0.05, w: 2.1, h: 0.35, fontSize: 13, fontFace: "Arial", color: "E53935", bold: true, margin: 0, valign: "middle" });
    s.addText(blocks[i].desc, { x: x + 0.15, y: y + 0.45, w: 2.55, h: 0.75, fontSize: 10, fontFace: "Arial", color: "444444", margin: 0 });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("26", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-26-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
