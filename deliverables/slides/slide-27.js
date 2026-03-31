const slideConfig = { type: 'content', index: 27, title: 'Recommendation 5' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fill: { color: "E53935" } });
  s.addText("05", { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fontSize: 20, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("NETWORK DENSIFICATION", { x: 1.5, y: 0.55, w: 6, h: 0.6, fontSize: 32, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // Current vs target
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.5, w: 4.2, h: 1.5, fill: { color: "F8F8F8" }, rectRadius: 0.1 });
  s.addText("CURRENT SGL STATUS", { x: 0.6, y: 1.5, w: 4.2, h: 0.3, fontSize: 10, fontFace: "Arial", color: "888888", bold: true, margin: 0, align: "center" });
  s.addText("~35 active (of 260+)", { x: 0.6, y: 1.8, w: 4.2, h: 0.5, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("260+ total in database · 10-14 active pickup hubs", { x: 0.6, y: 2.35, w: 4.2, h: 0.3, fontSize: 11, fontFace: "Arial", color: "666666", margin: 0, align: "center" });

  s.addShape(pres.shapes.OVAL, { x: 5.0, y: 2.0, w: 0.6, h: 0.6, fill: { color: "E53935" } });
  s.addText("→", { x: 5.0, y: 2.0, w: 0.6, h: 0.6, fontSize: 22, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.8, y: 1.5, w: 3.8, h: 1.5, fill: { color: "FFF5F5" }, rectRadius: 0.1 });
  s.addText("TARGET", { x: 5.8, y: 1.5, w: 3.8, h: 0.3, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center" });
  s.addText("100 active SGLs", { x: 5.8, y: 1.8, w: 3.8, h: 0.5, fontSize: 30, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("14 pickup hubs fully activated", { x: 5.8, y: 2.35, w: 3.8, h: 0.3, fontSize: 11, fontFace: "Arial", color: "666666", margin: 0, align: "center" });

  // Action plan
  s.addText("RECRUITMENT ENGINE", { x: 0.6, y: 3.3, w: 4, h: 0.3, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 3 });

  const steps = [
    { title: "Driver-Led Recruitment", desc: "Drivers identify & recruit SGLs with milestone incentives" },
    { title: "Geographic Gap Mapping", desc: "Use order density data to target recruitment in underserved areas" },
    { title: "7-Day Automated Onboarding", desc: "Welcome sequence with training materials, commission setup" },
    { title: "Tier System", desc: "Bronze → Silver → Gold with increasing commission benefits" }
  ];

  for (let i = 0; i < 4; i++) {
    const x2 = 0.6 + i * 2.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x2, y: 3.7, w: 2.1, h: 1.0, fill: { color: "F8F8F8" }, rectRadius: 0.1 });
    s.addShape(pres.shapes.OVAL, { x: x2 + 0.7, y: 3.8, w: 0.7, h: 0.7, fill: { color: "E53935" } });
    s.addText(String(i + 1), { x: x2 + 0.7, y: 3.8, w: 0.7, h: 0.7, fontSize: 18, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(steps[i].title, { x: x2 + 0.05, y: 4.3, w: 2.0, h: 0.2, fontSize: 10, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, align: "center" });
  }

  // Revenue math
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.85, w: 9, h: 0.5, fill: { color: "FFF5F5" }, rectRadius: 0.08 });
  s.addText("Revenue impact: 100 SGLs × 100 orders/month × 30kg × 2 ETB spread = 600,000 ETB/month pure margin flow", { x: 0.6, y: 4.85, w: 9, h: 0.5, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "middle" });

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("27", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-27-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
