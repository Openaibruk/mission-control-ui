const pptxgen = require('pptxgenjs');

async function compile() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';

  const theme = {
    primary: "E53935", // ChipChip Red
    secondary: "666666", // Gray
    accent: "000000", // Black
    light: "F5F5F5", // Light Gray
    bg: "FFFFFF", // White
    text: "000000" // Black text
  };

  const slides = [
    require('./slide-01.js'),
    require('./slide-02.js'),
    require('./slide-03.js'),
    require('./slide-04.js'),
    require('./slide-05.js'),
    require('./slide-06.js')
  ];

  slides.forEach(module => module.createSlide(pres, theme));

  await pres.writeFile({ fileName: './output/ChipChip-Brand-Guidelines.pptx' });
  console.log('Successfully created ChipChip-Brand-Guidelines.pptx');
}

compile().catch(console.error);
