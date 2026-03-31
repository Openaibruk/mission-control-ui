const slideConfig = { type: 'content', index: 28, title: 'Recommendation 6' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fill: { color: "E53935" } });
  s.addText("06", { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fontSize: 20, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("TECHNOLOGY BUILD", { x: 1.5, y: 0.55, w: 6, h: 0.6, fontSize: 32, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  s.addText("Enforcement Over Features — Priority Stack", { x: 0.6, y: 1.4, w: 8, h: 0.35, fontSize: 14, fontFace: "Arial", color: "E53935", bold: true, margin: 0 });

  // Priority stack
  const priorities = [
    { p: "P0", items: ["Fix SettingsView — wire to backend", "Connect FeedbackView to Supabase Realtime", "Add drag-and-drop to Kanban"] },
    { p: "P1", items: ["CP1 auto-block system", "BNPL enforcement engine", "Automated reconciliation pipeline"] },
    { p: "P2", items: ["CRM — customer profiles, order history, segmentation", "Business KPI dashboard (revenue, margin, LTV:CAC)", "Automated daily/weekly P&L reporting"] },
    { p: "P3", items: ["Replace hardcoded org chart with dynamic DB-driven chart", "Marketing automation (SGL welcome, social scheduling)", "Content pipeline automation"] }
  ];

  for (let i = 0; i < 4; i++) {
    const y = 1.85 + i * 0.8;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 1.2, h: 0.55, fill: { color: i === 0 ? "E53935" : "F8F8F8" }, rectRadius: 0.1 });
    s.addText(priorities[i].p + " — " + (i === 0 ? "CRITICAL BUGS" : (i === 1 ? "ENFORCEMENT" : (i === 2 ? "ANALYTICS" : "AUTOMATION"))), { x: 0.6, y, w: 1.2, h: 0.55, fontSize: 10, fontFace: "Arial", color: i === 0 ? "FFFFFF" : "1A1A1A", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(priorities[i].items.join("    •    "), { x: 1.9, y, w: 7.5, h: 0.55, fontSize: 11, fontFace: "Arial", color: "333333", margin: 0, valign: "middle" });
  }

  // Tech stack
  s.addText("TECHNOLOGY STACK", { x: 0.6, y: 5.0, w: 5, h: 0.3, fontSize: 10, fontFace: "Arial", color: "888888", bold: true, margin: 0, charSpacing: 3 });
  s.addText("Supabase Postgres  •  Next.js Frontend  •  Paperclip Orchestration  •  ClickHouse Analytics", { x: 0.6, y: 5.25, w: 9, h: 0.25, fontSize: 11, fontFace: "Arial", color: "1A1A1A", margin: 0 })

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("28", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-28-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
