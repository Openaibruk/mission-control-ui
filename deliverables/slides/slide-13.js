const slideConfig={type:'content',index:13,title:'SGL Aggregator Growth'};
function createSlide(pres,t){
const s=pres.addSlide();
s.background={color:"FFFFFF"};
s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.12,h:5.625,fill:{color:"E53935"}});
s.addText("SGL AGGREGATOR GROWTH",{x:0.6,y:0.3,w:8,h:0.4,fontSize:12,fontFace:"Arial",color:"E53935",bold:true,charSpacing:4,margin:0});
s.addText("Smart Souk Leader Expansion — Week 1 to Week 6",{x:0.6,y:0.65,w:8,h:0.55,fontSize:28,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0});

// Growth metric
s.addShape(pres.shapes.OVAL,{x:0.6,y:1.5,w:2,h:2,fill:{color:"E53935"}});
s.addText("+389%",{x:0.6,y:1.7,w:2,h:0.8,fontSize:36,fontFace:"Arial",color:"FFFFFF",bold:true,margin:0,align:"center",valign:"middle"});
s.addText("SGL Sales Growth",{x:0.6,y:2.7,w:2,h:0.5,fontSize:12,fontFace:"Arial",color:"FFFFFF",margin:0,align:"center"});

// Weekly progression
const sgls=[
{w:"W1",val:1989,target:"",pct:5,fill:"#FFB3B3"},
{w:"W2",val:3023,target:"",pct:8,fill:"#FF9E9E"},
{w:"W3",val:3748,target:"",pct:10,fill:"#FF8A8A"},
{w:"W5",val:9756,target:"8,344",pct:26,fill:"#E53935"},
{w:"W6",val:9731,target:"20,026",pct:26,fill:"#E53935"}
];

s.addText("SGL CHANNEL SALES (ETB)", {x:3.2,y:1.5,w:5.5,h:0.3,fontSize:10,fontFace:"Arial",color:"888888",bold:true,margin:0,charSpacing:2});

for(let i=0;i<sgls.length;i++){
const y=1.85+i*0.65;
// Label
s.addText(sgls[i].w,{x:3.2,y,w:0.5,h:0.35,fontSize:12,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0,valign:"middle"});
// Bar bg
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:3.8,y:y,w:5.5,h:0.35,fill:{color:"F0F0F0"},rectRadius:0.17});
// Bar fill (proportional - max target 20026)
const barW=(sgls[i].val/20026)*5.3;
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:3.8,y,w:barW,h:0.35,fill:{color:sgls[i].fill},rectRadius:0.17});
// Value
s.addText(sgls[i].val.toLocaleString(),{x:3.8+barW+0.1,y,w:1.2,h:0.35,fontSize:12,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0,valign:"middle"});
// Target note
if(sgls[i].target){
const isMiss=sgls[i].val<parseInt(sgls[i].target.replace(/,/g,''));
s.addText(sgls[i].target+" target"+(isMiss?" ⚠":" ✅"),{x:3.8+barW+1.3,y,w:2,h:0.35,fontSize:9,fontFace:"Arial",color:isMiss?"E53935":"E53935",margin:0,valign:"middle"});
}
}

// SGL context
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:4.15,w:9,h:1.2,fill:{color:"F8F8F8"},rectRadius:0.12});
s.addText("SGL CONTEXT",{x:0.8,y:4.15,w:9,h:0.3,fontSize:10,fontFace:"Arial",color:"E53935",bold:true,margin:0,charSpacing:3});
const ctx=["260+ SGLs in database, ~35 active at any time","Each SGL aggregates 10-50 households in their neighborhood","W6 SGL sales of 9,731 ETB hit only 49% of 20,026 ETB target","Target: Scale to 70+ SGLs by Q2, 100 by Q4 — each generating ~100 orders/month"];
for(let i=0;i<4;i++){
s.addShape(pres.shapes.OVAL,{x:0.8,y:4.5+i*0.2,w:0.1,h:0.1,fill:{color:"E53935"}});
s.addText(ctx[i],{x:1.0,y:4.45+i*0.22,w:8,h:0.22,fontSize:11,fontFace:"Arial",color:"444444",margin:0});
}

s.addShape(pres.shapes.OVAL,{x:9.3,y:5.1,w:0.4,h:0.4,fill:{color:"E53935"}});
s.addText("13",{x:9.3,y:5.1,w:0.4,h:0.4,fontSize:10,fontFace:"Arial",color:"FFFFFF",bold:true,align:"center",valign:"middle"});
return s;
}
if(require.main===module){const p=require("pptxgenjs");const pr=new p();pr.layout='LAYOUT_16x9';createSlide(pr,{});pr.writeFile({fileName:"slide-13-preview.pptx"});}
module.exports={createSlide,slideConfig};
