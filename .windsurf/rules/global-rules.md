---
trigger: always_on
---

## Portfolio Global Styles — Condensed Cheat Sheet

**Framework:** NextJS 15 + Tailwind v4

---

### File Structure

* **app/globals.css**

  * Imports Tailwind base, components, utilities
  * Imports modular CSS for Aurora, nav, tech stack, project cards, iframe, etc.
  * Declares root CSS variables (colors, fonts)
* **app/layout.tsx**

  * Loads fonts (Manrope, Space Grotesk, Geist Sans/Mono)
  * Imports global & key component CSS
  * Sets up base HTML/body

---

### Fonts

* **Body:** Manrope (`--font-manrope`)
* **Headings:** Space Grotesk (`--font-space-grotesk`)
* **Supporting:** Geist Sans/Mono (for accents, code, system text)
* **All font vars set globally and used in CSS.**

---

### Layout/Core Structure

* **html/body:** 100% height, `overflow: hidden`, background transparent (for Aurora)
* **.portfolio-container:** Main scrollable area (`min-h: 100vh`, vertical scroll, smooth)
* **.section:** Max width 1000px, centered, `min-h: 100vh`, flex column, responsive padding
* **h1/h2:** Space Grotesk, bold, large; **a:** #00ffd5, 600 weight

---

### Color Scheme

* **Dark mode:**

  * `--background: #0a0a0a`
  * `--foreground: #ededed`
  * **Accent:** #00ffd5 (cyan/teal for links, nav)

---

### Special Effects

* **Aurora BG:**

  * `.aurora-bg` — full-viewport, fixed, animated gradient
  * `.aurora-blob` — framer-motion animated, blurred, mix-blend, responsive
  * **iOS:** AuroraBlobs not rendered, fallback bg color for perf
* **Cursor Light:**

  * `framer-motion` + radial gradient, follows mouse, desktop only
  * Hidden on mobile

---

### CSS/Tailwind Org

* **TailwindCSS** utility-first, config in `tailwind.config.js`
* **Custom styles:** Modular, imported into globals.css (not all dumped in one file)

---

**Summary:**

* Modern font stack, clean structure
* Modular CSS, Aurora/Cursor effects, smooth scrolling
* Dark theme with standout accent color
* Organized for clarity & scalability
