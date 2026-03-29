function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addText("Logo, Voice & Tone", {
    x: 0.5, y: 0.5, w: 8, h: 1,
    fontSize: 32, fontFace: "Montserrat", color: theme.primary, bold: true, border: { type: "bottom", pt: 3, color: theme.primary }
  });

  slide.addText([
    { text: "Logo Usage\n", options: { bold: true, fontSize: 24 } },
    { text: "• Maintain original proportions (no stretching)\n", options: { fontSize: 16 } },
    { text: "• Minimum size: 120px wide for web\n", options: { fontSize: 16 } },
    { text: "• Clear Space: height of 'C'\n", options: { fontSize: 16 } },
    { text: "• NO effects (glow, shadow, skew)\n", options: { fontSize: 16 } }
  ], {
    x: 0.5, y: 2.0, w: 4, h: 3,
    fontSize: 16, fontFace: "Montserrat", color: theme.text, bullet: false
  });

  slide.addText([
    { text: "Voice & Tone\n", options: { bold: true, fontSize: 24 } },
    { text: "• Friendly but professional\n", options: { fontSize: 16 } },
    { text: "• Clear, simple language (avoid jargon)\n", options: { fontSize: 16 } },
    { text: "• Emphasize savings and community benefits\n", options: { fontSize: 16 } },
    { text: "• Use 'you' and 'we' to create connection\n", options: { fontSize: 16 } }
  ], {
    x: 5.0, y: 2.0, w: 4.5, h: 3,
    fontSize: 16, fontFace: "Montserrat", color: theme.text, bullet: false
  });
}

module.exports = { createSlide };
