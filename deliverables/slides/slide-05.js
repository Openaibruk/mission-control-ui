const slideConfig = { type: 'content', index: 5, title: 'Our Market Identity' };

function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });

  s.addText("OUR MARKET IDENTITY", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Asset-Light Control Tower Positioning", { x: 0.6, y: 0.65, w: 9, h: 0.55, fontSize: 28, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // Old vs New comparison
  // Old Identity
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.5, w: 3.8, h: 3.2, fill: { color: "F8F8F8" }, rectRadius: 0.12 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.5, w: 3.8, h: 0.5, fill: { color: "999999" } });
  s.addText("OLD IDENTITY", { x: 0.6, y: 1.5, w: 3.8, h: 0.5, fontSize: 14, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });

  const oldItems = ["Warehouse operator", "B2C delivery company", "Physical handler", "Negotiation-driven", "Speculative inventory", "Manual operations"];
  for (let i = 0; i < oldItems.length; i++) {
    s.addShape(pres.shapes.OVAL, { x: 0.85, y: 2.12 + i * 0.4, w: 0.14, h: 0.14, fill: { color: "999999" } });
    s.addText(oldItems[i], { x: 1.1, y: 2.08 + i * 0.4, w: 3.1, h: 0.32, fontSize: 12, fontFace: "Arial", color: "666666", margin: 0 });
  }

  // Arrow
  s.addShape(pres.shapes.OVAL, { x: 4.65, y: 2.3, w: 0.7, h: 0.7, fill: { color: "E53935" } });
  s.addText("→", { x: 4.65, y: 2.3, w: 0.7, h: 0.7, fontSize: 28, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });

  // New Identity
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.6, y: 1.5, w: 4, h: 3.2, fill: { color: "FFF5F5" }, rectRadius: 0.12 });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: 1.5, w: 4, h: 0.5, fill: { color: "E53935" } });
  s.addText("NEW IDENTITY", { x: 5.6, y: 1.5, w: 4, h: 0.5, fontSize: 14, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });

  const newItems = ["Asset-light flow designer", "Multi-sided marketplace", "Digital control tower", "Algorithmic pricing discipline", "Just-in-time demand-backed sourcing", "Automated enforcement systems"];
  for (let i = 0; i < newItems.length; i++) {
    s.addShape(pres.shapes.OVAL, { x: 5.85, y: 2.12 + i * 0.4, w: 0.14, h: 0.14, fill: { color: "E53935" } });
    s.addText(newItems[i], { x: 6.1, y: 2.08 + i * 0.4, w: 3.3, h: 0.32, fontSize: 12, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });
  }

  // End-state
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.85, w: 9, h: 0.5, fill: { color: "E53935" }, rectRadius: 0.08 });
  s.addText("End-State Target: 0% direct B2C volume — 100% B2B + B2B2C mix through Smart Souks & Captains", {
    x: 0.6, y: 4.85, w: 9, h: 0.5, fontSize: 12, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle"
  });

  s.addShape(pres.shapes.OVAL, { x: 8.8, y: 0.2, w: 1.4, h: 1.4, fill: { color: "E53935", transparency: 93 } });
  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("5", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 11, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}

if (require.main === module) {
  const pptxgen = require("pptxgenjs");
  const pres = new pptxgen(); pres.layout = 'LAYOUT_16x9';
  createSlide(pres, {}); pres.writeFile({ fileName: "slide-05-preview.pptx" });
}
module.exports = { createSlide, slideConfig };
