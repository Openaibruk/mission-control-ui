function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  slide.addText("Let's build the future of Ethiopian ecommerce together.", {
    x: "10%", y: "40%", w: "80%", h: 1.5,
    fontSize: 32, fontFace: "Montserrat", color: "FFFFFF", bold: true, align: "center"
  });

  slide.addText("ChipChip Brand Guidelines 2025", {
    x: "10%", y: "60%", w: "80%", h: 1.0,
    fontSize: 20, fontFace: "Montserrat", color: theme.light, align: "center"
  });
}

module.exports = { createSlide };
