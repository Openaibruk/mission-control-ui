const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'ChipChip';
pres.title = 'ChipChip Credit Financial Plan Analysis — March 2026';

const RED = 'E53635';
const BLACK = '212121';
const DARKGREY = '757575';
const LIGHTGREY = 'F5F5F5';

function hdr(s, title, num) {
  s.addText(title, { x: 0.5, y: 0.2, w: 12.5, h: 0.5, fontSize: 18, color: BLACK, bold: true, fontFace: 'Arial' });
  s.addShape('rect', { x: 0.5, y: 0.75, w: 3, h: 0.06, fill: RED });
  s.addText('ChipChip • Credit Financial Plan Analysis', { x: 0.3, y: 7.2, w: 6, h: 0.3, fontSize: 8, color: '999999', fontFace: 'Arial' });
  if (num !== undefined) s.addText(String(num), { x: 10, y: 7.2, w: 0.5, h: 0.3, fontSize: 8, color: '999999', fontFace: 'Arial', align: 'right' });
}

function fmt(n) { return n>=1e6 ? (n/1e6).toFixed(1)+'M' : n>=1e3 ? (n/1e3).toFixed(0)+'K' : String(n); }
function fmtETB(n) { return n.toLocaleString() + ' ETB'; }

// ── DATA ────────────────────────────────────────────────
const M = ['Apr-26','May-26','Jun-26','Jul-26','Aug-26','Sep-26','Oct-26','Nov-26','Dec-26','Jan-27','Feb-27','Mar-27','Apr-27'];
const b2bRev=[914539,1143174,1428967,1786209,2232761,2790951,3209594,3691033,4244688,4881392,5613600,6455640,7423986];
const slRev=[400000,460000,529000,608350,699603,804543,925224,1064008,1223609,1407151,1618223,1860957,2140100];
const fmcgRev=[1291600,1291600,1937400,1937400,2583200,2583200,2583200,2583200,2583200,2583200,2583200,2583200,2583200];
const totRev=b2bRev.map((b,i)=>b+slRev[i]+fmcgRev[i]);
const revGr=['—','11.1%','34.6%','11.2%','27.3%','12.0%','8.7%','9.2%','9.7%','10.2%','10.6%','11.1%','11.4%'];
const b2bCred=[731631,914539,1143174,1428967,1786209,2232761,2567675,2952827,3395751,3905113,4490880,5164512,5939189];
const slCred=[80000,92000,105800,121670,279841,321817,370090,425603,978887,1125720,1294578,1488765,1712080];
const totCred=b2bCred.map((b,i)=>b+slCred[i]);
const credPct=['31.1%','34.8%','32.1%','35.8%','37.5%','41.3%','43.7%','46.0%','54.3%','56.7%','58.9%','61.0%','63.0%'];
const b2bTM=[228635,285793,357242,446552,558190,697738,802399,922758,1061172,1220348,1403400,1613910,1855997];
const slTM=[20000,23000,26450,30418,34980,40227,46261,53200,61180,70358,80911,93048,107005];
const fmcgTM=[64580,64580,96870,96870,129160,129160,129160,129160,129160,129160,129160,129160,129160];
const totTM=b2bTM.map((b,i)=>b+slTM[i]+fmcgTM[i]);
const b2bCM=[21949,27436,34295,42869,53586,66983,77030,88585,101873,117153,134726,154935,178176];
const slCM=[4000,4600,5290,6084,13992,16091,18504,21280,48944,56286,64729,74438,85604];
const fmcgCM=[38748,38748,58122,58122,77496,77496,77496,77496,77496,77496,77496,77496,77496];
const totCM=b2bCM.map((b,i)=>b+slCM[i]+fmcgCM[i]);
const totMargin=totTM.map((t,i)=>t+totCM[i]);
const marginPct=['14.5%','15.3%','14.8%','15.7%','15.7%','16.6%','17.1%','17.6%','18.4%','18.8%','19.3%','19.7%','20.0%'];

