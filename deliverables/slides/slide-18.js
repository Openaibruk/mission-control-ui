const slideConfig = { type: 'section', index: 18, title: 'Market Positioning' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "1A1A1A" };

  // Red accent block
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });

  // Large section number
  s.addText("18", { x: 0.8, y: 1.0, w: 4, h: 1.5, fontSize: 72, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 8 });

  s.addText("MARKET", { x: 0.8, y: 2.3, w: 8, h: 0.7, fontSize: 44, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0 });
  s.addText("POSITIONING", { x: 0.8, y: 3.0, w: 8, h: 0.7, fontSize: 44, fontFace: "Arial", color: "E53935", bold: true, margin: 0 });

  // Subtitle
  s.addText("Why Ethiopia's Food Trade Needs ChipChip", { x: 0.8, y: 4.0, w: 6, h: 0.5, fontSize: 16, fontFace: "Arial", color: "999999", margin: 0 });

  // Key stats
  s.addText("120M+ People · 80%+ Rural · 30-50% Middleman Markup", { x: 0.8, y: 4.6, w: 7, h: 0.35, fontSize: 13, fontFace: "Arial", color: "CCCCCC", margin: 0 });

  // Page badge (white)
  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("18", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-18-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
