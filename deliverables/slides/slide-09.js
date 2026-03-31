const slideConfig = { type: 'content', index: 9, title: 'Revenue & Profit Analysis' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("REVENUE & PROFIT ANALYSIS", { x: 0.6, y: 0.3, w: 8, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("January → February 2026 — Financial Performance", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 28, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // Jan vs Feb comparison
  const metrics = [
    { label: "Monthly Sales", jan: "—", feb: "7,400,000 ETB", note: "Tracking" },
    { label: "Gross Margin", jan: "-45.49%", feb: "-16.68%", note: "+29pp improvement ✅" },
    { label: "Monthly Burn", jan: "19,650,000 ETB", feb: "10,160,000 ETB", note: "-48% reduction ✅" },
    { label: "Total Orders", jan: "—", feb: "83,731", note: "Tracking" },
    { label: "Total Volume", jan: "—", feb: "153,989 kg", note: "Tracking" },
    { label: "Sales/Order", jan: "—", feb: "88 ETB", note: "" },
    { label: "Sales/KG", jan: "—", feb: "48 ETB", note: "" }
  ];

  const sh = () => ({ type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.06 });

  // Header
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.45, w: 4.2, h: 0.4, fill: { color: "F0F0F0" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.8, y: 1.45, w: 2, h: 0.4, fill: { color: "F0F0F0" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 1.45, w: 2.8, h: 0.4, fill: { color: "F0F0F0" } });
  s.addText("METRIC", { x: 0.6, y: 1.45, w: 4.2, h: 0.4, fontSize: 10, fontFace: "Arial", color: "666666", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("FEBRUARY", { x: 4.8, y: 1.45, w: 2, h: 0.4, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("CHANGE", { x: 6.8, y: 1.45, w: 2.8, h: 0.4, fontSize: 10, fontFace: "Arial", color: "666666", bold: true, margin: 0, align: "center", valign: "middle" });

  for (let i = 0; i < metrics.length; i++) {
    const y = 1.88 + i * 0.42;
    const isBg = i % 2 === 0;
    if (isBg) s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 9, h: 0.4, fill: { color: "FAFAFA" } });
    s.addText(metrics[i].label, { x: 0.6, y, w: 4.2, h: 0.4, fontSize: 12, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, valign: "middle" });
    s.addText(metrics[i].feb, { x: 4.8, y, w: 2, h: 0.4, fontSize: 12, fontFace: "Arial", color: "1A1A1A", margin: 0, align: "center", valign: "middle" });
    s.addText(metrics[i].note, { x: 6.8, y, w: 2.8, h: 0.4, fontSize: 11, fontFace: "Arial", color: metrics[i].note.includes("✅") ? "E53935" : "666666", margin: 0, valign: "middle" });
  }

  // Burn commentary
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.8, w: 9, h: 0.6, fill: { color: "FFF5F5" }, rectRadius: 0.08 });
  s.addText("CRITICAL: Still burning 10M ETB/month against 7.4M ETB revenue. Unsustainable beyond current runway.", {
    x: 0.6, y: 4.8, w: 9, h: 0.6, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "middle"
  });

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("9", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 11, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main===module) { const p=require("pptxgenjs"); const pr=new p(); pr.layout='LAYOUT_16x9'; createSlide(pr,{}); pr.writeFile({fileName:"slide-09-preview.pptx"});}
module.exports = { createSlide, slideConfig };
