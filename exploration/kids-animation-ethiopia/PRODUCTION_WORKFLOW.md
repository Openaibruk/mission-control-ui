# Production Workflow: AI-Powered Kids Animation (Ethiopian Context)

## Pre-production

### 1. Script Generation
- **Tool:** ChatGPT (OpenRouter) or Claude
- **Prompt template:**
  ```
  Write a 60-second YouTube Short script for ages 3–6 about [topic, e.g., washing hands].
  Include:
  - Opening hook (song snippet)
  - Simple dialogue (2–3 lines max)
  - Repetitive chorus for learning
  - Tie to Ethiopian context (e.g., using “tsebel” water)
  Output in English; note Amharic keywords to include.
  ```
- **Output:** 150–200 words, with timecodes.

### 2. Amharic Localization
- Translate key phrases (Google Translate + human review for cultural nuance).
- Create Amharic subtitles (SRT file) using Aegisub.

### 3. Voiceover
- **TTS:** Google Cloud Text-to-Speech (Wavenet, language code `am-ET`) or Play.ht Amharic voices.
- **Process:** Generate line-by-line, batch in Audacity, apply gentle compression, export as WAV.

### 4. Character Design
- **Style:** 3D models in Blender with simple rigs (spine, limbs, face bones for expressions).
- **Reuse:** One rig per character; change clothing/textures for variations.
- **AI assist:** Use Midjourney/DALL·E 3 for concept art, then model in Blender.

---

## Animation

### 5. Rigging & Reusable Assets
- Armatures with FK/IK switching.
- Shape keys for mouth phonemes (A, E, I, O, U, M, B, etc.).
- Backgrounds: modular tiles (school, home, market) — reuse across episodes.

### 6. Animation
- **AI lip sync:** Rhubarb Lip Sync (CLI) takes audio + mouth shapes → generate mouth curves.
- **Motion cycles:** walk/run/hop animations saved as NLA strips, reused.
- **Blender Grease Pencil** for 2D overlay effects (sparkles, text).

### 7. Rendering
- Eevee engine (real-time), resolution 1080x1920 (vertical).
- Render timelapse: ~1 min per 15 seconds of animation.

---

## Post-production

### 8. Editing
- **Tool:** CapCut (desktop) or OpenShot.
- Timeline: 60s Shorts → place voice, animation, music, captions.
- **Captions:** Use CapCut auto-captions; correct for Amharic glyphs.
- **Color grade:** bright/cheerful LUT.

### 9. Audio & Music
- **Music:** Soundraw.io (AI-generated loops, copyright-free) or AIVA.
- **SFX:** Freesound.org (royalty-free) for “boing”, “whoosh”.

### 10. Export & Upload
- Format: MP4 H.264, 1080x1920, 30fps.
- YouTube title: `[Phonics] አሃዛዎች | Learn Amharic Alphabet | Tibeb Kids`
- Description template includes links to playlist, social (if any), and safety notice (“Made for Kids”).

---

## Automation Opportunities

### Batch Processing with Python Scripts
- Convert SRT to CapCut caption JSON.
- Render multiple shots concurrently using Blender’s background mode.
- Auto-upload via YouTube API (OAuth2 with service account?) — not recommended for kids content without manual review.

### Crontab for Consistency
- Schedule script generation (Monday), voiceover (Tuesday), animation (Wed–Thu), edit (Fri), upload (Sat).

---

## Cost Estimate (Monthly)
- Blender: free
- AI scripting: ~$5 (OpenRouter credits)
- TTS: ~$10 (Google Cloud, ~1M chars/month)
- Music: $10 (Soundraw)
- Storage (Google Drive): $2
- **Total: ~$30–50/month** to produce 3 Shorts + 1 long-form.

---

## First 2-Week Sprint Tasks
1. Write 5 x script drafts (3 phonics, 2 numbers).
2. Record Amharic TTS for first script.
3. Build simple character rig in Blender.
4. Animate first 15s Short using AI lip sync.
5. Edit, add music, upload privately; gather feedback.