// ── SLIDE 1: COVER ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { fill: 'FFFFFF' };
  s.addShape('rect', { x: 0, y: 0, w: '100%', h: 2.8, fill: BLACK });
  s.addShape('rect', { x: 0, y: 2.8, w: '100%', h: 0.08, fill: RED });
  s.addText('CHIPCHIP', { x: 0.5, y: 0.4, w: 3, h: 0.5, fontSize: 22, color: RED, bold: true, fontFace: 'Arial' });
  s.addText('ምሳ ነገር እነዴት ነው? — Let\'s Eat! ☕🍽️', { x: 0.5, y: 1.0, w: 8, h: 0.6, fontSize: 15, color: 'FFCDD2', fontFace: 'Arial', italic: true });
  s.addText('CREDIT FINANCIAL PLAN ANALYSIS', { x: 0.5, y: 3.3, w: 12, h: 1.2, fontSize: 42, color: BLACK, bold: true, fontFace: 'Arial' });
  s.addText('Revenue Projections • Credit Exposure Analysis • Risk Assessment\nStrategic Recommendations for Board & Investors', { x: 0.5, y: 5.0, w: 12, h: 0.8, fontSize: 16, color: DARKGREY, fontFace: 'Arial' });
  s.addText('March 31, 2026', { x: 0.5, y: 6.2, w: 5, h: 0.5, fontSize: 14, color: DARKGREY, fontFace: 'Arial', italic: true });
  s.addShape('rect', { x: 0, y: 7.5, w: '100%', h: 0.08, fill: RED });
}

// ── SLIDE 2: TOC ────────────────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, 'TABLE OF CONTENTS', 2);
  const toc = [
    ['1', 'Executive Summary', 'Slide 3'],['1', 'Executive Summary','Slide 3'],['2', 'Revenue Projections Deep Dive','Slides 5-12'],['3', 'Credit Exposure Analysis','Slides 13-22'],['4', 'Margin Analysis','Slides 23-30'],['5', 'Risk Assessment','Slides 38-48']];
  toc.forEach(([n,t,r],i)=>{
    const y=1.1+i*0.72;
    s.addShape('rect',{x:0.5,y:y,w:0.55,h:0.55,fill:i===0?RED:BLACK,rectRadius:0.08});
    s.addText(n,{x:0.5,y:y,w:0.55,h:0.55,fontSize:12,color:'FFFFFF',bold:true,fontFace:'Arial',align:'center',valign:'middle'});
    s.addText(t,{x:1.2,y:y,w:7,h:0.55,fontSize:15,color:BLACK,fontFace:'Arial',valign:'middle'});
    s.addText(r,{x:8.5,y:y,w:4,h:0.55,fontSize:13,color:DARKGREY,fontFace:'Arial',align:'right',valign:'middle'});
  });
}

// ── SLIDE 3: EXECUTIVE SUMMARY ──────────────────────────
{
  const s = pres.addSlide();
  hdr(s, 'EXECUTIVE SUMMARY — KEY NUMBERS', 3);
  const boxes = [{l:'13-Month Period',v:'Apr 2026 - Apr 2027'},{l:'Total Revenue',v:'89.3M ETB'},{l:'Total Margin',v:'16.0M ETB (18%)'},{l:'Total Credit Extended',v:'45.0M ETB'},{l:'Peak Credit Exposure',v:'7.65M ETB/mo'}];
  boxes.forEach((b,i)=>{
    const x=0.5+i*2.15;
    s.addShape('rect',{x:x,y:1.2,w:1.95,h:1.4,fill:LIGHTGREY,rectRadius:0.12});
    s.addText(b.l,{x:x+0.1,y:1.25,w:1.75,h:0.35,fontSize:10,color:RED,bold:true,fontFace:'Arial'});
    s.addText(b.v,{x:x+0.1,y:1.6,w:1.75,h:0.6,fontSize:18,color:BLACK,bold:true,fontFace:'Arial',align:'center'});
  });
  const f=['✅ Math verified — all calculations internally consistent (1 ETB rounding)','⚠ Credit exposure nearly doubles: 31% to 63% of revenue','⚠ Total credit extended: 45.0M ETB — how is this funded?','⚠ No NPL provision — model assumes 100% collection on all credits','⚠ No operating expenses — margin figures are gross only','⚠ Super Leader credit policy jumps 4x overnight (20%→40%→80%)'];
  f.forEach((t,i)=>s.addText(t,{x:0.5,y:2.8+i*0.7,w:12.5,h:0.6,fontSize:16,color:BLACK,bold:true,fontFace:'Arial'}));
}

