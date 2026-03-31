#!/usr/bin/env node
// Batch generator: slides 24-50
const fs = require('fs');

const R='E53635',B='212121',G='757575',L='F5F5F5';

function hdrFn(n) {
  return `function hdr(s,t,n){s.addText(t,{x:0.5,y:0.15,w:12.5,h:0.5,fontSize:18,color:B,bold:true,fontFace:'Arial'});s.addShape('rect',{x:0.5,y:0.7,w:3,h:0.06,fill:R});}`;
}

function footer(n) {
  return `s.addText(String(n),{x:10.5,y:7.25,w:0.5,h:0.25,fontSize:8,color:'999999',fontFace:'Arial',align:'right'});`;
}

function mkSlide(num, title, bg2, content) {
  const body = `
exports.createSlide = function(pres, theme) {
  const s = pres.addSlide(); s.background = { fill: 'FFFFFF' };
  const R='${R}',B='${B}',G='${G}',L='${L}';
  ${hdrFn(num)}
  hdr(s,'${title}',${num});
  ${content}
  ${footer(num)}
};`;
  fs.writeFileSync(`slide-${String(num).padStart(2,'0')}.js`, body);
  console.log(`Created slide-${String(num).padStart(2,'0')}.js`);
}

function text(x, y, w, h, content, color, size, bold) {
  return `s.addText('${content}',{x:${x},y:${y},w:${w},h:${h},fontSize:${size},color:'${color}',fontFace:'Arial'${bold?',bold:true':''}});`;
}

function box(x, y, w, h, fill) {
  return `s.addShape('rect',{x:${x},y:${y},w:${w},h:${h},fill:'${fill}',rectRadius:0.08});`;
}

// ===================================================================
// SLIDE 24: RISK #4 - B2B REVENUE CONCENTRATION
// ===================================================================
mkSlide(24, 'RISK #4: B2B REVENUE CONCENTRATION (HIGH)', 'E65100', `
  s.addShape('rect',{x:0.5,y:1.0,w:0.4,h:0.4,fill:'E65100',rectRadius:0.08});
  s.addText('SEVERITY: HIGH',{x:1,y:0.95,w:4,h:0.5,fontSize:16,color:'E65100',bold:true,fontFace:'Arial'});
  s.addText('Over half of all revenue depends on a single stream with high credit risk.',{x:5.5,y:1.0,w:6.5,h:0.4,fontSize:11,color:B,fontFace:'Arial'});
  s.addShape('rect',{x:0.5,y:1.6,w:12.5,h:1.8,fill:L,rectRadius:0.1});
  s.addText('B2B represents 51.3% of total revenue and 78.3% of total margin.',{x:0.7,y:1.7,w:12,h:0.35,fontSize:12,color:B,bold:true,fontFace:'Arial'});
  s.addText('This creates a double concentration risk both in revenue volume and in credit dependency.',{x:0.7,y:2.05,w:12,h:0.3,fontSize:10,color:G,fontFace:'Arial'});
  ${box(0.7,2.5,3.5,0.7,'FFEBEE')} ${box(4.5,2.5,3.5,0.7,'FFF3E0')} ${box(8.3,2.5,3.5,0.7,'E8F5E9')}
  s.addText('B2B: 45.8M ETB (51.3%)',{x:0.8,y:2.55,w:3.3,h:0.3,fontSize:10,color:'B71C1C',bold:true,fontFace:'Arial',align:'center'});
  s.addText('80% of this is credit',{x:0.8,y:2.85,w:3.3,h:0.3,fontSize:9,color:'B71C1C',fontFace:'Arial',align:'center'});
  s.addText('FMCG: 29.7M ETB (33.3%)',{x:4.6,y:2.55,w:3.3,h:0.3,fontSize:10,color:'E65100',bold:true,fontFace:'Arial',align:'center'});
  s.addText('0% credit risk',{x:4.6,y:2.85,w:3.3,h:0.3,fontSize:9,color:'E65100',fontFace:'Arial',align:'center'});
  s.addText('SL: 13.7M ETB (15.4%)',{x:8.4,y:2.55,w:3.3,h:0.3,fontSize:10,color:'1B5E20',bold:true,fontFace:'Arial',align:'center'});
  s.addText('Credit jumps 20->80%',{x:8.4,y:2.85,w:3.3,h:0.3,fontSize:9,color:'1B5E20',fontFace:'Arial',align:'center'});
  s.addText('Key Risks from Concentration:',{x:0.5,y:3.5,w:12,h:0.25,fontSize:12,color:B,bold:true,fontFace:'Arial'});
  ${text(0.7,3.8,12,0.25,'A competitor targeting B2B with better credit terms could disrupt 51% of revenue','B71C1C',10)}
  ${text(0.7,4.05,12,0.25,'If B2B growth decelerates below 15% MoM, the entire model collapses','B71C1C',10)}
  ${text(0.7,4.3,12,0.25,'Regulatory changes to credit rules would disproportionately impact B2B channel','B71C1C',10)}
  ${text(0.7,4.55,12,0.25,'Single point of failure: B2B underperforming cascades to all other projections','B71C1C',10)}
  ${text(0.7,4.8,12,0.25,'Recommendation: diversify revenue base to no more than 40% from any single stream','1B5E20',10)}
  ${text(0.5,5.3,12.5,1.4,'The growth model also assumes natural deceleration from 25% to 15% MoM at month 7. This is reasonable but should be validated with:\n- Customer acquisition cost and channel data\n- Market share analysis and competitor activity\n- Supply chain capacity for the projected volume','757575',9)}
`);

