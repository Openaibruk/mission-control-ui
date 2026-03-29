function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("ChipChip Brand Guidelines", {
    x: "10%", y: "40%", w: "80%", h: 1.5,
    fontSize: 48, fontFace: "Montserrat", color: theme.primary, bold: true, align: "center"
  });

  // Subtitle
  slide.addText("Modern. Playful. Community-Driven.", {
    x: "10%", y: "55%", w: "80%", h: 1.0,
    fontSize: 24, fontFace: "Montserrat", color: theme.secondary, align: "center"
  });

  // Decoration Line
  slide.addShape(pres.ShapeType.rect, {
    x: "40%", y: "65%", w: "20%", h: 0.1, fill: { color: theme.primary }
  });
}

module.exports = { createSlide };
