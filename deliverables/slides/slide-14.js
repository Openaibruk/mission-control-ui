const slideConfig={type:'content',index:14,title:'B2B Migration Status'};
function createSlide(pres,t){
const s=pres.addSlide();
s.background={color:"FFFFFF"};
s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.12,h:5.625,fill:{color:"E53935"}});
s.addText("B2B MIGRATION STATUS",{x:0.6,y:0.3,w:8,h:0.4,fontSize:12,fontFace:"Arial",color:"E53935",bold:true,charSpacing:4,margin:0});
s.addText("HORECA Transition Progress",{x:0.6,y:0.65,w:8,h:0.55,fontSize:30,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0});

// B2B collapse & recovery
s.addText("B2B WEEKLY SALES RECOVERY",{x:0.6,y:1.45,w:5,h:0.3,fontSize:10,fontFace:"Arial",color:"E53935",bold:true,margin:0,charSpacing:2});

const b2b=[
{w:"W1",v:5755,label:"Pre-migration"},
{w:"W2",v:0,label:"⚠ Collapsed"},
{w:"W3",v:1590,label:"Early recovery"},
{w:"W5",v:2877,label:"Target met ✅"},
{w:"W6",v:2396,label:"Below target"}
];
const maxB=5755;
for(let i=0;i<b2b.length;i++){
const x=0.6+i*1.85;
const bh=b2b[i].v===0?0.08:(b2b[i].v/maxB)*1.8;
if(b2b[i].v>0)s.addShape(pres.shapes.RECTANGLE,{x,y:3.15-bh,w:1.4,h:bh,fill:{color:b2b[i].v===0?"999999":b2b[i].label.includes("✅")?"E53935":"E53935"},rectRadius:0.05});
s.addText(b2b[i].v>0?b2b[i].v.toLocaleString():"ZERO",{x,y:3.2-bh-0.22,w:1.4,h:0.2,fontSize:10,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0,align:"center"});
s.addText(b2b[i].w,{x,y:3.2,w:1.4,h:0.2,fontSize:9,fontFace:"Arial",color:"888888",margin:0,align:"center"});
s.addText(b2b[i].label,{x,y:3.45,w:1.4,h:0.25,fontSize:8,fontFace:"Arial",color:"666666",margin:0,align:"center",italic:true});
}

// Status cards
const statuses=[
{title:"Current",val:"~20 restaurants",sub:"Active partners",color:"1A1A1A"},
{title:"W6 Target",val:"2,861 ETB",sub:"Achieved 83.8%",color:"D32F2F"},
{title:"Q2 Target",val:"40 restaurants",sub:"Double current",color:"E53935"},
{title:"Avg B2B Order",val:"~5,000 ETB",sub:"vs 88 ETB B2C",color:"C62828"}
];
for(let i=0;i<4;i++){
const x=0.6+i*2.3;
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:4.0,w:2.1,h:1.3,fill:{color:"F8F8F8"},rectRadius:0.1});
s.addText(statuses[i].title,{x,y:4.05,w:2.1,h:0.25,fontSize:10,fontFace:"Arial",color:"888888",bold:true,margin:0,align:"center"});
s.addText(statuses[i].val,{x,y:4.3,w:2.1,h:0.4,fontSize:20,fontFace:"Arial",color:statuses[i].color,bold:true,margin:0,align:"center",valign:"middle"});
s.addText(statuses[i].sub,{x,y:4.75,w:2.1,h:0.25,fontSize:10,fontFace:"Arial",color:"666666",margin:0,align:"center"});
}

s.addShape(pres.shapes.OVAL,{x:9.3,y:5.1,w:0.4,h:0.4,fill:{color:"E53935"}});
s.addText("14",{x:9.3,y:5.1,w:0.4,h:0.4,fontSize:10,fontFace:"Arial",color:"FFFFFF",bold:true,align:"center",valign:"middle"});
return s;
}
if(require.main===module){const p=require("pptxgenjs");const pr=new p();pr.layout='LAYOUT_16x9';createSlide(pr,{});pr.writeFile({fileName:"slide-14-preview.pptx"});}
module.exports={createSlide,slideConfig};