// ===================================================================
// SLIDE 25: RISK #5 - FMCG GROWTH PATTERN
// ===================================================================
mkSlide(25, 'RISK #5: FMCG STEP-GROWTH PATTERN (MEDIUM)', 'E65100', `
  s.addShape('rect',{x:0.5,y:1.0,w:0.4,h:0.4,fill:'E65100',rectRadius:0.08});
  s.addText('SEVERITY: MEDIUM',{x:1,y:0.95,w:4,h:0.5,fontSize:16,color:'E65100',bold:true,fontFace:'Arial'});
  s.addText('FMCG revenue grows in artificial step-functions, not organic growth.',{x:5.5,y:1.0,w:6.5,h:0.4,fontSize:11,color:B,fontFace:'Arial'});
  s.addShape('rect',{x:0.5,y:1.6,w:12.5,h:1.2,fill:L,rectRadius:0.1});
  ${box(0.7,1.7,2.2,1.0,'E8F5E9')} ${box(3.1,1.7,2.2,1.0,'FFF3E0')} ${box(5.5,1.7,2.2,1.0,'E8F5E9')} ${box(7.9,1.7,2.2,1.0,'FFF3E0')} ${box(10.3,1.7,2.2,1.0,'E8F5E9')}
  s.addText('Apr-May',{x:0.7,y:1.7,w:2.2,h:0.25,fontSize:9,color:'1B5E20',bold:true,fontFace:'Arial',align:'center'});
  s.addText('1.29M/mo',{x:0.7,y:2.0,w:2.2,h:0.25,fontSize:14,color:'1B5E20',bold:true,fontFace:'Arial',align:'center'});
  s.addText('Stable',{x:0.7,y:2.3,w:2.2,h:0.25,fontSize:9,color:'1B5E20',fontFace:'Arial',align:'center'});
  s.addText('Jun',{x:3.1,y:1.7,w:2.2,h:0.25,fontSize:9,color:'E65100',bold:true,fontFace:'Arial',align:'center'});
  s.addText('1.94M',{x:3.1,y:2.0,w:2.2,h:0.25,fontSize:14,color:'E65100',bold:true,fontFace:'Arial',align:'center'});
  s.addText('+50% jump',{x:3.1,y:2.3,w:2.2,h:0.25,fontSize:9,color:'E65100',fontFace:'Arial',align:'center'});
  s.addText('Aug',{x:5.5,y:1.7,w:2.2,h:0.25,fontSize:9,color:'1B5E20',bold:true,fontFace:'Arial',align:'center'});
  s.addText('2.58M',{x:5.5,y:2.0,w:2.2,h:0.25,fontSize:14,color:'1B5E20',bold:true,fontFace:'Arial',align:'center'});
  s.addText('+33% jump',{x:5.5,y:2.3,w:2.2,h:0.25,fontSize:9,color:'1B5E20',fontFace:'Arial',align:'center'});
  s.addText('Sep-Apr',{x:7.9,y:1.7,w:2.2,h:0.25,fontSize:9,color:'1B5E20',bold:true,fontFace:'Arial',align:'center'});
  s.addText('2.58M mo',{x:7.9,y:2.0,w:2.2,h:0.25,fontSize:11,color:'1B5E20',bold:true,fontFace:'Arial',align:'center'});
  s.addText('Stable',{x:7.9,y:2.3,w:2.2,h:0.25,fontSize:9,color:'1B5E20',fontFace:'Arial',align:'center'});
  ${box(10.3,1.7,2.2,1.0,'FFF3E0')}
  s.addText('FMCG total',{x:10.3,y:1.7,w:2.2,h:0.25,fontSize:9,color:'E65100',bold:true,fontFace:'Arial',align:'center'});
  s.addText('29.7M',{x:10.3,y:2.0,w:2.2,h:0.25,fontSize:12,color:'E65100',bold:true,fontFace:'Arial',align:'center'});
  s.addText('13 months',{x:10.3,y:2.3,w:2.2,h:0.25,fontSize:9,color:'E65100',fontFace:'Arial',align:'center'});
  s.addText('What This Suggests:',{x:0.5,y:3.0,w:12,h:0.25,fontSize:12,color:B,bold:true,fontFace:'Arial'});
  ${text(0.7,3.3,12,0.25,'Step-growth suggests contract-based or batch revenue not organic customer acquisition','B',10)}
  ${text(0.7,3.55,12,0.25,'Each step likely represents a new large customer or distribution channel','B',10)}
  ${text(0.7,3.8,12,0.25,'If a contract ends at any step the revenue could collapse just as suddenly','B',10)}
  ${text(0.7,4.05,12,0.25,'The flat periods suggest no incremental growth between major milestones','B',10)}
  ${text(0.7,4.3,12,0.25,'Recommendation: identify what drives each step and create contingency plans','1B5E20',10)}
  s.addShape('rect',{x:0.5,y:4.75,w:12.5,h:1.2,fill:'E8F5E9',rectRadius:0.1});
  s.addText('FMCG carries 0% credit risk which is positive, but the growth pattern depends entirely on contract renewals and new customer pipeline. The model has no downside scenario for contract loss.',{x:0.7,y:4.8,w:12,h:1.0,fontSize:10,color:'1B5E20',fontFace:'Arial'});
`);

