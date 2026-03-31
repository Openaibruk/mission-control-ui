const slideConfig = { type: 'content', index: 17, title: 'Competitive Landscape' };

function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("COMPETITIVE LANDSCAPE", { x: 0.6, y: 0.3, w: 8, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Ethiopian Food Market Analysis", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const colW = [3.2, 2.2, 2.2, 2.0];
  const headers = ["Dimension", "ChipChip", "Traditional Market", "Delivery Platforms"];
  const headerX = [0.6, 3.8, 6.0, 8.2];

  // Header row
  for (let j = 0; j < 4; j++) {
    s.addShape(pres.shapes.RECTANGLE, { x: headerX[j], y: 1.4, w: colW[j], h: 0.4, fill: { color: j === 0 ? "E53935" : "1A1A1A" } });
    s.addText(headers[j], { x: headerX[j], y: 1.4, w: colW[j], h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
  }

  const rows = [
    ["Model", "Asset-light\nMarketplace", "Fragmented\nMiddlemen", "Warehouse-heavy"],
    ["Pricing", "Algorithmic\nDiscipline-driven", "Negotiation-based", "Fixed Markup"],
    ["Aggregation", "SGL Network\nCommunity-based", "None", "Individual Orders"],
    ["Delivery", "3 ETB home\nFREE pickup", "Self-service", "50-150 ETB"],
    ["Credit", "BNPL (Planned)", "Cash Only", "Credit Cards"],
    ["Data", "Full Supply Chain\nVisibility", "Zero", "Limited"],
    ["Quality", "5-Gate QC System", "Visual Inspection", "Variable"]
  ];

  for (let i = 0; i < rows.length; i++) {
    const y = 1.85 + i * 0.48;
    for (let j = 0; j < 4; j++) {
      s.addShape(pres.shapes.RECTANGLE, { x: headerX[j], y, w: colW[j], h: 0.46, fill: { color: i % 2 === 0 ? "FAFAFA" : "FFFFFF" } });
      s.addText(rows[i][j], { x: headerX[j], y, w: colW[j], h: 0.46, fontSize: 10, fontFace: "Arial", color: j === 1 ? "1A1A1A" : (j === 0 ? "1A1A1A" : "666666"), bold: j === 1 || j === 0, margin: 0, align: j === 1 ? "center" : "left", valign: "middle" });
    }
  }

  // ChipChip advantage badge
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.2, w: 9, h: 0.3, fill: { color: "FFF5F5" }, rectRadius: 0.08 });
  s.addText("ChipChip is cheaper than Sunday Market on staples (red onion, tomato, potato) by 3-12 Birr across 14 competitors, 18 products", { x: 0.6, y: 5.2, w: 9, h: 0.3, fontSize: 9, fontFace: "Arial", color: "666666", margin: 0, align: "center", valign: "middle" });

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("17", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}

if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-17-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