// ── SLIDE 4: REVENUE BREAKDOWN ──────────────────────────
{
  const s = pres.addSlide();
  hdr(s, 'REVENUE BREAKDOWN (13-Month Totals: 89.3M ETB)', 4);
  const streams = [
    {name:'B2B REVENUE',amt:'45.8M ETB',pct:51.3,color:RED,growth:'25%→15% MoM',margin:'25%+2.4%=27.4%'},
    {name:'FMCG REVENUE',amt:'29.7M ETB',pct:33.3,color:BLACK,growth:'Step-function',margin:'5%+3%=8%'},
    {name:'SUPER LEADER',amt:'13.7M ETB',pct:15.4,color:DARKGREY,growth:'15% MoM const',margin:'5%+3%=8%'}
  ];
  streams.forEach((s,i)=>{
    const y=1.8+i*1.6;
    s.addText(s.name,{x:0.5,y:y,w:3,h:0.5,fontSize:14,color:s.color,bold:true,fontFace:'Arial'});
    s.addText(s.amt+' ('+s.pct.toFixed(1)+'%)',{x:3.8,y:y,w:3,h:0.5,fontSize:16,color:BLACK,bold:true,fontFace:'Arial'});
    s.addShape('rect',{x:0.5,y:y+0.55,w:s.pct*0.12,h:0.3,fill:s.color,rectRadius:0.08});
    s.addText('Growth: '+s.growth,{x:0.5,y:y+0.9,w:6,h:0.35,fontSize:11,color:DARKGREY,fontFace:'Arial'});
    s.addText('Combined Margin: '+s.margin,{x:0.5,y:y+1.25,w:6,h:0.35,fontSize:11,color:DARKGREY,fontFace:'Arial'});
  });
}

// ── SLIDE 5: REVENUE MILESTONES ──────────────────────────
{
  const s = pres.addSlide();
  hdr(s, 'REVENUE GROWTH MILESTONES', 5);
  const ms = [['Apr-26','2.6M ETB','Starting base — B2B only 35% of total'],['Jun-26','3.9M ETB','FMCG 50% growth kicks in'],['Sep-26','6.2M ETB','Growth deceleration begins (12% vs 27%)'],['Dec-26','8.1M ETB','B2B growth slows to 15% MoM'],['Apr-27','12.1M ETB','B2B alone exceeds total at start']];
  ms.forEach(([m,v,d],i)=>{
    const y=1.5+i*1.1;
    s.addShape('ellipse',{x:0.5,y:y+0.05,w:0.3,h:0.3,fill:RED});
    if(i<ms.length-1) s.addShape('rect',{x:0.63,y:y+0.35,w:0.04,h:0.75,fill:RED});
    s.addText(m,{x:1.1,y:y,w:2.5,h:0.4,fontSize:12,color:BLACK,bold:true,fontFace:'Arial'});
    s.addText(v,{x:3.6,y:y,w:3,h:0.4,fontSize:20,color:RED,bold:true,fontFace:'Arial'});
    s.addText(d,{x:6.7,y:y,w:6,h:0.4,fontSize:13,color:DARKGREY,fontFace:'Arial'});
  });
}

