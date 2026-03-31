const slideConfig={type:'content',index:12,title:'Channel Breakdown'};
function createSlide(pres,t){
const s=pres.addSlide();
s.background={color:"FFFFFF"};
s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.12,h:5.625,fill:{color:"E53935"}});
s.addText("CHANNEL BREAKDOWN",{x:0.6,y:0.3,w:8,h:0.4,fontSize:12,fontFace:"Arial",color:"E53935",bold:true,charSpacing:4,margin:0});
s.addText("B2B vs SGL vs D2C — February 2026",{x:0.6,y:0.65,w:8,h:0.55,fontSize:30,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0});

// Three channel cards
const channels=[
{name:"Direct B2C",orders:"86%",volume:"71%",revenue:"72%",desc:"High volume, low margin individual orders",color:"FFB3B3",trend:"Down"},
{name:"Super Groups (SGL)",orders:"14%",volume:"16%",revenue:"12%",desc:"Aggregated neighborhood demand via leaders",color:"E53935",trend:"Up 389%"},
{name:"B2B (HORECA)",orders:"<1%",volume:"11%",revenue:"16%",desc:"Restaurant & hotel supply contracts",color:"C62828",trend:"Recovering"}
];
for(let i=0;i<3;i++){
const x=0.6+i*3.1;
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:1.4,w:2.85,h:2.5,fill:{color:channels[i].name==="Super Groups (SGL)"?"FFF5F5":"F8F8F8"},rectRadius:0.12});
if(i===1)s.addShape(pres.shapes.RECTANGLE,{x,y:1.4,w:2.85,h:0.06,fill:{color:"E53935"}});
s.addText(channels[i].name,{x:x+0.15,y:1.5,w:2.55,h:0.4,fontSize:16,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0,align:"center"});
s.addText("Orders", {x,y:2.1,w:0.9,h:0.8,fontSize:10,fontFace:"Arial",color:"888888",margin:0,align:"center"});
s.addText(channels[i].orders,{x,y:2.2,w:0.9,h:0.5,fontSize:22,fontFace:"Arial",color:channels[i].color==="E53935"||channels[i].color==="C62828"?"E53935":"333333",bold:true,margin:0,align:"center",valign:"middle"});
s.addText("Volume",{x:x+0.95,y:2.1,w:0.95,h:0.8,fontSize:10,fontFace:"Arial",color:"888888",margin:0,align:"center"});
s.addText(channels[i].volume,{x:x+0.95,y:2.2,w:0.95,h:0.5,fontSize:22,fontFace:"Arial",color:"333333",bold:true,margin:0,align:"center",valign:"middle"});
s.addText("Revenue",{x:x+1.9,y:2.1,w:0.8,h:0.8,fontSize:10,fontFace:"Arial",color:"888888",margin:0,align:"center"});
s.addText(channels[i].revenue,{x:x+1.9,y:2.2,w:0.8,h:0.5,fontSize:22,fontFace:"Arial",color:channels[i].color==="C62828"?"E53935":"333333",bold:true,margin:0,align:"center",valign:"middle"});
s.addText(channels[i].desc,{x:x+0.15,y:3.0,w:2.55,h:0.5,fontSize:11,fontFace:"Arial",color:"555555",margin:0,align:"center",italic:true});
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x+0.9,y:3.55,w:1,h:0.3,fill:{color:channels[i].color==="E53935"?"E53935":channels[i].color==="C62828"?"E53935":"FF8A8A"},rectRadius:0.15});
s.addText(channels[i].trend,{x:x+0.9,y:3.55,w:1,h:0.3,fontSize:11,fontFace:"Arial",color:"FFFFFF",bold:true,margin:0,align:"center",valign:"middle"});
}

// Asymmetry insight
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:4.15,w:9,h:1.2,fill:{color:"FFF5F5"},rectRadius:0.12});
s.addText("THE MARGIN STORY IN ONE NUMBER", {x:0.6,y:4.15,w:9,h:0.3,fontSize:10,fontFace:"Arial",color:"E53935",bold:true,margin:0,align:"center",charSpacing:3});
s.addText("A single B2B order (~100kg, ~5,000 ETB) equals ~60 individual B2C orders.",{x:0.6,y:4.5,w:9,h:0.35,fontSize:16,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0,align:"center"});
s.addText("B2B generates 16% of revenue from <1% of orders. This is the path to profitability.",{x:0.6,y:4.85,w:9,h:0.3,fontSize:12,fontFace:"Arial",color:"E53935",margin:0,align:"center"});

s.addShape(pres.shapes.OVAL,{x:9.3,y:5.1,w:0.4,h:0.4,fill:{color:"E53935"}});
s.addText("12",{x:9.3,y:5.1,w:0.4,h:0.4,fontSize:10,fontFace:"Arial",color:"FFFFFF",bold:true,align:"center",valign:"middle"});
return s;
}
if(require.main===module){const p=require("pptxgenjs");const pr=new p();pr.layout='LAYOUT_16x9';createSlide(pr,{});pr.writeFile({fileName:"slide-12-preview.pptx"});}
module.exports={createSlide,slideConfig};
