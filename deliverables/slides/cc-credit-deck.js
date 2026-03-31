const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'ChipChip';
pres.title = 'ChipChip Credit Financial Plan Analysis';

const RED = 'E53635';
const BLACK = '212121';

function addHeader(slide, title) {
  slide.addText(title, { x: 0.5, y: 0.2, w: 12.5, h: 0.5, fontSize: 18, color: BLACK, bold: true, fontFace: 'Arial' });
  slide.addShape('rect', { x: 0.5, y: 0.75, w: 3, h: 0.06, fill: RED });
  slide.addText('ChipChip • Credit Financial Plan Analysis', { x: 0.3, y: 7.2, w: 6, h: 0.3, fontSize: 8, color: '999999', fontFace: 'Arial' });
}

function createSlide(pres, slideNum, title, contentFn) {
  const slide = pres.addSlide();
  addHeader(slide, title);
  contentFn(slide);
  slide.addText(String(slideNum), { x: 10, y: 7.2, w: 0.5, h: 0.3, fontSize: 8, color: '999999', fontFace: 'Arial', align: 'right' });
}

// DATA
const M = ['Apr-26','May-26','Jun-26','Jul-26','Aug-26','Sep-26','Oct-26','Nov-26','Dec-26','Jan-27','Feb-27','Mar-27','Ap-27'];
const b2bRev = [914539,1143174,1428967,1786209,2232761,2790951,3209594,3691033,4244688,4881392,5613600,6455640,7423986];

// SLIDE 1: COVER
{
  const s = pres.addSlide();
  s.background = { fill: 'FFFFFF' };
  s.addShape('rect', { x: 0, y: 0, w: '100%', h: 2.8, fill: BLACK });
  s.addShape('rect', { x: 0, y: 2.8, w: '100%', h: 0.08, fill: RED });
  s.addText('CHIPCHIP', { x: 0.5, y: 0.4, w: 3, h: 0.5, fontSize: 22, color: RED, bold: true, fontFace: 'Arial' });
  s.addText('ምሳ ነገር እነዴት ነው? — Let\'s Eat! ☕🍽️', { x: 0.5, y: 1.0, w: 8, h: 0.5, fontSize: 15, color: 'FFCDD2', fontFace: 'Arial', italic: true });
  s.addText('CREDIT FINANCIAL PLAN ANALYSIS', { x: 0.5, y: 3.3, w: 12, h: 1.2, fontSize: 42, color: BLACK, bold: true, fontFace: 'Arial' });
  s.addText('Revenue Projections • Credit Exposure • Risk Assessment\nStrategic Recommendations for Board & Investors', { x: 0.5, y: 5.0, w: 12, h: 0.8, fontSize: 16, color: '757575', fontFace: 'Arial' });
  s.addText('March 31, 2026', { x: 0.5, y: 6.2, w: 5, h: 0.5, fontSize: 14, color: '757575', fontFace: 'Arial', italic: true });
  s.addShape('rect', { x: 0, y: 7.5, w: '100%', h: 0.08, fill: RED });
}

// SLIDE 2: TOC
{
  const s = pres.addSlide();
  addHeader(s, 'TABLE OF CONTENTS');
  const toc = [
    ['1', 'Executive Summary', 'Slides 3-4'],
    ['2', 'Revenue Projections Deep Dive', 'Slides 5-12'],
    ['3', 'Credit Exposure Analysis', 'Slides 13-22'],
    ['4', 'Margin Analysis', 'Slides 23-30'],
    ['5', 'Risk Assessment', 'Slides 31-38'],
    ['6', 'What\'s Working / Needs Attention', 'Slides 39-42'],
    ['7', 'Pilot Test Action Plan', 'Slides 43-46'],
    ['8', 'System & App Feature Suggestions', 'Slides 47-50'],
    ['9', 'Strategic Recommendations', 'Slides 51-55'],
  ];
  toc.forEach(([num, title, range], i) => {
    const y = 1.1 + i * 0.72;
    s.addShape('rect', { x: 0.5, y, w: 0.55, h: 0.55, fill: i === 0 ? RED : BLACK, rectRadius: 0.08 });
    s.addText(num, { x: 0.5, y, w: 0.55, h: 0.55, fontSize: 12, color: 'FFFFFF', bold: true, fontFace: 'Arial', align: 'center', valign: 'middle' });
    s.addText(title, { x: 1.2, y, w: 7, h: 0.55, fontSize: 15, color: BLACK, fontFace: 'Arial', valign: 'middle' });
    s.addText(range, { x: 8.5, y, w: 4, h: 0.55, fontSize: 13, color: '757575', fontFace: 'Arial', align: 'right', valign: 'middle' });
  });
}