// ===================================================================
// SLIDE 26: RISK #6 - NO SCENARIO ANALYSIS
// ===================================================================
mkSlide(26, 'RISK #6: NO SCENARIO ANALYSIS (MEDIUM)', 'FF9800', `
  s.addShape('rect',{x:0.5,y:1.0,w:0.4,h:0.4,fill:'FF9800',rectRadius:0.08});
  s.addText('SEVERITY: MEDIUM',{x:1,y:0.95,w:4,h:0.5,fontSize:16,color:'FF9800',bold:true,fontFace:'Arial'});
  s.addText('The plan is single-track only. No upside, downside, or sensitivity scenarios.',{x:5.5,y:1.0,w:6.5,h:0.4,fontSize:11,color:B,fontFace:'Arial'});
  s.addShape('rect',{x:0.5,y:1.6,w:4,h:0.5,fill:'B71C1C',rectRadius:0.08});
  s.addText('BEAR CASE',{x:0.7,y:1.65,w:3.7,h:0.4,fontSize:12,color:'FFF',bold:true,fontFace:'Arial',align:'center'});
  s.addShape('rect',{x:4.7,y:1.6,w:4,h:0.5,fill:'E53635',rectRadius:0.08});
  s.addText('BASE CASE',{x:4.9,y:1.65,w:3.7,h:0.4,fontSize:12,color:'FFF',bold:true,fontFace:'Arial',align:'center'});
  s.addShape('rect',{x:8.9,y:1.6,w:4,h:0.5,fill:'4CAF50',rectRadius:0.08});
  s.addText('BULL CASE',{x:9.1,y:1.65,w:3.7,h:0.4,fontSize:12,color:'FFF',bold:true,fontFace:'Arial',align:'center'});
  var bc1=['Revenue: 73M ETB (-18%)','Revenue: 89.3M ETB','Revenue: 108M ETB (+21%)'];
  var bc2=['Margin: 11.2M ETB','Margin: 16.0M ETB','Margin: 19.4M ETB'];
  var bc3=['B2B growth: 15%->10%','B2B growth: 25%->15%','B2B growth: 30%->20%'];
  var bc4=['NPL: 5%','NPL: 0% (model)','NPL: 0% (model)'];
  var bc5=['Credit ratio: 55%','Credit ratio: 63%','Credit ratio: 63%'];
  var cols1=['B71C1C','E53635','4CAF50'];
  [bc1,bc2,bc3,bc4,bc5].forEach(function(row,ri){
    row.forEach(function(val,ci){
      var x=0.5+ci*4.2;
      s.addShape('rect',{x:x,y:2.25+ri*0.5,w:4,h:0.4,fill:ri===0?(ci===0?'FFEBEE':ci===1?'FFE0E0':'E8F5E9'):L,rectRadius:0.04});
      s.addText(val,{x:x+0.1,y:2.25+ri*0.5+0.05,w:3.8,h:0.35,fontSize:10,color:ci===0?'B71C1C':ci===2?'1B5E20':B,fontFace:'Arial'});
    });
  });
  s.addText('What is Missing:',{x:0.5,y:4.9,w:12,h:0.25,fontSize:12,color:B,bold:true,fontFace:'Arial'});
  ${text(0.5,5.2,12.5,0.25,'- No sensitivity analysis on growth rates, margin rates, or credit ratios','B',10)}
  ${text(0.5,5.45,12.5,0.25,'- No stress test for worst-case scenario (simultaneous NPL + growth decline)','B',10)}
  ${text(0.5,5.7,12.5,0.25,'- No break-even analysis showing minimum growth needed for profitability','B',10)}
  ${text(0.5,5.95,12.5,0.25,'- No Monte Carlo or probabilistic analysis of outcomes','B',10)}
  s.addShape('rect',{x:0.5,y:6.3,w:12.5,h:0.6,fill:'FFF3E0',rectRadius:0.08});
  s.addText('Recommendation: Build bear/base/bull cases and run sensitivity analysis on key variables before presenting to investors or board.',{x:0.7,y:6.35,w:12.1,h:0.5,fontSize:10,color:'E65100',fontFace:'Arial'});
`);

