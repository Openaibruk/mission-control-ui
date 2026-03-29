function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addText("Color Palette", {
    x: 0.5, y: 0.5, w: 8, h: 1,
    fontSize: 32, fontFace: "Montserrat", color: theme.primary, bold: true, border: { type: "bottom", pt: 3, color: theme.primary }
  });

  const swatches = [
    { name: "ChipChip Red", hex: "#E53935", use: "Primary accent, CTAs, highlights" },
    { name: "White", hex: "#FFFFFF", use: "Backgrounds, cards, negative space" },
    { name: "Black", hex: "#000000", use: "Text, icons, borders" }
  ];

  swatches.forEach((swatch, index) => {
    slide.addShape(pres.ShapeType.rect, {
      x: 1.0 + (index * 3), y: 2.0, w: 2, h: 2,
      fill: { color: swatch.hex.replace("#", "") },
      line: { color: "CCCCCC", width: 1 }
    });

    slide.addText([
      { text: swatch.name + "\n", options: { bold: true, fontSize: 16 } },
      { text: swatch.hex + "\n", options: { fontSize: 14 } },
      { text: swatch.use, options: { fontSize: 12, italic: true } }
    ], {
      x: 1.0 + (index * 3), y: 4.2, w: 2, h: 1.5,
      fontSize: 14, fontFace: "Montserrat", color: theme.text, align: "center"
    });
  });
}

module.exports = { createSlide };
