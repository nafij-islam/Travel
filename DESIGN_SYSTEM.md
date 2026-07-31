# Jatrio — Visual Design System & Brand Guidelines

This document details the visual style, color tokens, typography, component rules, and responsive design patterns for **Jatrio**.

---

## 1. Brand Identity & Color Palette

```css
:root {
  /* Travel-Inspired Color Tokens */
  --color-purple: #5C55E1;       /* Indigo Purple - Primary Brand & CTAs */
  --color-sky: #7BBBFF;          /* Sky Blue - Secondary Actions, Active Tabs, Icons */
  --color-cyan: #BCF5FF;         /* Light Cyan - Highlight Panels & Soft Backgrounds */
  --color-green: #9ED454;        /* Fresh Green - Success States, Verified Badges & Achievements */
  --color-sand: #C9A37C;         /* Warm Sand - Cost Cards, Premium Badges & Accents */
  
  /* Surfaces & Text */
  --color-bg-light: #F8FAFC;
  --color-surface-white: #FFFFFF;
  --color-navy-dark: #1F1B4E;
  --color-text-main: #1E293B;
  --color-text-muted: #64748B;
}
```

---

## 2. Typography & Micro-Animations

- **Fonts:** Inter & Noto Sans Bengali
- **Card Motion:** Hover lift (`translate-y-1`), image scale (`scale-105`), soft shadow.
- **Button Feedback:** Soft scale down (`active:scale-95`), gradient shift.
