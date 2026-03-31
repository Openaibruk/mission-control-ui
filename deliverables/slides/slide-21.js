const slideConfig = { type: 'content', index: 21, title: "What's Working Well" };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("WHAT'S WORKING WELL", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Wins from Q1 2026", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const wins = [
    { title: "Burn Cut in Half", desc: "Monthly burn dropped 48% from 19.65M to 10.16M ETB — fastest cost reduction in company history.", icon: "💰" },
    { title: "Gross Margin Improvement", desc: "Margin improved from -45.49% to -16.68% — a 29 percentage point swing in one month.", icon: "📈" },
    { title: "Warehouse Damage -92%", desc: "Reduced from 83,142 to 10,341 ETB/week. Direct-ship strategy working perfectly.", icon: "🏭" },
    { title: "SGL Channel +389%", desc: "Smart Souk sales grew from 1,989 to 9,731 ETB/week — aggregator-first strategy validated.", icon: "🤝" },
    { title: "Arrival Damage -81%", desc: "Dropped from 4.40% to 0.67% due to direct-ship model. Quality is improving.", icon: "✅" },
    { title: "Zero Un-drawn Orders", desc: "W5-W6 both show zero un-drawn orders. Fulfillment reliability improved significantly.", icon: "📦" }
  ];

  for (let i = 0; i < 6; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.6 + col * 3.1;
    const y = 1.4 + row * 1.8;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.85, h: 1.55, fill: { color: "FFF5F5" }, rectRadius: 0.15 });
    s.addText(wins[i].icon, { x, y: y + 0.1, w: 2.85, h: 0.45, fontSize: 24, fontFace: "Arial", margin: 0, align: "center" });
    s.addText(wins[i].title, { x: x + 0.15, y: y + 0.45, w: 2.6, h: 0.35, fontSize: 14, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center" });
    s.addText(wins[i].desc, { x: x + 0.15, y: y + 0.8, w: 2.6, h: 0.7, fontSize: 10, fontFace: "Arial", color: "555555", margin: 0, align: "center" });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("21", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-21-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
