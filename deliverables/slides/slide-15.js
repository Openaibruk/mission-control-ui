const slideConfig={type:'content',index:15,title:'Product-Level Insights'};
function createSlide(pres,t){
const s=pres.addSlide();
s.background={color:"FFFFFF"};
s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.12,h:5.625,fill:{color:"E53935"}});
s.addText("PRODUCT-LEVEL INSIGHTS",{x:0.6,y:0.3,w:8,h:0.4,fontSize:12,fontFace:"Arial",color:"E53935",bold:true,charSpacing:4,margin:0});
s.addText("Warehouse Loss by Product — Week 5 (Mar 2-8)",{x:0.6,y:0.65,w:8,h:0.55,fontSize:28,fontFace:"Arial",color:"1A1A1A",bold:true,margin:0});

// Total loss banner
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:1.45,w:2.8,h:1.1,fill:{color:"FFF5F5"},rectRadius:0.1});
s.addText("TOTAL LOSS",{x:0.6,y:1.45,w:2.8,h:0.25,fontSize:10,fontFace:"Arial",color:"888888",bold:true,margin:0,align:"center"});
s.addText("45,757 ETB",{x:0.6,y:1.7,w:2.8,h:0.5,fontSize:28,fontFace:"Arial",color:"E53935",bold:true,margin:0,align:"center",valign:"middle"});
s.addText("923.9 kg total",{x:0.6,y:2.2,w:2.8,h:0.25,fontSize:10,fontFace:"Arial",color:"888888",margin:0,align:"center"});

// Product breakdown table
const products=[
{name:"Carrot (big+small)",kg:"338.2",loss:"20,861",pct:"45.5%",color:"D32F2F"},
{name:"Tomato (A + B)",kg:"225.5",loss:"7,573",pct:"16.6%",color:"E53935"},
{name:"Avocado (ripe + reg)",kg:"60.8",loss:"6,162",pct:"13.5%",color:"FF6B6B"},
{name:"Red Onion (C + reg)",kg:"150.0",loss:"3,450",pct:"7.6%",color:"FF8A8A"},
{name:"Papaya",kg:"25.3",loss:"2,210",pct:"4.8%",color:"FFB3B3"},
{name:"White Cabbage",kg:"77.0",loss:"1,386",pct:"3.0%",color:"FFCDD2"},
{name:"Other 9 items",kg:"56.2",loss:"3,175",pct:"7.0%",color:"EF9A9A"}
];

s.addShape(pres.shapes.RECTANGLE,{x:3.7,y:1.45,w:5.9,h:0.35,fill:{color:"F0F0F0"}});
s.addText("PRODUCT",{x:3.7,y:1.45,w:2.2,h:0.35,fontSize:9,fontFace:"Arial",color:"666666",bold:true,margin:0,align:"center",valign:"middle"});
s.addText("KG DAMAGED",{x:5.9,y:1.45,w:1.2,h:0.35,fontSize:9,fontFace:"Arial",color:"666666",bold:true,margin:0,align:"center",valign:"middle"});
s.addText("LOSS (ETB)",{x:7.1,y:1.45,w:1.2,h:0.35,fontSize:9,fontFace:"Arial",color:"666666",bold:true,margin:0,align:"center",valign:"middle"});
s.addText("% OF TOTAL",{x:8.3,y:1.45,w:1.2,h:0.35,fontSize:9,fontFace:"Arial",color:"666666",bold:true,margin:0,align:"center",valign:"middle"});

for(let i=0;i<products.length;i++){
const y=1.83+i*0.4;
const isBg=i%2===0;
if(isBg)s.addShape(pres.shapes.RECTANGLE,{x:3.7,y,w:5.9,h:0.38,fill:{color:"FAFAFA"}});
s.addText(products[i].name,{x:3.7,y,w:2.2,h:0.38,fontSize:11,fontFace:"Arial",color:"1A1A1A",bold:i<2,margin:0,valign:"middle"});
s.addText(products[i].kg,{x:5.9,y,w:1.2,h:0.38,fontSize:11,fontFace:"Arial",color:"333333",margin:0,align:"center",valign:"middle"});
s.addText(products[i].loss,{x:7.1,y,w:1.2,h:0.38,fontSize:11,fontFace:"Arial",color:"333333",margin:0,align:"center",valign:"middle"});
s.addText(products[i].pct,{x:8.3,y,w:1.2,h:0.38,fontSize:11,fontFace:"Arial",color:products[i].color,margin:0,align:"center",valign:"middle"});
}

// Key insight box
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:4.7,w:9,h:0.65,fill:{color:"FFF5F5"},rectRadius:0.1});
s.addText("⚠ Carrots cause 45.5% of all warehouse losses. Top 3 categories (carrots, tomatoes, avocados) = 75% of losses. Priority: review carrot sourcing immediately.",{x:0.6,y:4.7,w:9,h:0.65,fontSize:12,fontFace:"Arial",color:"333333",margin:0,valign:"middle"});

s.addShape(pres.shapes.OVAL,{x:9.3,y:5.1,w:0.4,h:0.4,fill:{color:"E53935"}});
s.addText("15",{x:9.3,y:5.1,w:0.4,h:0.4,fontSize:10,fontFace:"Arial",color:"FFFFFF",bold:true,align:"center",valign:"middle"});
return s;
}
if(require.main===module){const p=require("pptxgenjs");const pr=new p();pr.layout='LAYOUT_16x9';createSlide(pr,{});pr.writeFile({fileName:"slide-15-preview.pptx"});}
module.exports={createSlide,slideConfig};
