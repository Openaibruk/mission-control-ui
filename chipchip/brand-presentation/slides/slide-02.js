function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Header
  slide.addText("Our Brand Personality", {
    x: 0.5, y: 0.5, w: 8, h: 1,
    fontSize: 32, fontFace: "Montserrat", color: theme.primary, bold: true, border: { type: "bottom", pt: 3, color: theme.primary }
  });

  // Core Attributes
  slide.addText([
    { text: "Core Attributes\n", options: { bold: true, fontSize: 20 } },
    { text: "• Modern\n• Playful\n• Youthful\n• Affordable\n• Community-driven" }
  ], {
    x: 1.0, y: 2.0, w: 4, h: 3,
    fontSize: 18, fontFace: "Montserrat", color: theme.text, bullet: false
  });

  // Emotional Tone
  slide.addText([
    { text: "Emotional Tone\n", options: { bold: true, fontSize: 20 } },
    { text: "• Fun social buying experience\n• Smart savings\n• Trust\n• Community energy" }
  ], {
    x: 5.5, y: 2.0, w: 4, h: 3,
    fontSize: 18, fontFace: "Montserrat", color: theme.text, bullet: false
  });

  // Analogy
  slide.addText("Analogy: Digital mall with a community heart", {
    x: 1.0, y: 4.5, w: 8, h: 0.5,
    fontSize: 18, fontFace: "Montserrat", color: theme.secondary, italic: true, align: "center", fill: { color: theme.light }
  });
}

module.exports = { createSlide };
