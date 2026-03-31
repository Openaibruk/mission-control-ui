const slideConfig = { type: 'closing', index: 34, title: 'Thank You' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };

  // Red full-height accent bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });

  // Large decorative circles (brand motif)
  slide.addShape(pres.shapes.OVAL, { x: 6.5, y: -1.5, w: 4, h: 4, fill: { color: "E53935", transparency: 92 } });
  slide.addShape(pres.shapes.OVAL, { x: 7.5, y: 0.5, w: 2.5, h: 2.5, fill: { color: "E53935", transparency: 94 } });
  slide.addShape(pres.shapes.OVAL, { x: -1.5, y: 4, w: 3.5, h: 3.5, fill: { color: "E53935", transparency: 94 } });

  // Red horizontal line
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.2, w: 1.0, h: 0.05, fill: { color: "E53935" } });

  // CHIPCHIP brand
  slide.addText("CHIPCHIP", {
    x: 0.8, y: 1.3, w: 6, h: 0.5,
    fontSize: 18, fontFace: "Arial",
    color: "E53935", bold: true, margin: 0, charSpacing: 8
  });

  // Main title - THANK YOU
  slide.addText("Thank You", {
    x: 0.8, y: 2.35, w: 7, h: 1.2,
    fontSize: 64, fontFace: "Arial",
    color: "1A1A1A", bold: true, margin: 0
  });

  // Subtitle
  slide.addText("Asset-Light Food Trade Infrastructure — Ethiopia", {
    x: 0.8, y: 3.6, w: 7, h: 0.5,
    fontSize: 18, fontFace: "Arial",
    color: "888888", margin: 0
  });

  // Team line
  slide.addText("Lidya  ·  Henok  ·  Kiro  ·  Amen", {
    x: 0.8, y: 4.3, w: 7, h: 0.35,
    fontSize: 14, fontFace: "Arial",
    color: "666666", margin: 0, charSpacing: 2
  });

  // Tagline box
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.8, w: 5, h: 0.45,
    fill: { color: "E53935" }, rectRadius: 0.22
  });
  slide.addText("We don't touch products. We control flows.", {
    x: 0.8, y: 4.8, w: 5, h: 0.45,
    fontSize: 13, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    margin: 0, align: "center", valign: "middle", charSpacing: 1
  });

  // Confidential tag
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 7.5, y: 5.0, w: 2, h: 0.4,
    fill: { color: "F0F0F0" }, rectRadius: 0.2
  });
  slide.addText("Q1 2026 · CONFIDENTIAL", {
    x: 7.5, y: 5.0, w: 2, h: 0.4,
    fontSize: 9, fontFace: "Arial",
    color: "999999",
    margin: 0, align: "center", valign: "middle"
  });

  return slide;
}

if (require.main === module) {
  const pptxgen = require("pptxgenjs");
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  createSlide(pres, {});
  pres.writeFile({ fileName: "slide-34-preview.pptx" });
}
module.exports = { createSlide, slideConfig };