// ===================================================================
// SLIDE 27: RISK #7 - CREDIT MARGIN TOO THIN
// ===================================================================
mkSlide(27, 'RISK #7: CREDIT MARGIN IS TOO THIN (HIGH)', 'E65100', `
  s.addShape('rect',{x:0.5,y:1.0,w:0.4,h:0.4,fill:'E65100',rectRadius:0.08});
  s.addText('SEVERITY: HIGH',{x:1,y:0.95,w:4,h:0.5,fontSize:16,color:'E65100',bold:true,fontFace:'Arial'});
  s.addText('At 2.4% B2B credit margin, even small delays or defaults destroy profitability.',{x:5.5,y:1.0,w:6.5,h:0.4,fontSize:11,color:B,fontFace:'Arial'});
  ${box(0.5,1.65,4,2.0,'FFEBEE')} ${box(4.7,1.65,4,2.0,'FFF3E0')} ${box(8.9,1.65,4,2.0,'E8F5E9')}
  s.addText('B2B Credit',{x:0.7,y:1.7,w:3.7,h:0.3,fontSize:11,color:'B71C1C',bold:true,fontFace:'Arial',align:'center'});
  s.addText('2.4% margin',{x:0.7,y:2.0,w:3.7,h:0.5,fontSize:24,color:'B71C1C',bold:true,fontFace:'Arial',align:'center'});
  s.addText('Extremely thin\\nAny default > 2.4%\\n= unprofitable',{x:0.7,y:2.55,w:3.7,h:0.9,fontSize:10,color:'B71C1C',fontFace:'Arial',align:'center'});
  s.addText('FMCG Credit',{x:4.9,y:1.7,w:3.7,h:0.3,fontSize:11,color:'E65100',bold:true,fontFace:'Arial',align:'center'});
  s.addText('3.0% margin',{x:4.9,y:2.0,w:3.7,h:0.5,fontSize:24,color:'E65100',bold:true,fontFace:'Arial',align:'center'});
  s.addText('Better but still thin\\nZero credit risk helps',{x:4.9,y:2.55,w:3.7,h:0.9,fontSize:10,color:'E65100',fontFace:'Arial',align:'center'});
  s.addText('SL Credit',{x:9.1,y:1.7,w:3.7,h:0.3,fontSize:11,color:'1B5E20',bold:true,fontFace:'Arial',align:'center'});
  s.addText('1-4% margin',{x:9.1,y:2.0,w:3.7,h:0.5,fontSize:24,color:'1B5E20',bold:true,fontFace:'Arial',align:'center'});
  s.addText('Variable by policy\\nGrows with credit rate',{x:9.1,y:2.55,w:3.7,h:0.9,fontSize:10,color:'1B5E20',fontFace:'Arial',align:'center'});
  s.addText('30-Day Payment Delay Impact on B2B Credit:',{x:0.5,y:3.85,w:12,h:0.25,fontSize:12,color:B,bold:true,fontFace:'Arial'});
  ${text(0.5,4.15,6,0.25,'With 2.4% annual credit margin, a 30-day delay','B71C1C',10)}
  ${text(0.5,4.4,6,0.25,'reduces effective annual return by ~80%','B71C1C',10)}
  ${text(0.5,4.65,6,0.25,'2.4% / 12 months = only 0.2% per month!','B71C1C',10)}
  s.addText('Recommendations:',{x:0.5,y:5.0,w:12,h:0.25,fontSize:12,color:B,bold:true,fontFace:'Arial'});
  ${text(0.5,5.3,6,0.25,'- Price credit at minimum 5-8% to provide a cushion against defaults','B',10)}
  ${text(0.5,5.55,6,0.25,'- Implement strict 15-day payment terms with penalties for late payment','B',10)}
  ${text(0.5,5.8,6,0.25,'- Use early payment discounts to incentivize speed','B',10)}
  ${text(0.5,6.05,6,0.25,'- Build credit scoring to limit exposure to high-risk customers','B',10)}
  ${text(0.5,6.3,6,0.25,'- Separate credit margin from trade margin in reporting','B',10)}
`);