// SLIDE 3: EXECUTIVE SUMMARY — KEY NUMBERS
{
  const s = pres.addSlide();
  addHeader(s, 'EXECUTIVE SUMMARY — KEY NUMBERS');
  const boxes = [
    { l: '13-Month Period', v: 'Apr 2026 - Apr 2027' },
    { l: 'Total Revenue', v: '89.3M ETB' },
    { l: 'Total Margin', v: '16.0M ETB (18%)' },
    { l: 'Total Credit Extended', v: '45.0M ETB' },
    { l: 'Peak Credit Exposure', v: '7.65M ETB/month' },
  ];
  boxes.forEach((b, i) => {
    const x = 0.5 + i * 2.15;
    s.addShape('rect', { x, y: 1.2, w: 1.95, h: 1.4, fill: 'F5F5F5', rectRadius: 0.12 });
    s.addText(b.l, { x: x + 0.1, y: 1.25, w: 1.75, h: 0.35, fontSize: 10, color: RED, bold: true, fontFace: 'Arial' });
    s.addText(b.v, { x: x + 0.1, y: 1.6, w: 1.75, h: 0.6, fontSize: 18, color: BLACK, bold: true, fontFace: 'Arial', align: 'center' });
  });
  const finds = [
    '✅ Math verified — all calculations internally consistent (1 ETB rounding, negligible)',
    '⚠ Credit exposure nearly doubles: 31% to 63% of revenue over 13 months',
    '⚠ Total credit extended: 45.0M ETB — how is this funded?',
    '⚠ No NPL provision — model assumes 100% collection on all credits',
    '⚠ No operating expenses — margin figures are gross only',
    '⚠ Super Leader credit policy jumps 4x overnight (20% to 40% to 80%)',
  ];
  finds.forEach((t, i) => {
    s.addText(t, { x: 0.5, y: 2.8 + i * 0.45, w: 12.5, h: 0.4, fontSize: 12, color: BLACK, fontFace: 'Arial' });
  });
}

// SLIDE 4: REVENUE BREAKDOWN
{
  const s = pres.addSlide();
  addHeader(s, 'REVENUE BREAKDOWN (13-Month Totals: 89.3M ETB)');
  s.addText('Total Revenue: 89.3M ETB across three revenue streams', { x: 0.5, y: 1.0, w: 8, h: 0.4, fontSize: 13, color: '757575', fontFace: 'Arial' });
  [
    { name: 'B2B REVENUE', amount: '45.8M ETB (51.3%)', color: RED, wPercent: 51.3 },
    { name: 'FMCG REVENUE', amount: '29.7M ETB (33.3%)', color: BLACK, wPercent: 33.3 },
    { name: 'SUPER LEADER', amount: '13.7M ETB (15.4%)', color: '757575', wPercent: 15.4 },
  ].forEach((it, i) => {
    const y = 1.6 + i * 1.6;
    s.addShape('rect', { x: 0.5, y, w: it.wPercent * 0.12, h: 0.55, fill: it.color, rectRadius: 0.06 });
    s.addText(it.name, { x: 0.6, y: y + 0.05, w: 3, h: 0.45, fontSize: 14, color: 'FFFFFF', bold: true, fontFace: 'Arial' });
    s.addText(it.amount, { x: 7.2, y, w: 3, h: 0.55, fontSize: 14, color: BLACK, bold: true, fontFace: 'Arial', align: 'right' });
  });
  // Details below bars
  const details = [
    { stream: 'B2B (51.3%)', text: 'Growth: 25% MoM months 2-6, then 15% MoM. Trade margin: 25%, Credit rate: 80%, Combined margin: 27.4%' },
    { stream: 'FMCG (33.3%)', text: 'Growth: Step-function (0→50%→0→33%→0%). Trade margin: 5%, Credit: 0%, Combined margin: 8%' },
    { stream: 'SL (15.4%)', text: 'Growth: 15% MoM constant. Trade margin: 5%, Credit: 20%→80%, Combined margin: 6-9%' },
  ];
  details.forEach((d, i) => {
    const y = 6.8 + i * 0.3;
    s.addText(d.stream + ': ' + d.text, { x: 0.5, y, w: 12.5, h: 0.25, fontSize: 10, color: '757575', fontFace: 'Arial' });
  });
}

console.log('Created slides 1-4');

// Save
pres.writeFile({ fileName: '/home/ubuntu/.openclaw/workspace/deliverables/chipchip-credit-plan-presentation.pptx' }).then(() => {
  console.log('✅ PPTX saved!');
}).catch(e => console.error('❌', e));
