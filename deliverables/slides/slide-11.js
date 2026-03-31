const slideConfig={type:'content',index:11,title:'Warehouse Impact'};
function createSlide(pres,t){
const s=pres.addSlide();
s.background={color:"FFFFFF"};
s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.12,h:5.625,fill:{color:"E53935"}});
s.addText("WAREHOUSE IMPACT",{x:0.6,y:0.3,w:8,h:0.4,fontSize:12,fontFace:"Arial",color:"E53935",bold:true,charSpacing:4,margin:0});
s.addText("The 92% Reduction Story",{x:0.6,y:0.65,w:8,h:0.55,fontSize:30,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0});

// Big stat
s.addShape(pres.shapes.OVAL,{x:0.8,y:1.5,w:1.5,h:1.5,fill:{color:"E53935",transparency:10}});
s.addText("92%",{x:0.8,y:1.6,w:1.5,h:1,fontSize:48,fontFace:"Arial",color:"E53935",bold:true,margin:0,align:"center",valign:"middle"});
s.addText("Reduction in\nWarehouse Damage",{x:0.5,y:2.5,w:2.1,h:0.6,fontSize:12,fontFace:"Arial",color:"555555",margin:0,align:"center"});

// Damage trend
s.addText("WEEKLY WAREHOUSE DAMAGE (ETB)",{x:3.2,y:1.5,w:5,h:0.3,fontSize:10,fontFace:"Arial",color:"E53935",bold:true,margin:0,charSpacing:2});

const d=[{w:"W1",v:83142},{w:"W2",v:34153},{w:"W3",v:19124},{w:"W5",v:30775},{w:"W6",v:10341}];
const maxD=83142;
const chartStartX=3.5;
for(let i=0;i<d.length;i++){
const x=chartStartX+i*1.25;
const bh=(d[i].v/maxD)*2;
s.addShape(pres.shapes.RECTANGLE,{x,y:3.35-bh,w:0.9,h:bh,fill:{color:i===d.length-1?"E53935":"FF8A8A"},rectRadius:0.05});
s.addText(d[i].v.toLocaleString(),{x,y:3.4-bh-0.22,w:0.9,h:0.2,fontSize:10,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0,align:"center"});
s.addText(d[i].w,{x,y:3.4,w:0.9,h:0.2,fontSize:9,fontFace:"Arial",color:"888888",margin:0,align:"center"});
}

// Key metrics cards
const cards=[
{label:"W1 Damage",val:"83,142 ETB",color:"999999"},
{label:"W6 Damage",val:"10,341 ETB",color:"E53935"},
{label:"Weekly Savings",val:"~72,800 ETB",color:"E53935"},
{label:"Arrival Damage",val:"0.67% ↓",color:"E53935"}
];
for(let i=0;i<cards.length;i++){
const x=0.6+i*2.35;
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:4.0,w:2.1, h:0.8,fill:{color:"F8F8F8"},rectRadius:0.1});
s.addText(cards[i].label,{x,y:4.05,w:2.1,h:0.25,fontSize:9,fontFace:"Arial",color:"888888",margin:0,align:"center"});
s.addText(cards[i].val,{x,y:4.3,w:2.1,h:0.4,fontSize:16,fontFace:"Arial",color:cards[i].color,bold:true,margin:0,align:"center",valign:"middle"});
}

// Footer insight
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:4.9,w:9,h:0.45,fill:{color:"F0FFF4"},rectRadius:0.08});
s.addText("✅ Direct-ship model (Supplier → DC/Customer) validates the asset-light strategy. Warehouse bypassed dramatically.",{x:0.6,y:4.9,w:9,h:0.45,fontSize:11,fontFace:"Arial",color:"E53935",margin:0,align:"center",valign:"middle"});

s.addShape(pres.shapes.OVAL,{x:9.3,y:5.1,w:0.4,h:0.4,fill:{color:"E53935"}});
s.addText("11",{x:9.3,y:5.1,w:0.4,h:0.4,fontSize:10,fontFace:"Arial",color:"FFFFFF",bold:true,align:"center",valign:"middle"});
return s;
}
if(require.main===module){const p=require("pptxgenjs");const pr=new p();pr.layout='LAYOUT_16x9';createSlide(pr,{});pr.writeFile({fileName:"slide-11-preview.pptx"});}
module.exports={createSlide,slideConfig};