// ── SLIDE 6: MONTHLY REVENUE TABLE (1-7) ────────────────
{
  const s = pres.addSlide();
  hdr(s, 'MONTHLY REVENUE PROJECTIONS (Months 1-7)', 6);
  const td = [
    ['Metric',...M.slice(0,7)].map(x=>({text:String(x),options:{bold:true,color:'FFFFFF',fill:BLACK,fontSize:9,align:'center'}})),
    ['B2B Revenue',...b2bRev.slice(0,7).map(v=>({text:fmt(v),options:{fontSize:9,color:RED,align:'center',fill:LIGHTGREY}}))],
    ['Super Leader',...slRev.slice(0,7).map(v=>({text:fmt(v),options:{fontSize:9,color:BLACK,align:'center',fill:LIGHTGREY}}))],
    ['FMCG Revenue',...fmcgRev.slice(0,7).map(v=>({text:fmt(v),options:{fontSize:9,color:BLACK,align:'center',fill:LIGHTGREY}}))],
    ['TOTAL REVENUE',...totRev.slice(0,7).map(v=>({text:fmt(v),options:{fontSize:10,color:RED,align:'center',fill:'FFE0E0',bold:true}}))],
    ['MoM Growth',...revGr.slice(0,7).map(v=>({text:String(v),options:{fontSize:9,color:DARKGREY,align:'center',fill:LIGHTGREY}}))],
  ];
  s.addTable(td,{x:0.3,y:1.1,w:12.5,h:2.3,colW:[2.5,...Array(7).fill((12.5-2)/7)],border:{pt:0.5,color:'E0E0E0'},margin:[2,2,2,2]});
  s.addText('Source: ChipChip Financial Model Spreadsheet, verified independently',{x:0.3,y:3.6,w:8,h:0.3,fontSize:9,color:DARKGREY,fontFace:'Arial',italic:true});
}

// ── SLIDE 7: MONTHLY REVENUE TABLE (8-13) ───────────────
{
  const s = pres.addSlide();
  hdr(s, 'MONTHLY REVENUE PROJECTIONS (Months 8-13)', 7);
  const td = [
    ['Metric',...M.slice(7,13)].map(x=>({text:String(x),options:{bold:true,color:'FFFFFF',fill:BLACK,fontSize:9,align:'center'}})),
    ['B2B Revenue',...b2bRev.slice(7,13).map(v=>({text:fmt(v),options:{fontSize:9,color:RED,align:'center',fill:LIGHTGREY}}))],
    ['Super Leader',...slRev.slice(7,13).map(v=>({text:fmt(v),options:{fontSize:9,color:BLACK,align:'center',fill:LIGHTGREY}}))],
    ['FMCG Revenue',...fmcgRev.slice(7,13).map(v=>({text:fmt(v),options:{fontSize:9,color:BLACK,align:'center',fill:LIGHTGREY}}))],
    ['TOTAL REVENUE',...totRev.slice(7,13).map(v=>({text:fmt(v),options:{fontSize:10,color:RED,align:'center',fill:'FFE0E0',bold:true}}))],
    ['MoM Growth',...revGr.slice(7,13).map(v=>({text:String(v),options:{fontSize:9,color:DARKGREY,align:'center',fill:LIGHTGREY}}))],
  ];
  s.addTable(td,{x:0.3,y:1.1,w:11.5,h:2.3,colW:[2.5,...Array(6).fill((12.5-2.5)/6)],border:{pt:0.5,color:'E0E0E0'},margin:[2,2,2,2]});
  s.addText('Note: Jan-27 total has 1 ETB rounding difference (8,871,743 vs 8,871,742) — negligible',{x:0.3,y:3.6,w:10,h:0.3,fontSize:9,color:DARKGREY,fontFace:'Arial',italic:true});
}

// ── SLIDE 8: REVENUE COMPOSITION VISUALIZATION ─────────
{
  const s = pres.addSlide();
  hdr(s, 'REVENUE COMPOSITION VISUALIZATION', 8);
  // Revenue breakdown visual
  const streams = [
    { name: 'B2B REV', pct: 51.3, color: RED, amount: '45.8M ETB' },
    { name: 'FMCG REV', pct: 33.3, color: BLACK, amount: '29.7M ETB' },
    { name: 'SUPER LEADER', pct: 15.4, color: DARKGREY, amount: '13.7M ETB' }
  ];
  streams.forEach((it, i) => {
    const y = 1.5 + i * 1.6;
    s.addText(it.name + ' (' + it.amount + ')', { x: 0.5, y: y, w: 3, h: 0.5, fontSize: 14, color: BLACK, bold: true, fontFace: 'Arial' });
    s.addShape('rect', { x: 3.5, y: y + 0.05, w: it.pct * 0.12, h: 0.45, fill: it.color, rectRadius: 0.06 });
    s.addText(it.pct.toFixed(1) + '%', { x: 3.5 + it.pct * 0.12 + 0.1, y: y, w: 0.8, h: 0.5, fontSize: 16, color: it.color, bold: true, fontFace: 'Arial' });
    // Growth info
    const growthInfo = it.name === 'B2B REV' ? 'Growth' : it.name === 'FMCG REV' ? 'Growth' : 'Growth';
    s.addText(it.name === 'B2B REV' ? '25%→15% MoM' : it.name === 'FMCG REV' ? 'Step-function' : '15% MoM const', { x: 7.5, y: y, w: 3, h: 0.5, fontSize: 12, color: DARKGREY, fontFace: 'Arial' });
  });
  // Key insight
  s.addShape('rect', { x: 0.5, y: 6.2, w: 12.5, h: 0.8, fill: 'E8F5E9', rectRadius: 0.1 });
  s.addText('Revenue diversification is relatively balanced. However, B2B provides 51.3% of revenue AND carries 80% credit ratio — creating a double concentration risk.', { x: 0.7, y: 6.3, w: 12, h: 0.6, fontSize: 11, color: '1B5E20', fontFace: 'Arial' });
}

