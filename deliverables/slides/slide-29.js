const slideConfig = { type: 'content', index: 29, title: 'Implementation Timeline' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("IMPLEMENTATION TIMELINE", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Q1-Q2 2026 — Prioritized Execution Plan", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const phases = [
    { label: "WEEKS 1-4", title: "Fix Financial Engine", desc: "CP1 auto-block · Kill unprofitable SKUs\nAggressive SG&A reduction · BNPL pilot (10 restaurants)", color: "D32F2F" },
    { label: "WEEKS 1-6", title: "Tech Enforcement Build", desc: "Fix critical UI bugs · Build enforcement layer\nImplement CRM and analytics dashboard", color: "E53935" },
    { label: "WEEKS 4-12", title: "SGL Network Scale", desc: "Activate recruitment engine (target: 100 SGLs)\n14 pickup hubs · Commission tiers · Retention", color: "FF6B6B" },
    { label: "WEEKS 4-12", title: "B2B Contracts", desc: "Formal restaurant sales program · Target: 40\nDedicated account mgmt · BNPL rollout", color: "FF8A8A" },
    { label: "WEEKS 2-8", title: "Marketing Automation", desc: "SGL welcome sequence · Social scheduling\nCampaign reporting · ~80 hrs/month saved", color: "FFB3B3" },
    { label: "WEEKS 4-12", title: "Supply Chain Optimize", desc: "Flash sale automation · Supplier Reputation\nProduct expansion (FMCG) · Zero-speculation", color: "FFCDD2" }
  ];

  for (let i = 0; i < 6; i++) {
    const y = 1.45 + i * 0.68;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 1.3, h: 0.55, fill: { color: phases[i].color }, rectRadius: 0.12 });
    s.addText(phases[i].label, { x: 0.6, y, w: 1.3, h: 0.55, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 2.05, y, w: 7.5, h: 0.55, fill: { color: "F8F8F8" }, rectRadius: 0.1 });
    s.addText(phases[i].title, { x: 2.15, y: y + 0.02, w: 7.3, h: 0.22, fontSize: 12, fontFace: "Arial", color: phases[i].color, bold: true, margin: 0 });
    s.addText(phases[i].desc, { x: 2.15, y: y + 0.25, w: 7.3, h: 0.28, fontSize: 10, fontFace: "Arial", color: "444444", margin: 0 });
  }

  // Connector lines between phases
  for (let i = 0; i < 5; i++) {
    s.addShape(pres.shapes.LINE, { x: 1.2, y: 2.03 + i * 0.68, w: 0.7, h: 0, line: { color: "E53935", width: 1 } });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("29", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-29-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
