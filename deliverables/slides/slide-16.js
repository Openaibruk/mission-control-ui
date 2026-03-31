const slideConfig={type:'content',index:16,title:'Margin Analysis'};
function createSlide(pres,t){
const s=pres.addSlide();
s.background={color:"FFFFFF"};
s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.12,h:5.625,fill:{color:"E53935"}});
s.addText("MARGIN ANALYSIS",{x:0.6,y:0.3,w:8,h:0.4,fontSize:12,fontFace:"Arial",color:"E53935",bold:true,charSpacing:4,margin:0});
s.addText("CP1, CP2, Gross vs Net Margin",{x:0.6,y:0.65,w:8,h:0.55,fontSize:30,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0});

// CP1 & CP2 definitions
const defs=[
{name:"CP1 — Contribution\nMargin Level 1",desc:"Revenue minus direct variable costs",current:"-16.68%",target:"+5%",status:"Critical"},
{name:"CP2 — Contribution\nMargin Level 2",desc:"CP1 minus direct fixed costs (delivery, warehouse)",current:"Negative",target:"Positive",status:"Target: Q3-Q4"},
{name:"Gross Margin",desc:"Revenue minus COGS (product cost)",current:"-16.68% Feb\n-45.49% Jan",target:"+15-20%",status:"Improving"},
{name:"Net Margin",desc:"After all SG&A (salary, marketing, overhead)",current:"Deeply Negative",target:"+10%",status:"Breakeven: Q4"}
];

for(let i=0;i<4;i++){
const x=0.6+(i%2)*4.8;
const y=1.45+Math.floor(i/2)*1.7;
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w:4.4,h:1.5,fill:{color:i<2?"FFF5F5":"F8F8F8"},rectRadius:0.12});
s.addShape(pres.shapes.RECTANGLE,{x,y,w:4.4,h:0.05,fill:{color:"E53935"}});
s.addText(defs[i].name,{x:x+0.15,y:y+0.12,w:2.5,h:0.55,fontSize:13,fontFace:"Arial",color:"E53935",bold:true,margin:0});
s.addText(defs[i].desc,{x:x+0.15,y:y+0.65,w:4,h:0.3,fontSize:11,fontFace:"Arial",color:"666666",margin:0,italic:true});

const curW=1.5;const tgtW=1.3;
s.addText("Current", {x:x+0.15,y:y+1.0,w:curW-0.1,h:0.2,fontSize:8,fontFace:"Arial",color:"888888",bold:true,margin:0});
s.addText(defs[i].current,{x:x+0.15,y:y+1.18,w:curW,h:0.28,fontSize:13,fontFace:"Arial",color:"E53935",bold:true,margin:0});
s.addText("Target",   {x:x+1.6,y:y+1.0,w:tgtW,h:0.2,fontSize:8,fontFace:"Arial",color:"888888",bold:true,margin:0});
s.addText(defs[i].target,{x:x+1.6,y:y+1.18,w:tgtW,h:0.28,fontSize:13,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0});
}

// Margin waterfall
s.addText("MARGIN WATERFALL (Per KG, February)", {x:0.6,y:4.8,w:9,h:0.3,fontSize:10,fontFace:"Arial",color:"888888",bold:true,margin:0,charSpacing:2});

const wf=[
{label:"Supplier Buy",val:"40 ETB",w:0.72,color:"999999"},
{label:"Sell Price",val:"46 ETB",w:0.83,color:"E53935"},
{label:"Total Spread",val:"6 ETB",w:0.11,color:"E53935"},
{label:"SL/Captain",val:"-3 ETB",w:0.05,color:"FF9800"},
{label:"ChipChip Net",val:"~2 ETB",w:0.04,color:"1A1A1A"}
];
let wx=0.6;
for(let i=0;i<wf.length;i++){
s.addShape(pres.shapes.RECTANGLE,{x:wx,y:5.12,w:(i===0||i===1)?0:wf[i].w===0?0:1.5,h:0.25,fill:{color:i<2?wf[i].color:wf[i].color==="1A1A1A"?"1A1A1A":"F8F8F8"}});
// simplified
if(wf[i].w!=="0"&&wf[i].w!==0){
s.addText(wf[i].label,{x:wx,y:5.12,w:1.2,h:0.25,fontSize:9,fontFace:"Arial",color:wf[i].color==="E53935"?"E53935":"555555",margin:0,valign:"middle"});
s.addText(wf[i].val,{x:wx+(wf[i].color==="E53935"?0.7:0.9),y:5.12,w:0.4,h:0.25,fontSize:9,fontFace:"Arial",color:wf[i].color==="E53935"?"E53935":"E53935",bold:true,margin:0,valign:"middle"});
}
wx+=1.7;
}

s.addShape(pres.shapes.OVAL,{x:9.3,y:5.1,w:0.4,h:0.4,fill:{color:"E53935"}});
s.addText("16",{x:9.3,y:5.1,w:0.4,h:0.4,fontSize:10,fontFace:"Arial",color:"FFFFFF",bold:true,align:"center",valign:"middle"});
return s;
}
if(require.main===module){const p=require("pptxgenjs");const pr=new p();pr.layout='LAYOUT_16x9';createSlide(pr,{});pr.writeFile({fileName:"slide-16-preview.pptx"});}
module.exports={createSlide,slideConfig};
