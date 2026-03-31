const slideConfig = { type: 'content', index: 33, title: 'Team & Next Steps' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("TEAM & NEXT STEPS", { x: 0.6, y: 0.3, w: 5, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Leadership & Immediate Actions", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // Team cards
  const team = [
    { name: "Lidya", role: "Lead Designer", focus: "Brand system, presentation design, user experience, visual identity", color: "E53935" },
    { name: "Henok", role: "DevOps", focus: "Infrastructure, deployment automation, system reliability, performance", color: "1A1A1A" },
    { name: "Kiro", role: "Architect", focus: "System architecture, strategic analysis, technology roadmap", color: "666666" },
    { name: "Amen", role: "Analytics", focus: "Business analytics, KPI tracking, data insights, reporting", color: "999999" }
  ];

  for (let i = 0; i < 4; i++) {
    const x = 0.6 + i * 2.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 2.15, h: 0.9, fill: { color: "F8F8F8" }, rectRadius: 0.1 });
    s.addShape(pres.shapes.OVAL, { x: x + 0.68, y: 1.6, w: 0.8, h: 0.8, fill: { color: team[i].color, transparency: 85 } });
    s.addText(team[i].name.substring(0, 2).toUpperCase(), { x: x + 0.68, y: 1.6, w: 0.8, h: 0.8, fontSize: 18, fontFace: "Arial", color: team[i].color, bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(team[i].name, { x, y: 1.6, w: 2.15, h: 0.25, fontSize: 12, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, align: "center" });
    s.addText(team[i].role, { x, y: 1.85, w: 2.15, h: 0.2, fontSize: 10, fontFace: "Arial", color: team[i].color, margin: 0, align: "center" });
    s.addText(team[i].focus, { x: x + 0.1, y: 2.05, w: 1.95, h: 0.3, fontSize: 9, fontFace: "Arial", color: "666666", margin: 0, align: "center" });
  }

  // Next steps
  s.addText("IMMEDIATE NEXT STEPS", { x: 0.6, y: 2.75, w: 4, h: 0.3, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 3 });

  const steps = [
    { n: "1", action: "Approve strategic recommendations and priority order for execution" },
    { n: "2", action: "Begin P0 tech fixes — SettingsView, FeedbackView, Kanban drag-and-drop" },
    { n: "3", action: "Enforce CP1 auto-block on all SKUs — starting this week" },
    { n: "4", action: "Launch BNPL pilot with top 10 restaurants within 2 weeks" },
    { n: "5", action: "Initiate SGL recruitment engine with driver-led program" },
    { n: "6", action: "Assign dedicated B2B sales agent for restaurant onboarding" },
    { n: "7", action: "Implement daily/weekly KPI dashboards for real-time visibility" }
  ];

  for (let i = 0; i < 7; i++) {
    const x = i < 4 ? 0.6 + i * 2.35 : 0.6 + (i - 4) * 2.35;
    const y = i < 4 ? 3.15 : 3.15;
    const y2 = i < 4 ? 3.15 : 4.0;
    const x2 = i < 4 ? 0.6 + i * 2.35 : 0.6 + (i - 4) * 2.35;
  }

  // Simpler layout for steps
  for (let i = 0; i < 7; i++) {
    const y = 3.15 + Math.floor(i / 4) * 0.88;
    const x = 0.6 + (i % 4) * 2.35;
    if (i < 4) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.15, h: 0.75, fill: { color: "FFF5F5" }, rectRadius: 0.1 });
      s.addShape(pres.shapes.OVAL, { x: x + 0.05, y: y + 0.08, w: 0.35, h: 0.35, fill: { color: "E53935" } });
      s.addText(steps[i].n, { x: x + 0.05, y: y + 0.08, w: 0.35, h: 0.35, fontSize: 14, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
      s.addText(steps[i].action, { x: x + 0.5, y: y + 0.05, w: 1.55, h: 0.65, fontSize: 10, fontFace: "Arial", color: "333333", margin: 0, valign: "middle" });
    }
  }
  // Bottom row
  for (let i = 4; i < 7; i++) {
    const x = 0.6 + (i - 4) * 2.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.1, w: 2.15, h: 0.75, fill: { color: "F8F8F8" }, rectRadius: 0.1 });
    s.addShape(pres.shapes.OVAL, { x: x + 0.05, y: 4.18, w: 0.35, h: 0.35, fill: { color: "E53935" } });
    s.addText(steps[i].n, { x: x + 0.05, y: 4.18, w: 0.35, h: 0.35, fontSize: 14, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(steps[i].action, { x: x + 0.5, y: 4.15, w: 1.55, h: 0.65, fontSize: 10, fontFace: "Arial", color: "333333", margin: 0, valign: "middle" });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("33", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-33-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
