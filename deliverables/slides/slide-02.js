const slideConfig = { type: 'toc', index: 2, title: 'Table of Contents' };

function pageBadge(slide, num) {
  slide.addShape(slide._slideLayout._pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  slide.addText(String(num), { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 11, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
}

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };

  // Red left bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });

  // Title
  slide.addText("TABLE OF CONTENTS", {
    x: 0.8, y: 0.5, w: 5, h: 0.6, fontSize: 14, fontFace: "Arial",
    color: "E53935", bold: true, charSpacing: 4, margin: 0
  });

  // TOC in two columns
  const sections = [
    ["01", "Executive Summary"],
    ["02", "Company Vision & Identity"],
    ["03", "Business Model & Revenue"],
    ["04", "Performance Analytics"],
    ["05", "Channel & Product Insights"],
    ["06", "Competitive Landscape"],
    ["07", "Risk Assessment"],
    ["08", "Strategic Recommendations"],
    ["09", "Implementation & Targets"],
    ["10", "Team & Next Steps"]
  ];

  // Left column
  for (let i = 0; i < 5; i++) {
    const y = 1.3 + i * 0.82;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: y, w: 0.5, h: 0.5, fill: { color: "E53935", transparency: i === 0 ? 0 : 15 }, rectRadius: 0.25
    });
    slide.addText(sections[i][0], {
      x: 0.8, y: y, w: 0.5, h: 0.5, fontSize: 16, fontFace: "Arial",
      color: "FFFFFF", bold: true, align: "center", valign: "middle"
    });
    slide.addText(sections[i][1], {
      x: 1.45, y: y, w: 3.8, h: 0.5, fontSize: 16, fontFace: "Arial",
      color: "1A1A1A"
    });
  }

  // Right column
  for (let i = 5; i < 10; i++) {
    const y = 1.3 + (i - 5) * 0.82;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.5, y: y, w: 0.5, h: 0.5, fill: { color: "E53935", transparency: 20 }, rectRadius: 0.25
    });
    slide.addText(sections[i][0], {
      x: 5.5, y: y, w: 0.5, h: 0.5, fontSize: 16, fontFace: "Arial",
      color: "FFFFFF", bold: true, align: "center", valign: "middle"
    });
    slide.addText(sections[i][1], {
      x: 6.15, y: y, w: 3.8, h: 0.5, fontSize: 16, fontFace: "Arial",
      color: "1A1A1A"
    });
  }

  // Decorative circle
  slide.addShape(pres.shapes.OVAL, { x: 7.8, y: 0.4, w: 1.8, h: 1.8, fill: { color: "E53935", transparency: 93 } });

  // Page badge - use slide reference from pres
  slide.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  slide.addText("2", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 11, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });

  return slide;
}

if (require.main === module) {
  const pptxgen = require("pptxgenjs");
  const pres = new pptxgen(); pres.layout = 'LAYOUT_16x9';
  const theme = { primary: "1A1A1A", secondary: "666666", accent: "E53935", light: "F5F5F5", bg: "FFFFFF" };
  createSlide(pres, theme); pres.writeFile({ fileName: "slide-02-preview.pptx" });
}
module.exports = { createSlide, slideConfig };
