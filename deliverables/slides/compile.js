const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'ChipChip';
pres.title = 'ChipChip Strategic Review Q1 2026';

const theme = {
  primary: "1A1A1A",
  secondary: "666666",
  accent: "E53935",
  light: "F5F5F5",
  bg: "FFFFFF"
};

const slideCount = 34;

for (let i = 1; i <= slideCount; i++) {
  const num = String(i).padStart(2, '0');
  try {
    const slideModule = require(`./slide-${num}.js`);
    slideModule.createSlide(pres, theme);
    console.log(`✅ Slide ${num} added`);
  } catch (e) {
    console.error(`❌ Slide ${num} failed: ${e.message}`);
  }
}

pres.writeFile({ fileName: './output/chipchip-strategic-review-presentation.pptx' })
  .then(() => console.log('\n✅ Presentation generated successfully!'))
  .catch(err => console.error('❌ Generation failed:', err));
