# Brand Identity System

> Built by @Pixel — March 2026

## 🎨 Color Palette

### Primary Colors
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Deep Indigo | `#1E3A5F` | Headers, primary buttons, brand moments |
| Primary Light | Soft Indigo | `#3D5A80` | Secondary elements, hover states |

### Accent Colors
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Accent | Coral | `#EE6C4D` | CTAs, highlights, urgency elements |
| Accent Alt | Teal | `#4ECDC4` | Success states, fresh accents |

### Neutrals
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Dark | Charcoal | `#293241` | Body text, dark backgrounds |
| Mid | Slate | `#6B7280` | Secondary text, borders |
| Light | Cloud | `#F7F9FC` | Page backgrounds, cards |
| White | Pure White | `#FFFFFF` | Content backgrounds |

### Semantic
| Role | Color | Hex |
|------|-------|-----|
| Success | Green | `#10B981` |
| Warning | Amber | `#F59E0B` |
| Error | Red | `#EF4444` |

---

## 🔤 Typography

### Type Scale
| Level | Font | Weight | Size | Line Height |
|-------|------|--------|------|-------------|
| Display | Inter | 800 | 48px | 1.1 |
| H1 | Inter | 700 | 36px | 1.2 |
| H2 | Inter | 700 | 28px | 1.3 |
| H3 | Inter | 600 | 22px | 1.4 |
| Body | Inter | 400 | 16px | 1.6 |
| Body Small | Inter | 400 | 14px | 1.5 |
| Caption | Inter | 500 | 12px | 1.4 |
| Button | Inter | 600 | 14px | 1 |

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Usage Rules
- **Headings:** Use title case for H1-H2, sentence case for H3
- **Body:** Left-aligned, max 65 characters per line
- **Captions:** Uppercase tracking +0.5px for labels

---

## 📐 Visual Guidelines

### Spacing System (8px base)
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Border Radius
- Small (buttons, inputs): 6px
- Medium (cards): 12px
- Large (modals, hero sections): 16px
- Full (avatars, pills): 9999px

### Shadows
```css
/* Subtle — Cards, inputs */
box-shadow: 0 1px 3px rgba(30, 58, 95, 0.08);

/* Medium — Elevated cards, dropdowns */
box-shadow: 0 4px 12px rgba(30, 58, 95, 0.12);

/* Strong — Modals, sticky headers */
box-shadow: 0 8px 24px rgba(30, 58, 95, 0.16);
```

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 📱 Social Media Creative Templates

### Instagram Post (1080×1080)
```
┌─────────────────────────────┐
│      [Solid Color Block]    │ ← Primary (60% height)
│                             │
│        [HEADLINE]           │ ← White, Display font
│                             │
├─────────────────────────────┤
│  [Logo]   [CTA Button]      │ ← Accent background
└─────────────────────────────┘
```

### Instagram Story (1080×1920)
```
┌─────────────────────────────┐
│                             │
│    [Large Headline]         │ ← Center, white
│    [Supporting text]        │
│                             │
│    [Visual/Photo]           │
│                             │
├─────────────────────────────┤
│  [Swipe Up CTA]   [Logo]    │
└─────────────────────────────┘
```

### Facebook Ad (1200×628)
```
┌─────────────────────────────┐
│                             │
│      [Visual/Photo]         │ ← 1.91:1 ratio
│                             │
├─────────────────────────────┤
│  [Overline]                 │ ← Caption style
│  [Headline]                 │ ← H2 style
│  [Description]              │ ← Body style
│  [CTA Button]               │ ← Accent color
└─────────────────────────────┘
```

### LinkedIn Post (1200×627)
```
┌─────────────────────────────┐
│  [Visual/Photo]             │
├─────────────────────────────┤
│  [Headline]                 │ ← More formal tone
│  [Body copy - 3 lines max]  │
│                             │
│  [Read More] [See more]     │
└─────────────────────────────┘
```

### Twitter/X Card (1200×675)
```
┌─────────────────────────────┐
│                             │
│      [Visual/Photo]         │
│                             │
├─────────────────────────────┤
│  [Headline]                 │
│  [Description]              │
│  [cta link]                 │
└─────────────────────────────┘
```

---

## 🎯 Design Principles

1. **Clarity First** — Every element must serve a purpose
2. **Generous Whitespace** — Let content breathe
3. **Hierarchy is Everything** — Size, weight, color = importance
4. **Consistency = Trust** — Same patterns everywhere
5. **Convert with Purpose** — Design for action, not just aesthetics

---

## ♿ Accessibility

- Minimum contrast ratio: 4.5:1 for body, 3:1 for large text
- Never rely on color alone — use icons + labels
- Focus states on all interactive elements
- Alt text for all images

---

*System v1.0 — For questions, ping @Pixel*