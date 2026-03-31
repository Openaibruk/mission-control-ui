const slideConfig = { type: 'content', index: 8, title: '6-Week Sales Performance' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("6-WEEK SALES PERFORMANCE", { x: 0.6, y: 0.3, w: 8, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Weekly Sales Trend", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  // Bar chart - Weekly Sales
  const sales = [
    { label: "W1\nFeb 9-15", value: 1054953, pct: 59 },
    { label: "W2\nFeb 16-22", value: 1116710, pct: 63 },
    { label: "W3\nFeb 23-Mar 1", value: 1555460, pct: 87 },
    { label: "W5\nMar 2-8", value: 1591079, pct: 89 },
    { label: "W6\nMar 9-15", value: 1665477, pct: 93 }
  ];

  // Chart area
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.4, w: 9, h: 2.5, fill: { color: "FAFAFA" }, rectRadius: 0.05 });

  // Target line
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 3.0, w: 8.8, h: 0, line: { color: "E53935", width: 1, dashType: "dash" } });
  s.addText("Target: 1,788,779 ETB/week", { x: 0.7, y: 3.05, w: 3.5, h: 0.25, fontSize: 9, fontFace: "Arial", color: "E53935", margin: 0 });

  const maxVal = 1788779;
  const chartW = 1.4;
  const gap = 0.25;
  const startX = 1.0;
  const barBase = 3.7;

  for (let i = 0; i < sales.length; i++) {
    const barH = (sales[i].value / maxVal) * 2.2;
    const x = startX + i * (chartW + gap);
    // Bar
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: barBase - barH, w: chartW, h: barH,
      fill: { color: sales[i].percent_of_target >= 100 ? "E53935" : "FF8A8A" }
    });
    // Value label
    s.addText((sales[i].value / 1000000).toFixed(2) + "M", {
      x, y: barBase - barH - 0.25, w: chartW, h: 0.22, fontSize: 11, fontFace: "Arial",
      color: "1A1A1A", bold: true, margin: 0, align: "center", valign: "middle"
    });
    // X label
    s.addText(sales[i].label, {
      x, y: barBase + 0.05, w: chartW, h: 0.45, fontSize: 9, fontFace: "Arial",
      color: "666666", margin: 0, align: "center", valign: "top"
    });
  }

  // Callout box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.15, w: 9, h: 1.2, fill: { color: "FFF5F5" }, rectRadius: 0.1 });
  s.addText("KEY INSIGHTS", { x: 0.8, y: 4.18, w: 2, h: 0.25, fontSize: 10, fontFace: "Arial", color: "E53935", bold: true, margin: 0, charSpacing: 3 });

  const insights = [
    { text: "Sales grew 58% from W1 to W6 — 1.05M → 1.67M ETB/week", icon: "↑" },
    { text: "Target of 1,788,779 ETB still unmet — W6 achieved only 93.1%", icon: "⚠" },
    { text: "W5→W6 growth slowed to 4.7% (vs W2→W3's 39%) — momentum fading", icon: "↓" },
    { text: "Daily run rate declined from 5,997 to 5,419 (-9.6%) — needs investigation", icon: "!" }
  ];

  for (let i = 0; i < 4; i++) {
    s.addText(insights[i].text, {
      x: 0.8 + (i % 2) * 4.5, y: 4.45 + Math.floor(i / 2) * 0.35,
      w: 4.2, h: 0.3, fontSize: 11, fontFace: "Arial", color: "333333", margin: 0
    });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("8", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 11, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p=require("pptxgenjs"); const pr=new p(); pr.layout='LAYOUT_16x9'; createSlide(pr,{}); pr.writeFile({fileName:"slide-08-preview.pptx"}); }
module.exports = { createSlide, slideConfig };
