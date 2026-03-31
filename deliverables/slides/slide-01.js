const slideConfig = { type: 'cover', index: 1, title: 'ChipChip Strategic Review Q1 2026' };

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };

  // Red accent bar — full left edge
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625,
    fill: { color: "E53935" }
  });

  // Large decorative circle — top-right
  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -1.2, w: 3.5, h: 3.5,
    fill: { color: "E53935", transparency: 92 }
  });

  // Smaller circle near it
  slide.addShape(pres.shapes.OVAL, {
    x: 8.5, y: 0.8, w: 1.8, h: 1.8,
    fill: { color: "E53935", transparency: 88 }
  });

  // Bottom-left curve
  slide.addShape(pres.shapes.OVAL, {
    x: -1, y: 4.2, w: 3, h: 3,
    fill: { color: "E53935", transparency: 94 }
  });

  // ChipChip branding
  slide.addText("CHIPCHIP", {
    x: 0.8, y: 0.5, w: 5, h: 0.6,
    fontSize: 20, fontFace: "Arial",
    color: "E53935", bold: true, margin: 0, charSpacing: 8
  });

  // Horizontal divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.2, w: 1.2, h: 0.06,
    fill: { color: "E53935" }
  });

  // Main title
  slide.addText("Strategic Review", {
    x: 0.8, y: 1.6, w: 7, h: 1.5,
    fontSize: 52, fontFace: "Arial",
    color: "1A1A1A", bold: true, margin: 0, leading: 56
  });

  // Q1 2026
  slide.addText("Q1 2026", {
    x: 0.8, y: 3.1, w: 7, h: 1,
    fontSize: 52, fontFace: "Arial",
    color: "E53935", bold: true, margin: 0
  });

  // Subtitle
  slide.addText([
    { text: "Asset-Light Food Trade Infrastructure — Ethiopia", options: { breakLine: true } },
    { text: "Lead Designer: Lidya  |  DevOps: Henok", options: {} }
  ], {
    x: 0.8, y: 4.1, w: 6.5, h: 1,
    fontSize: 14, fontFace: "Arial",
    color: "666666", margin: 0, lineSpacingMultiple: 1.4
  });

  // Red tag badge bottom right
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 7.3, y: 4.8, w: 2, h: 0.45,
    fill: { color: "E53935" }, rectRadius: 0.22
  });
  slide.addText("CONFIDENTIAL", {
    x: 7.3, y: 4.8, w: 2, h: 0.45,
    fontSize: 11, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });

  return slide;
}

if (require.main === module) {
  const pptxgen = require("pptxgenjs");
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = { primary: "1A1A1A", secondary: "666666", accent: "E53935", light: "F5F5F5", bg: "FFFFFF" };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-01-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
