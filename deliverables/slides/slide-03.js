const slideConfig = { type: 'content', index: 3, title: 'Executive Summary' };

function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });

  s.addText("EXECUTIVE SUMMARY", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 4 });
  s.addText("Key Numbers at a Glance", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const stats = [
    { val: "7.4M ETB", lbl: "Monthly Sales", note: "Target: 12M (+62%)" },
    { val: "-16.68%", lbl: "Gross Margin", note: "Improved from -45.49%" },
    { val: "10.16M ETB", lbl: "Monthly Burn", note: "Reduced 48% MoM" },
    { val: "83,731", lbl: "Monthly Orders", note: "Target: 120,000" },
    { val: "16%", lbl: "B2B Revenue Share", note: "Target: 40%" },
    { val: "~35 active", lbl: "Active SGLs", note: "Target: 70+ (Q2)" }
  ];

  const sh = () => ({ type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.06 });

  for (let i = 0; i < 6; i++) {
    const col = i % 3; const row = Math.floor(i / 3);
    const x = 0.6 + col * 3.1;
    const yBase = row === 0 ? 1.45 : 3.2;
    const hCard = i < 3 ? 1.55 : 1.4;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: yBase, w: 2.85, h: hCard, fill: { color: "F8F8F8" }, rectRadius: 0.12, shadow: sh() });
    s.addShape(pres.shapes.RECTANGLE, { x, y: yBase, w: 0.07, h: hCard, fill: { color: "E53935" } });
    s.addText(stats[i].lbl, { x: x+0.18, y: yBase+0.12, w: 2.5, h: 0.28, fontSize: 10, fontFace: "Arial", color: "999999", margin: 0 });
    s.addText(stats[i].val, { x: x+0.18, y: yBase+0.4, w: 2.5, h: 0.5, fontSize: 24, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });
    s.addText(stats[i].note, { x: x+0.18, y: yBase+hCard-0.35, w: 2.5, h: 0.3, fontSize: 10, fontFace: "Arial", color: "666666", margin: 0 });
  }

  s.addShape(pres.shapes.OVAL, { x: 8.5, y: 3.8, w: 1.4, h: 1.4, fill: { color: "E53935", transparency: 93 } });
  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("3", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 11, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}

if (require.main === module) {
  const pptxgen = require("pptxgenjs");
  const pres = new pptxgen(); pres.layout = 'LAYOUT_16x9';
  const theme = { primary: "1A1A1A", secondary: "666666", accent: "E53935", light: "F5F5F5", bg: "FFFFFF" };
  createSlide(pres, theme); pres.writeFile({ fileName: "slide-03-preview.pptx" });
}
module.exports = { createSlide, slideConfig };
