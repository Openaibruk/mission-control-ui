const slideConfig = { type: 'content', index: 10, title: 'Operational Metrics' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("OPERATIONAL METRICS", { x: 0.6, y: 0.3, w: 8, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Orders, AOV & Daily Run Rate", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // Stat callouts in a row
  const stats = [
    { val: "83,731", label: "Monthly Orders", sub: "Target: 120,000" },
    { val: "153,989 kg", label: "Total Volume", sub: "~154 tons / month" },
    { val: "88 ETB", label: "Sales/Order", sub: "Avg order value" },
    { val: "48 ETB", label: "Sales/KG", sub: "Per-kg revenue" },
    { val: "5,419 ETB", label: "Daily Run Rate (W6)", sub: "Down 9.6% from W5" }
  ];

  for (let i = 0; i < 5; i++) {
    const x = 0.6 + i * 1.85;
    const isEven = i % 2 === 0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 1.7, h: 1.9, fill: { color: isEven ? "FFF5F5" : "F8F8F8" }, rectRadius: 0.1 });
    s.addText(stats[i].val, { x, y: 1.55, w: 1.7, h: 0.6, fontSize: 22, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addShape(pres.shapes.LINE, { x: x + 0.2, y: 2.2, w: 1.3, h: 0, line: { color: "E5E5E5", width: 1 } });
    s.addText(stats[i].label, { x, y: 2.25, w: 1.7, h: 0.4, fontSize: 11, fontFace: "Arial", color: "333333", bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(stats[i].sub, { x, y: 2.7, w: 1.7, h: 0.5, fontSize: 10, fontFace: "Arial", color: "888888", margin: 0, align: "center", valign: "top" });
  }

  // Weekly KPI trend
  s.addText("WEEKLY KPI TREND", { x: 0.6, y: 3.6, w: 4, h: 0.3, fontSize: 11, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 3 });

  const kpis = [
    { label: "Weekly Sales", w1: "1,054,953", w3: "1,555,460", w6: "1,665,477", change: "+57.9%" },
    { label: "SGL Channel Sales", w1: "1,989", w3: "3,748", w6: "9,731", change: "+389.5% ✅" },
    { label: "B2B Sales", w1: "5,755", w3: "1,590", w6: "2,396", change: "-58.4%" },
    { label: "FMCG Sales", w1: "1,716", w3: "1,783", w6: "1,966", change: "+14.6%" }
  ];

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 3.9, w: 9, h: 1.55, fill: { color: "F8F8F8" }, rectRadius: 0.1 });

  // Header
  s.addText("KPI", { x: 0.7, y: 3.92, w: 2, h: 0.25, fontSize: 9, fontFace: "Arial", color: "888888", bold: true, margin: 0 });
  s.addText("W1", { x: 2.7, y: 3.92, w: 1.8, h: 0.25, fontSize: 9, fontFace: "Arial", color: "888888", bold: true, margin: 0, align: "center" });
  s.addText("W3 (Peak)", { x: 4.5, y: 3.92, w: 1.8, h: 0.25, fontSize: 9, fontFace: "Arial", color: "888888", bold: true, margin: 0, align: "center" });
  s.addText("W6 (Latest)", { x: 6.3, y: 3.92, w: 1.8, h: 0.25, fontSize: 9, fontFace: "Arial", color: "888888", bold: true, margin: 0, align: "center" });
  s.addText("Change", { x: 8.1, y: 3.92, w: 1.3, h: 0.25, fontSize: 9, fontFace: "Arial", color: "888888", bold: true, margin: 0, align: "center" });

  for (let i = 0; i < kpis.length; i++) {
    const y = 4.18 + i * 0.33;
    s.addText(kpis[i].label, { x: 0.7, y, w: 2, h: 0.28, fontSize: 10, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });
    s.addText(kpis[i].w1, { x: 2.7, y, w: 1.8, h: 0.28, fontSize: 10, fontFace: "Arial", color: "333333", margin: 0, align: "center" });
    s.addText(kpis[i].w3, { x: 4.5, y, w: 1.8, h: 0.28, fontSize: 10, fontFace: "Arial", color: "333333", margin: 0, align: "center" });
    s.addText(kpis[i].w6, { x: 6.3, y, w: 1.8, h: 0.28, fontSize: 10, fontFace: "Arial", color: "333333", margin: 0, align: "center" });
    s.addText(kpis[i].change, { x: 8.1, y, w: 1.3, h: 0.28, fontSize: 10, fontFace: "Arial", color: kpis[i].change.includes("✅") ? "E53935" : kpis[i].change.startsWith("-") ? "D32F2F" : "333333", margin: 0, align: "center" });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("10", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main===module){const p=require("pptxgenjs");const pr=new p();pr.layout='LAYOUT_16x9';createSlide(pr,{});pr.writeFile({fileName:"slide-10-preview.pptx"});}
module.exports={createSlide,slideConfig};
