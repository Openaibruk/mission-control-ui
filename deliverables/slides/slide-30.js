const slideConfig = { type: 'content', index: 30, title: 'Key Targets' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("KEY TARGETS FOR NEXT QUARTER", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Q2 2026 — Measurable Objectives", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const targets = [
    { metric: "Monthly Sales", current: "7.4M ETB", target: "10M ETB", gap: "+35%", color: "E53935" },
    { metric: "Gross Margin", current: "-16.68%", target: "+3% to +5%", gap: "+20pp", color: "E53935" },
    { metric: "Monthly Burn", current: "10.16M ETB", target: "<8M ETB", gap: "-21%", color: "E53935" },
    { metric: "B2B Revenue Share", current: "16%", target: "25–30%", gap: "+10–14pp", color: "1A1A1A" },
    { metric: "Active SGLs", current: "~35 active", target: "70+", gap: "+35", color: "1A1A1A" },
    { metric: "Restaurant Partners", current: "~20", target: "40", gap: "+20", color: "1A1A1A" },
    { metric: "BNPL Revenue", current: "0 ETB", target: "60–120K ETB/mo", gap: "Build & Launch", color: "1A1A1A" },
    { metric: "CP1", current: "-16.68%", target: "≥+3% to +5%", gap: "+20pp", color: "E53935" }
  ];

  for (let i = 0; i < 8; i++) {
    const y = 1.4 + i * 0.5;
    if (i % 2 === 0) s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 9, h: 0.48, fill: { color: "FAFAFA" } });
    s.addText(targets[i].metric, { x: 0.7, y, w: 2.0, h: 0.48, fontSize: 12, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, valign: "middle" });
    s.addText(targets[i].current, { x: 2.8, y, w: 2.0, h: 0.48, fontSize: 13, fontFace: "Arial", color: "666666", margin: 0, align: "center", valign: "middle" });
    s.addText("→", { x: 4.6, y, w: 0.3, h: 0.48, fontSize: 16, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(targets[i].target, { x: 4.9, y, w: 2.5, h: 0.48, fontSize: 14, fontFace: "Arial", color: targets[i].color, bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(targets[i].gap, { x: 7.6, y, w: 1.8, h: 0.48, fontSize: 11, fontFace: "Arial", color: targets[i].gap.startsWith("+") || targets[i].gap.startsWith("-") ? "E53935" : "FF9800", bold: true, margin: 0, align: "center", valign: "middle" });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("30", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-30-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
