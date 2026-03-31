const slideConfig = { type: 'content', index: 32, title: 'What Success Looks Like' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("WHAT SUCCESS LOOKS LIKE", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("End-State Vision for ChipChip", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const pillars = [
    { title: "Zero B2C Volume", desc: "100% of volume flows through B2B and B2B2C channels. 0% individual B2C." },
    { title: "CP1 Positive", desc: "Every SKU is profitable at contribution margin level. No loss-leader products." },
    { title: "Company Breakeven", desc: "CP2 positive, burn rate at zero or below revenue. Financially self-sustaining." },
    { title: "100 Active SGLs", desc: "100 Super Group Leaders, 14 pickup hubs, dense neighborhood coverage across Addis." },
    { title: "40+ Restaurants", desc: "40 B2B restaurant partners with recurring orders and BNPL credit products." },
    { title: "BNPL Ecosystem", desc: "Credit products active for restaurants, SGLs, and suppliers. 35% of revenue from BNPL." },
    { title: "Automated Platform", desc: "Enforcement systems auto-block negative-margin orders. CRM manages lifecycle." },
    { title: "30M+ ETB/month", desc: "Scale target achieved. Pricing intelligence data becomes its own product." }
  ];

  for (let i = 0; i < 8; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.6 + col * 2.35;
    const y = 1.4 + row * 1.75;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.15, h: 1.5, fill: { color: "F8F8F8" }, rectRadius: 0.1 });
    s.addShape(pres.shapes.OVAL, { x: x + 0.78, y: y + 0.1, w: 0.6, h: 0.6, fill: { color: "E53935" } });
    s.addText("✓", { x: x + 0.78, y: y + 0.1, w: 0.6, h: 0.6, fontSize: 24, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(pillars[i].title, { x: x + 0.1, y: y + 0.75, w: 1.95, h: 0.3, fontSize: 12, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, align: "center" });
    s.addText(pillars[i].desc, { x: x + 0.1, y: y + 1.05, w: 1.95, h: 0.4, fontSize: 9, fontFace: "Arial", color: "555555", margin: 0, align: "center" });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("32", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-32-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