// ===================================================================
// SLIDE 28: RISK #8 - NO FINANCING PLAN
// ===================================================================
mkSlide(28, 'RISK #8: NO FINANCING PLAN (CRITICAL)', 'B71C1C', `
  s.addShape('rect',{x:0.5,y:1.0,w:0.4,h:0.4,fill:'B71C1C',rectRadius:0.08});
  s.addText('SEVERITY: CRITICAL',{x:1,y:0.95,w:4,h:0.5,fontSize:16,color:'B71C1C',bold:true,fontFace:'Arial'});
  s.addText('The plan shows credit growth but no plan to fund it.',{x:5.5,y:1.0,w:6.5,h:0.4,fontSize:11,color:B,fontFace:'Arial'});
  s.addShape('rect',{x:0.5,y:1.6,w:12.5,h:2.0,fill:'FFEBEE',rectRadius:0.1});
  s.addText('The Core Problem:',{x:0.7,y:1.7,w:12,h:0.25,fontSize:12,color:'B71C1C',bold:true,fontFace:'Arial'});
  ${text(0.7,2.0,12,0.25,'Peak working capital need: 7.65M ETB per month by Apr-27','B71C1C',11)}
  ${text(0.7,2.25,12,0.25,'Margin accumulation: ~1.2M ETB per month average','B71C1C',11)}
  ${text(0.7,2.5,12,0.25,'Gap: 6.45M ETB per month - MUST come from external financing','B71C1C',11)}
  ${text(0.7,2.75,12,0.25,'Revenue alone mathematically cannot keep pace with credit growth','B71C1C',11)}
  ${text(0.7,3.0,12,0.25,'Total credit extended: 45.0M ETB vs total margin: 16.0M ETB','B71C1C',11)}
  ${text(0.7,3.25,12,0.25,'Credit margin accumulation is not enough to fund credit extended','B71C1C',11)}
  s.addText('Financing Options:',{x:0.5,y:3.8,w:12,h:0.25,fontSize:12,color:B,bold:true,fontFace:'Arial'});
  ${box(0.5,4.1,3.8,1.4,'FFF3E0')} ${box(4.5,4.1,3.8,1.4,'E8F5E9')} ${box(8.5,4.1,3.8,1.4,'FFF3E0')}
  ${text(0.7,4.15,3.4,0.25,'Debt Financing','B71C1C',11,true)}
  ${text(0.7,4.4,3.4,1.0,'Bank loan at 15-22% annual interest. Cost: ~1.1-1.7M ETB/yr on 7.65M. Reduces net margin significantly.','B',9)}
  ${text(4.7,4.15,3.4,0.25,'Equity Raise','1B5E20',11,true)}
  ${text(4.7,4.4,3.4,1.0,'Raise 10-15M ETB from investors. Dilution risk but no interest cost. Best for scaling.','B',9)}
  ${text(8.7,4.15,3.4,0.25,'Revenue Reinvestment','E65100',11,true)}
  ${text(8.7,4.4,3.4,1.0,'Reinvest all margins into credit. Insufficient for 7.65M peak. Only works short-term.','B',9)}
  ${box(0.5,5.7,12.5,0.5,'E8F5E9')}
  ${text(0.7,5.75,12.1,0.4,'Recommendation: Phase credit growth to match available capital. Start at 50% of projected volume and scale only as margins and financing permit.','1B5E20',10)}
`);