// ── SLIDE 9: QUARTERLY REVENUE ──────────────────────────
{
  const s = pres.addSlide();
  hdr(s, 'QUARTERLY REVENUE SUMMARY', 9);
  const qtrs = [
    ['Q1 (Apr-Jun 2026)', 'Apr-Jun 2026', 'Q2 (Jul-Sep 2026)', 'Oct-Dec 2026', 'Q4 (Jan-Mar 2027)', 'Apr-27']
  ];
  const qRev = [9396280, 16025541, 20107684, 24586234, 12147286];
  const qColors = [RED, RED, DARKGREY, DARKGREY, RED];
  qRev.forEach((r, i) => {
    const w = r / 5000000;
    s.addShape('rect', { x: 0.5, y: 1.5 + i * 1.1, w: w, h: 0.8, fill: qColors[i], rectRadius: 0.08 });
    s.addText(qtrs[i] + ': ' + fmt(r) + ' ETB', { x: 0.5, y: 1.5 + i * 1.1, w: w, h: 0.8, fontSize: 12, color: 'FFFFFF', bold: true, fontFace: 'Arial', align: 'center', valign: 'middle' });
  });
}

// ── SLIDE 10: REVENUE VERIFICATION ──────────────────────
{
  const s = pres.addSlide();
  hdr(s, 'REVENUE VERIFICATION RESULTS', 10);
  const checks = [
    ['B2B Revenue totals', 'PASS', 'Verified: 45.8M ETB'],
    ['SL Revenue totals', 'PASS', 'Verified: 13.7M ETB'],
    ['FMCG Revenue totals', 'PASS', 'Verified: 29.7M ETB'],
    ['Total Revenue/month', 'PASS', 'All 13 months verified'],
    ['MoM Growth rates', 'PASS', 'All 12 growth rates correct'],
    ['B2B growth pattern', 'PASS', '25% MoM (M2-6), 15% MoM (M7-13)'],
    ['SL growth pattern', 'PASS', '15% MoM constant'],
    ['FMCG growth pattern', 'PASS', 'Step-function: 0%→50%→0%→33%→0%']
  ];
  checks.forEach((c, i) => {
    s.addText(c[0], { x: 0.5, y: 1.2 + i * 0.55, w: 5, h: 0.45, fontSize: 12, color: BLACK, fontFace: 'Arial' });
    s.addText(c[1], { x: 0.5, y: 1.2 + i * 0.55, w: 0.8, h: 0.45, fontSize: 12, color: '00C800', bold: true, fontFace: 'Arial', align: 'center' });
    s.addText(c[2], { x: 5.5, y: 1.2 + i * 0.55, w: 7.5, h: 0.45, fontSize: 11, color: DARKGREY, fontFace: 'Arial' });
  });
}

