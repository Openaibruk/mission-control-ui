const slideConfig = { type: 'section', index: 4, title: 'Company Vision' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "1A1A1A" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });

  s.addText("COMPANY", { x: 0.8, y: 1.2, w: 8, h: 0.8, fontSize: 50, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0 });
  s.addText("VISION", { x: 0.8, y: 2.0, w: 8, h: 0.8, fontSize: 50, fontFace: "Arial", color: "E53935", bold: true, margin: 0 });

  s.addText('"We don\'t touch products. We control flows."', {
    x: 0.8, y: 3.3, w: 8, h: 0.6, fontSize: 20, fontFace: "Arial", color: "CCCCCC", italic: true, margin: 0
  });

  s.addText("Ethiopia's first asset-light food trade infrastructure platform", {
    x: 0.8, y: 4.0, w: 8, h: 0.4, fontSize: 14, fontFace: "Arial", color: "999999", margin: 0
  });

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("4", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 11, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-04-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