// ===================================================================
// SLIDE 29: RISK SUMMARY TABLE
// ===================================================================
mkSlide(29, 'RISK SUMMARY DASHBOARD', 'B', `
  s.addText('All identified risks ranked by severity and probability',{x:0.7,y:0.95,w:10,h:0.4,fontSize:11,color:G,fontFace:'Arial'});
  var risks=[
    ['1','No NPL Provision','CRITICAL','High','-14% to -22%','Add 3-5% NPL provision'],
    ['2','Financing Gap','CRITICAL','High','-39% combined','Phase credit, raise capital'],
    ['3','SL Credit 4x Jump','CRITICAL','High','N/A unknown','Phase gradual 20-40-60-80%'],
    ['4','No OPEX Model','HIGH','High','-50% to break even','Build opex model immediately'],
    ['5','B2B Concentration','HIGH','Medium','Disruptive','Diversify revenue streams'],
    ['6','Credit Margin Thin','HIGH','High','Credit unprofitable','Increase credit pricing to 5-8%'],
    ['7','B2B Growth Rate','MEDIUM','Medium','-17%','Validate with market data'],
    ['8','No Scenario Analysis','MEDIUM','Medium','Unknown','Build bear/base/bull cases'],
    ['9','FMCG Step-Growth','MEDIUM','Low','Contract risk','Identify step triggers'],
    ['10','No Seasonality','LOW','Medium','Variable','Add seasonal adjustments'],
    ['11','Zero FMCG Credit','LOW','Low','Opportunity missed','Explore small FMCG credit tests'],
  ];
  var sevCol={'CRITICAL':'B71C1C','HIGH':'FF9800','MEDIUM':'FFC107','LOW':'4CAF50'};
  var sevBg={'CRITICAL':'FFEBEE','HIGH':'FFF3E0','MEDIUM':'FFFDE7','LOW':'E8F5E9'};
  risks.forEach(function(r,i){
    var y=1.3+i*0.5;
    s.addShape('rect',{x:0.5,y:y,w:12.5,h:0.42,fill:i%2===0?'FFFFFF':'F9F9F9',rectRadius:0.02});
    s.addText(r[0],{x:0.6,y:y+0.05,w:0.3,h:0.3,fontSize:10,color:B,bold:true,fontFace:'Arial'});
    s.addText(r[1],{x:0.9,y:y+0.05,w:3,h:0.3,fontSize:10,color:B,fontFace:'Arial'});
    s.addShape('rect',{x:4.0,y:y,w:1.2,h:0.42,fill:sevBg[r[2]],rectRadius:0.04});
    s.addText(r[2],{x:4.0,y:y+0.05,w:1.2,h:0.35,fontSize:9,color:sevCol[r[2]],bold:true,fontFace:'Arial',align:'center'});
    s.addText(r[3],{x:5.3,y:y+0.05,w:2,h:0.35,fontSize:9,color:B,fontFace:'Arial'});
    s.addText(r[4],{x:7.3,y:y+0.05,w:2,h:0.35,fontSize:9,color:G,fontFace:'Arial'});
    s.addText(r[5],{x:9.5,y:y+0.05,w:3.3,h:0.35,fontSize:9,color:'1B5E20',fontFace:'Arial'});
  });
  ${text(0.5,7.0,6,0.2,'11 total risks identified: 3 Critical, 3 High, 3 Medium, 2 Low','B71C1C',9,true)}
`);

// ===================================================================
// SLIDE 30: WHAT IS WORKING
// ===================================================================
mkSlide(30, 'WHAT IS WORKING WELL', '4CAF50', `
  s.addText('Strengths and positive aspects of the current financial plan',{x:0.7,y:0.95,w:10,h:0.4,fontSize:11,color:G,fontFace:'Arial'});
  var strengths=[
    ['Strong Revenue Trajectory','Revenue grows 366% from 2.6M to 12.1M monthly. The growth model is ambitious but mathematically sound with verified calculations.'],
    ['B2B Is a Profit Engine','25% trade margin on B2B