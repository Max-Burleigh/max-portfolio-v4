# AGENTS.md — Max Burleigh Portfolio

A focused guide for coding agents working in this repo.

**Stack**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Motion/Framer Motion + Next Fonts + Next Image  
**Primary goals**: Fast, smooth portfolio site with tasteful animation, excellent a11y and mobile perf.

---

## Quickstart (local)

- **Node**: Use **≥18.18** (Next.js 15 minimum). Prefer **Node 20+** on dev machines to match Tailwind v4 tooling.  
  _Refs: Next 15 min version; Tailwind v4 upgrade tool requires Node 20+._  
- **Install**: `npm install`
- **Dev**: `npm run dev` → open http://localhost:3000
- **Build / Start**: `npm run build` → `npm start`
- **Lint**: `npm run lint` (uses `next lint` today; consider migrating to `eslint` CLI soon)
- **React performance scan (optional, dev only)**: `npm run scan`  
  This runs Next dev and `react-scan` concurrently.

> **Environment**  
> - This app uses the App Router with a Server `layout.tsx` and client `page.tsx`.  
> - Fonts (Geist, Manrope, Space Grotesk) are managed with `next/font`.  
> - Global styles live in `app/globals.css` (Tailwind v4, CSS‑first config).

**Why these versions?**  
- Next.js 15 bumps the minimum Node to **18.18** and ships other breaking/behavioral changes. *Keep Node in range to avoid subtle build/runtime differences.* :contentReference[oaicite:0]{index=0}  
- Tailwind **v4** moves to **CSS‑first configuration** and ships faster builds. Our CSS already follows v4 (`@import "tailwindcss";` and `@theme inline`). :contentReference[oaicite:1]{index=1}

---

## Repository map (what to edit)

- **Pages / Shell**
  - `app/layout.tsx`: Fonts, `<html>` classes, metadata, intro gating script.
  - `app/page.tsx`: Top-level client page; renders sections + cursor effect.
- **Sections**
  - `app/sections/AboutSection.tsx`
  - `app/sections/PortfolioSection.tsx`
  - `app/sections/ContactSection.tsx`
- **Components**
  - `app/components/navigation/Navigation.tsx` (desktop side‑nav + mobile hamburger/menu)
  - `app/components/Phone.tsx` (phone mockup wrapper)
  - `app/components/AuroraBackground.tsx` (CSS blobs + iOS canvas fallback)
  - `app/components/IntroReveal.tsx` (first‑load “wash” gate)
  - `app/components/projects/ProjectCard.tsx`
  - `app/components/projects/BasedChat.tsx`
- **Content**
  - `content/projects.tsx` ← **Add/edit project entries here** (images live in `/public`)
- **Site constants**
  - `lib/constants.ts` (email, LinkedIn)
  - `lib/hooks.ts` (rafThrottle, media query, active section, entrance stagger, micro‑parallax)
- **Styles**
  - `app/globals.css` (Tailwind v4; CSS variables, P3 color fallbacks, animations)

---

## Do‑not‑break invariants (project‑specific)

1. **Intro gating**: The `data-intro-played` attribute + `IntroReveal` overlay gate initial paint and reduce heavy background work. Keep the attribute flow intact (`Script id="intro-wash-boot"` in `layout.tsx` sets/clears it).  
2. **iOS performance path**: `AuroraBackground` switches from CSS blur to a lightweight **canvas** on iOS. Do not remove the `is-ios-device` class logic in `layout.tsx` or the canvas fallback.  
3. **Animation budgets**: We rely on `rafThrottle` + transform‑only animations (translate/rotate/opacity) and respect `prefers-reduced-motion`. When adding effects, prefer transform/compositor‑friendly changes and throttle pointer handlers.  
4. **Navigation behavior**: `useActiveSection` uses a **45% viewport anchor** and a safe zone for section activation. Changes should keep the “feels right while scrolling” behavior.  
5. **Tailwind v4 style**: Keep configuration **in CSS** (`@import "tailwindcss";`, `@theme inline`). Don’t reintroduce `tailwind.config.js`. :contentReference[oaicite:2]{index=2}  
6. **Image hygiene**: Use `next/image` with **descriptive `alt`**, correct `sizes`, and `priority` only for above‑the‑fold assets. Note: Next 15’s image pipeline prefers `sharp` (Squoosh removed). :contentReference[oaicite:3]{index=3}

---

## Common tasks (exact steps & files)

### A) Add a new project card
1. **Images/video** → add to `/public/project-images` or `/public/webp` (prefer WebP/optimized PNG/JPEG).  
2. **Content** → create a new entry in `content/projects.tsx` (see existing entries for patterns: `imageUrl`, `imageAlt`, `imageBlurDataURL`, `techStack`).  
3. **Layout nuance** → if you need a custom preview/UI, create a component in `app/components/portfolio/` and render it **after** the mapped cards in `PortfolioSection` (see `BasedChat.tsx`).  
4. **Visit overlay** → if linking out, use the `overlay` prop `{ href, emoji?, text?, className? }` on `ProjectCard`.

### B) Update contact details
- Edit `lib/constants.ts` and re-run `npm run dev`. Ensure `mailto:` still works and LinkedIn link opens in a new tab.

### C) Tweak hero copy or portrait tilt
- Edit `app/sections/AboutSection.tsx`. Tilt/glare uses `framer-motion` and `useMotionValue`; keep transforms GPU‑friendly (`rotateX`, `rotateY`, `translateZ`) and throttle pointer events via `rafThrottle`.

