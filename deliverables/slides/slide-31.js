const slideConfig = { type: 'content', index: 31, title: 'Growth Projections' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("GROWTH PROJECTIONS", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Path to Scale — Q1 to Q4 2026", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const projections = [
    { q: "Q1 2026", sales: "7.4M ETB", margin: "-16.68%", orders: "83,731", b2b: "16%", sgls: "~35 active", status: "Discipline Reset" },
    { q: "Q2 2026", sales: "~10.1M ETB", margin: "+3% to +5%", orders: "~100K+", b2b: "25–30%", sgls: "70+", status: "Foundation Built" },
    { q: "Q3 2026", sales: "~11.2M ETB", margin: "+5% to +8%", orders: "~110K+", b2b: "~35%", sgls: "~85", status: "Scaling" },
    { q: "Q4 2026", sales: "~12.8M ETB", margin: "+8% to +12%", orders: "~120K+", b2b: "~40%", sgls: "100", status: "Approaching Breakeven ✦" }
  ];

  for (let i = 0; i < 4; i++) {
    const x = 0.6 + i * 2.35;
    const isLast = i === 3;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 2.15, h: 3.2, fill: { color: isLast ? "FFF5F5" : "F8F8F8" }, rectRadius: 0.12 });
    if (isLast) s.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: 2.15, h: 0.06, fill: { color: "E53935" } });

    s.addText(projections[i].q, { x, y: 1.55, w: 2.15, h: 0.35, fontSize: 16, fontFace: "Arial", color: isLast ? "E53935" : "1A1A1A", bold: true, margin: 0, align: "center" });
    s.addText(projections[i].status, { x, y: 1.85, w: 2.15, h: 0.25, fontSize: 10, fontFace: "Arial", color: "888888", margin: 0, align: "center", italic: true });
    s.addShape(pres.shapes.LINE, { x: x + 0.2, y: 2.1, w: 1.8, h: 0, line: { color: "E5E5E5", width: 1 } });

    const rows = [
      { l: "Sales", v: projections[i].sales },
      { l: "Margin", v: projections[i].margin },
      { l: "Orders/mo", v: projections[i].orders },
      { l: "B2B Share", v: projections[i].b2b },
      { l: "Active SGLs", v: projections[i].sgls }
    ];
    for (let j = 0; j < rows.length; j++) {
      s.addText(rows[j].l, { x: x + 0.1, y: 2.2 + j * 0.45, w: 0.9, h: 0.32, fontSize: 9, fontFace: "Arial", color: "888888", margin: 0, valign: "middle" });
      s.addText(rows[j].v, { x: x + 1.0, y: 2.2 + j * 0.45, w: 1.0, h: 0.32, fontSize: 11, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, align: "right", valign: "middle" });
    }
  }

  // Arrow between quarters
  for (let i = 0; i < 3; i++) {
    s.addText("→", { x: 2.85 + i * 2.35, y: 3.0, w: 0.4, h: 0.4, fontSize: 20, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "middle" });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("31", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-31-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
