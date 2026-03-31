const slideConfig = { type: 'content', index: 20, title: 'Financial Health & Burn Rate' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("FINANCIAL HEALTH", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Burn Rate & Path to Sustainability", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // Burn comparison
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.5, w: 2.8, h: 1.3, fill: { color: "FFF5F5" }, rectRadius: 0.12 });
  s.addText("January Burn", { x: 0.6, y: 1.55, w: 2.8, h: 0.3, fontSize: 12, fontFace: "Arial", color: "888888", margin: 0, align: "center" });
  s.addText("19,650,000 ETB", { x: 0.6, y: 1.85, w: 2.8, h: 0.5, fontSize: 20, fontFace: "Arial", color: "D32F2F", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("Pre-discipline reset", { x: 0.6, y: 2.4, w: 2.8, h: 0.25, fontSize: 10, fontFace: "Arial", color: "999999", margin: 0, align: "center" });

  s.addShape(pres.shapes.OVAL, { x: 3.65, y: 1.95, w: 0.5, h: 0.5, fill: { color: "E53935" } });
  s.addText("↓", { x: 3.65, y: 1.95, w: 0.5, h: 0.5, fontSize: 22, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("-48%", { x: 3.65, y: 2.5, w: 0.5, h: 0.2, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center" });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.4, y: 1.5, w: 2.8, h: 1.3, fill: { color: "FFF5F5" }, rectRadius: 0.12 });
  s.addText("February Burn", { x: 4.4, y: 1.55, w: 2.8, h: 0.3, fontSize: 12, fontFace: "Arial", color: "888888", margin: 0, align: "center" });
  s.addText("10,160,000 ETB", { x: 4.4, y: 1.85, w: 2.8, h: 0.5, fontSize: 20, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("Post-discipline reset", { x: 4.4, y: 2.4, w: 2.8, h: 0.25, fontSize: 10, fontFace: "Arial", color: "999999", margin: 0, align: "center" });

  // Gap analysis
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.5, y: 1.5, w: 2.1, h: 1.3, fill: { color: "1A1A1A" }, rectRadius: 0.12 });
  s.addText("Monthly Gap", { x: 7.5, y: 1.55, w: 2.1, h: 0.3, fontSize: 12, fontFace: "Arial", color: "999999", margin: 0, align: "center" });
  s.addText("-2.7M ETB", { x: 7.5, y: 1.85, w: 2.1, h: 0.5, fontSize: 20, fontFace: "Arial", color: "D32F2F", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("Still losing money", { x: 7.5, y: 2.4, w: 2.1, h: 0.25, fontSize: 10, fontFace: "Arial", color: "888888", margin: 0, align: "center" });

  // Burn reduction targets (from KPI booklet)
  s.addText("Q1 KPI REDUCTION TARGETS", { x: 0.6, y: 3.15, w: 4, h: 0.3, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 3 });

  const targets = [
    { area: "Marketing", target: "-35%" },
    { area: "Warehouse", target: "-15%" },
    { area: "Salary", target: "-10%" }
  ];

  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * 3.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.5, w: 2.7, h: 0.7, fill: { color: "F8F8F8" }, rectRadius: 0.1 });
    s.addText(targets[i].area, { x, y: 3.55, w: 2.7, h: 0.3, fontSize: 12, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, align: "center" });
    s.addText(targets[i].target, { x, y: 3.85, w: 2.7, h: 0.3, fontSize: 16, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center" });
  }

  // Path to sustainability
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.4, w: 9, h: 0.85, fill: { color: "FFF5F5" }, rectRadius: 0.1 });
  s.addText("PATH TO SUSTAINABILITY", { x: 0.8, y: 4.42, w: 8.6, h: 0.25, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center" });
  s.addText([
    { text: "CP1 ≥ +5% ", options: { bold: true, color: "E53935" } },
    { text: "by end of Q1 → ", options: { color: "333333" } },
    { text: "SG&A below revenue ", options: { bold: true, color: "E53935" } },
    { text: "by Q2 → ", options: { color: "333333" } },
    { text: "Company breakeven ", options: { bold: true, color: "E53935" } },
    { text: "by Q4 2026", options: { color: "333333" } }
  ], { x: 0.8, y: 4.65, w: 8.6, h: 0.5, fontSize: 14, fontFace: "Arial", margin: 0, align: "center", valign: "middle" });

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("20", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-20-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
