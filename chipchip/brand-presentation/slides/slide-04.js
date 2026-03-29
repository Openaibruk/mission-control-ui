function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addText("Typography & Shapes", {
    x: 0.5, y: 0.5, w: 8, h: 1,
    fontSize: 32, fontFace: "Montserrat", color: theme.primary, bold: true, border: { type: "bottom", pt: 3, color: theme.primary }
  });

  slide.addText([
    { text: "Primary Font: Montserrat\n", options: { bold: true, fontSize: 24 } },
    { text: "H1: 2.5rem (40px) Bold\n", options: { fontSize: 20, bold: true } },
    { text: "H2: 2.0rem (32px) SemiBold\n", options: { fontSize: 18, bold: true } },
    { text: "H3: 1.5rem (24px) SemiBold\n", options: { fontSize: 16, bold: true } },
    { text: "Body: 1.0rem (16px) Regular\n", options: { fontSize: 14 } }
  ], {
    x: 0.5, y: 2.0, w: 4, h: 3,
    fontSize: 16, fontFace: "Montserrat", color: theme.text, bullet: false
  });

  slide.addText([
    { text: "Shapes & Design Principles\n", options: { bold: true, fontSize: 24 } },
    { text: "• Curves over corners (8px–16px border-radius)\n", options: { fontSize: 16 } },
    { text: "• Perfect circles for avatars, icons, badges\n", options: { fontSize: 16 } },
    { text: "• Avoid sharp rectangles & harsh lines\n", options: { fontSize: 16 } },
    { text: "• Clean, simple, minimal background\n", options: { fontSize: 16 } }
  ], {
    x: 5.0, y: 2.0, w: 4.5, h: 3,
    fontSize: 16, fontFace: "Montserrat", color: theme.text, bullet: false
  });
}

module.exports = { createSlide };