### D) Navigation labels/sections
- Add/remove section keys in `app/page.tsx` (the `sectionKeys` array) and wire a new ref in `sectionRefs`. Update `Navigation.tsx` if adding a new button.

---

## Code style & patterns

- **TypeScript** everywhere; prefer **function components**.
- Mark client files with `"use client"` only when needed (components that read browser APIs, use state/effects, or rely on event handlers/refs).
- **Imports & aliases**: Follow existing `@components`, `@sections`, `@lib` usage. If you move files, keep import paths coherent.
- **Animations**: Currently using `framer-motion@^12`. Consider adopting **Motion for React** (`import { motion } from "motion/react"`) when convenient; the project should migrate smoothly per the official upgrade guide. :contentReference[oaicite:4]{index=4}
- **React 19 notes**:
  - React 19 is **stable** and adds **Actions**, `use`, `useOptimistic`, metadata in components, and `ref` as a prop (eventual `forwardRef` deprecation). Prefer idiomatic React 19 features in new code where they simplify logic. :contentReference[oaicite:5]{index=5}

---

## Styling (Tailwind v4 + custom CSS)

- Tailwind is configured **in CSS**. Tokens live in `:root` variables; project‑specific tokens live under `@theme inline` in `globals.css`. Keep wide‑gamut color fallbacks (sRGB + Display‑P3 blocks).  
- Use Tailwind utilities first; keep custom CSS for the Aurora background, overlay components, and phone mockups.  
- v4 highlights we rely on: CSS‑first config, automatic content detection, and modern color/OKLCH palette. :contentReference[oaicite:6]{index=6}
- If you need to add a new source directory for class scanning, use Tailwind’s `@source` directive in CSS (not a JS config file). :contentReference[oaicite:7]{index=7}

---

## Accessibility & UX checklist (Definition of Done)

- **Alt text**: Every `next/image` has specific, human‑meaningful `alt`.  
- **Keyboard**: All interactive elements reachable and operable by keyboard.  
- **Reduced motion**: Honor `prefers-reduced-motion`; do not block content behind non‑dismissible animations.  
- **Contrast**: Maintain contrast for text atop gradients/noise overlays.  
- **Focus**: Visible focus styles (Tailwind v4 changed some outline/ring utilities; test focus states after changes). :contentReference[oaicite:8]{index=8}

---

## Performance guardrails

- **Images**: Provide `sizes`, prefer WebP; only `priority` above the fold; avoid layout shift (width/height or constrained parent).  
- **Video**: Use `preload="none"`, `muted`, `playsInline`, `poster`.  
- **Animation**: Avoid layout thrash; prefer transform/opacity; throttle pointer handlers (`rafThrottle` in `lib/hooks.ts`).  
- **Next/Image pipeline**: Uses `sharp` by default in Next 15. Ensure `sharp` is installed in environments that build images. :contentReference[oaicite:9]{index=9}

---

## Linting, types, and tests

- **Lint**: `npm run lint` (currently `next lint`). Starting with **Next 15.5**, `next lint` is **deprecated**; migrate to `eslint` CLI soon (codemod available).  
  - Recommended future scripts:
    - `"lint": "eslint ."`
    - `"lint:fix": "eslint . --fix"`  
  _Ref: Next 15.5 blog, `next lint` deprecation._ :contentReference[oaicite:10]{index=10}
- **Typecheck**: Add `"type-check": "tsc --noEmit"` for CI safety (not present yet).
- **Unit/e2e tests**: None at present. If adding, prefer lightweight tools and keep CI fast.

---

## SEO & metadata

- `layout.tsx` defines `metadata` (title/description). Update this for major content changes.  
- React 19 supports **document metadata tags in components**; in this app we continue using Next’s metadata for page‑level SEO. Use component metadata only for local, route‑specific overrides as needed. :contentReference[oaicite:11]{index=11}

---

## Deployment

- Standard Next build: `npm run build` then `npm start`.  
- For Vercel, ensure build env uses Node ≥18.18 and that the image optimizer has `sharp` available.  
- No server actions or middleware are used; static hosting works fine.

---

## Agent etiquette (how to propose changes)

- Keep PRs small and scoped (one feature/fix per change).
- When you add a project tile, include **optimized assets** and a **before/after** note in the PR description (FPS/CLS if animation/image related).
- If you touch `globals.css` or animation hooks, run a quick manual QA on **iOS Safari** (to verify canvas fallback / perf) and on **reduced motion**.
- When the user requests a commit, stage everything with `git add .` before committing (they expect all changes included).

---

## References (for agents)

- **AGENTS.md spec & examples**: Short, actionable, and file‑scoped guidance. :contentReference[oaicite:12]{index=12}  
- **Next.js 15 (breaking & changes, Node ≥18.18, imaging)**: :contentReference[oaicite:13]{index=13}  
- **Next.js 15.5 (`next lint` deprecation, TS improvements)**: :contentReference[oaicite:14]{index=14}  
- **React 19 (stable + Actions, `use`, metadata, `ref` prop)**: :contentReference[oaicite:15]{index=15}  
- **Tailwind CSS v4 (CSS‑first config, auto content detection, upgrade guide)**: :contentReference[oaicite:16]{index=16}  
- **Motion/Framer Motion upgrade** (future‑proofing imports): :contentReference[oaicite:17]{index=17}
