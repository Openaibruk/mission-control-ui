const slideConfig = { type: 'content', index: 6, title: 'Business Model Overview' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("BUSINESS MODEL OVERVIEW", { x: 0.6, y: 0.3, w: 8, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Three Revenue Streams, One Platform", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const streams = [
    { name: "Trade Margin", pct: "~50%", icon: "📦", desc: "Spread between supplier buy price and platform sell price", detail: "Buy: 40 ETB/kg → Sell: 46 ETB/kg → Net: ~2 ETB/kg" },
    { name: "BNPL Financing", pct: "~35%", icon: "💳", desc: "Credit products for SGLs, restaurants, suppliers, drivers", detail: "7-14 day cycles, 3% fee per transaction" },
    { name: "Platform SaaS", pct: "~15%", icon: "🛠", desc: "Supplier tools, price benchmarking, demand forecasts, ads", detail: "Marketplace ads, data products, white-label licensing" }
  ];

  const sh = () => ({ type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.06 });

  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 2.85, h: 3.2, fill: { color: i === 0 ? "FFF5F5" : "F8F8F8" }, rectRadius: 0.15, shadow: sh() });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: 2.85, h: 0.07, fill: { color: "E53935" } });
    s.addText(streams[i].icon, { x, y: 1.7, w: 2.85, h: 0.5, fontSize: 30, fontFace: "Arial", margin: 0, align: "center" });
    s.addText(streams[i].name, { x: x + 0.2, y: 2.2, w: 2.5, h: 0.4, fontSize: 18, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, align: "center" });
    s.addText(streams[i].pct, { x: x + 0.2, y: 2.55, w: 2.5, h: 0.4, fontSize: 22, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center" });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.4, y: 3.0, w: 2.05, h: 0.03, fill: { color: "E5E5E5" } });
    s.addText(streams[i].desc, { x: x + 0.2, y: 3.1, w: 2.5, h: 0.6, fontSize: 12, fontFace: "Arial", color: "444444", margin: 0, align: "center" });
    s.addText(streams[i].detail, { x: x + 0.2, y: 3.75, w: 2.5, h: 0.5, fontSize: 11, fontFace: "Arial", color: "888888", margin: 0, align: "center", italic: true });
  }

  // Golden rule
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.9, w: 9, h: 0.45, fill: { color: "1A1A1A" }, rectRadius: 0.08 });
  s.addText('"ChipChip does not negotiate demand. ChipChip prices demand into discipline."', {
    x: 0.6, y: 4.9, w: 9, h: 0.45, fontSize: 13, fontFace: "Arial", color: "FFFFFF", margin: 0, align: "center", valign: "middle"
  });

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("6", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 11, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout='LAYOUT_16x9'; createSlide(pr,{}); pr.writeFile({fileName:"slide-06-preview.pptx"}); }
module.exports = { createSlide, slideConfig };