// ── SLIDE 11: B2B REVENUE DEEP DIVE ────────────────────
{
  const s = pres.addSlide();
  hdr(s, 'B2B REVENUE DEEP DIVE', 11);
  s.addText('B2B is the engine of this plan — 51.3% of total revenue and the largest margin contributor', { x: 0.5, y: 1.0, w: 10, h: 0.4, fontSize: 13, color: DARKGREY, fontFace: 'Arial' });
  const stats = [['Total Revenue','45.8M ETB'],['Growth Rate','25%→15% MoM'],['Trade Margin','25% constant'],['Credit Rate','80% constant'],['Credit Margin','2.4% constant'],['Combined Margin','27.4%']];
  stats.forEach(([l,v],i)=>{
    s.addText(l,{x:0.5,y:1.7+i*0.75,w:3.5,h:0.5,fontSize:14,color:BLACK,bold:true,fontFace:'Arial'});
    s.addText(v,{x:4,y:1.7+i*0.75,w:3,h:0.5,fontSize:22,color:RED,bold:true,fontFace:'Arial'});
  });
  s.addShape('rect',{x:7.2,y:1.7,w:6,h:5.2,x:0.7,fill:LIGHTGREY,rectRadius:0.12});
  s.addText('B2B revenue trajectory is strong but the model assumes a natural deceleration from 25% to 15% MoM at month 7. This is a critical assumption that should be validated with customer acquisition data and market share analysis.',{x:7.5,y:1.9,w:5.5,h:2.2,fontSize:11,color:BLACK,fontFace:'Arial'});
}

// ── SLIDE 12: B2B CREDIT ANALYSIS ──────────────────────
{
  s.addSlide();
  hdr(s,'B2B CREDIT ANALYSIS',12);
  s.addText('80% of B2B revenue is extended as credit — massive working capital requirement',{x:0.5,y:1.0,w:10,h:0.4,fontSize:14,color:DARKGREY,fontFace:'Arial'});
  const stats=[['Total B2B Credits','36.7M ETB'],['Avg Monthly Credit','2.8M ETB'],['Peak Monthly Credit','5.9M ETB (Apr-27)'],['B2B Credit Margin','2.4% constant'],['Total B2B Credit Margin','1.1M ETB (13mo)']];
  stats.forEach(([l,v],i)=>{s.addText(l,{x:0.5,y:1.7+i*0.75,w:4,h:0.5,fontSize:13,color:BLACK,bold:true,fontFace:'Arial'});s.addText(v,{x:4.5,y:1.7+i*0.75,w:4,h:0.75,w:4,h:0.5,fontSize:18,color:RED,bold:true,fontFace:'Arial'});});
  s.addShape('rect',{x:0.5,y:1.5,fill:'FFF3E0',rectRadius:0.12});
  s.addText('⚠ For every 100 ETB of B2B revenue, ChipChip must front 80 ETB in working capital. If payment cycle is 30 days, the company must have 2.8M ETB available to finance credits at any time. This grows to 5.9M ETB by Apr-27.',{x:0.7,y:5.45,w:12,h:1.8,fontSize:11,color:'E65100',fontFace:'Arial'});
}

// ── SLIDE 13: SUPER LEADER CREDIT JUMPS ────────────────
{
  const s = pres.addSlide();
  hdr(s,'SUPER LEADER CREDIT — THE 4X JUMP',13);
  s.addText('Most dramatic policy change: Super Leader credit rates quadruple during the plan',{x:0.5,y:1.0,w:10,h:0.4,fontSize:14,color:DARKGREY,fontFace:'Arial'});
  const phases=[['Phase 1: Apr-Jul 2026','20%','conservative credit policy'],['Phase 2: Aug-Nov 2026','40%','Credit doubles overnight'],['Phase 3: Dec 2026-Apr 2027','80%','Credit quadruples from start']];
  phases.forEach(([t,r,d],i)=>{
    const boxColor=['E8F5E9','FFF3E0','FFEBEE'][i];
    const txtCol=['1B5E20','E65100','B71C1C'][i];
    s.addShape('rect',{x:0.5+i*4.0,y:1.8,w:3.7,h:2.5,fill:boxColor,rectRadius:0.12});
    s.addText(t,{x:0.9,y:1.9,w:2.8,h:0.4,fontSize:13,color:txtCol,bold:true,fontFace:'Arial'});
    s.addText(r,{x:0.5+i*4.0,w:3.7,h:0.8,fontSize:44,color:txtCol,bold
