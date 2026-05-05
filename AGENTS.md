# AGENTS.md - Max Burleigh Portfolio

Focused guidance for coding agents working in this repo.

## Prime Directive

This is a polished portfolio site. Treat visual behavior as product behavior.

- Preserve the current design unless the user explicitly asks for a visual change.
- CSS organization changes must be visual no-op refactors: same pixels, same motion, same breakpoints, same hover/focus states.
- If exact visual equivalence conflicts with reducing or "cleaning up" CSS, exact visual equivalence wins.
- Keep changes small, scoped, and reversible.

## Local Tool Rules

- Do not run `npx next dev`. The user will already be running the dev server when needed.
- Do not run `npm run build` in this project unless the user explicitly asks for a build.
- Do not run Playwright.
- Do not use Browser Use or Computer Use unless the user specifically asks.
- If Computer Use is specifically requested and you open an app/window yourself, close it when finished.
- For normal code verification, use `npm run lint` only.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS v4 with CSS-first config
- Framer Motion / Motion-style animation
- Next Fonts
- Next Image

Node should be >=18.18. Prefer Node 20+ on dev machines.

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start production build: `npm start`
- Lint: `npm run lint`
- React scan: `npm run scan`

Notes:
- Agents should not run `npm run dev` unless explicitly asked, and should never run `npx next dev`.
- Agents should not run `npm run build` unless explicitly asked.
- `npm run lint` currently uses `next lint`, which is deprecated in newer Next versions, but it is still the repo's current script.

## Current Repository Map

Pages and shell:
- `app/layout.tsx`: fonts, metadata, viewport, and iOS user-agent class on `<html>`.
- `app/page.tsx`: top-level client portfolio screen, section state, wheel navigation, scrollbar navigation, and CSS module imports for the portfolio surface.
- `app/get-started/page.tsx`: standalone intake route.

Sections:
- `app/sections/AboutSection.tsx`
- `app/sections/ServicesSection.tsx`
- `app/sections/PortfolioSection.tsx`
- `app/sections/ContactSection.tsx`

Components:
- `app/components/AuroraBackground.tsx`
- `app/components/IOSViewportOverlay.tsx`
- `app/components/Phone.tsx`
- `app/components/TechStack.tsx`
- `app/components/navigation/Navigation.tsx`
- `app/components/projects/ProjectCard.tsx`
- `app/components/projects/BasedChat.tsx`
- `app/components/projects/Colorbookorama.tsx`

Content and constants:
- `content/projects.tsx`: project entries and project assets.
- `lib/constants.ts`: email and LinkedIn constants.
- `lib/hooks.ts`: media query, entrance stagger, RAF throttle, and motion helpers.

## Styling Ownership

`app/globals.css` is intentionally small. Keep it that way.

Globals should contain only:
- `@import "tailwindcss";`
- `:root` tokens and safe-area variables
- Display-P3 color fallbacks
- `@theme inline`
- base `html`, `body`, `a`, and heading font rules
- true document-level scroll ownership for `html`, `body`, and `#site-root`
- standalone route scroll exceptions such as `.get-started-page`

Do not move component or section styling back into `globals.css`.

Current colocated CSS ownership:
- `app/page.module.css`: master card shell, section stack, scrollbar, shared hero/stage rules, global contained-scroll styling.
- `app/components/AuroraBackground.module.css`: aurora background, blobs, keyframes, iOS canvas visibility, reduced-motion background behavior.
- `app/components/navigation/Navigation.module.css`: hamburger and mobile menu styling.
- `app/sections/ServicesSection.module.css`: services cockpit, plans, selection dock, and toast styling.
- `app/sections/PortfolioSection.module.css`: portfolio cockpit, horizontal phone deck, project pills, preview shadows, and store links.
- `app/sections/ContactSection.module.css`: contact cockpit, channels, promise grid, and contact form styling.
- `app/components/Phone.module.css`: phone mockup frame and content fade-in.
- `app/components/projects/ProjectCard.module.css`: legacy project card, overlay, glass card, and project-media rules.

Important CSS Modules detail:
- Some modules intentionally contain legacy global selectors using `:global(...)`.
- The `:where(:not(.moduleScope))` marker is there to satisfy Next CSS Modules pure mode while keeping selector specificity effectively unchanged.
- Do not remove or simplify that marker unless you verify the compiled CSS remains visually identical.

## Styling Rules

- Prefer Tailwind utilities for new straightforward layout, spacing, typography, and state styling.
- Use CSS Modules for pseudo-elements, keyframes, complex gradients, masks, scrollbars, platform gates, and fragile responsive behavior.
- Keep Tailwind v4 configuration in CSS. Do not add `tailwind.config.js`.
- Keep wide-gamut fallbacks and safe-area variables intact.
- Do not casually normalize colors, shadows, borders, radii, timing curves, or breakpoints.
- Avoid broad global selectors. If a style belongs to a component or section, colocate it.

## Do-Not-Break Invariants

1. iOS performance path:
   - `layout.tsx` sets `is-ios-device` / `not-ios-device` on `<html>`.
   - `AuroraBackground` uses the canvas fallback on iOS.
   - Do not remove the iOS class logic or the canvas fallback.

2. Master-card screen model:
   - The homepage is a contained portfolio card, not a normal document scroll page on desktop.
   - Desktop section changes are state-driven and animated through the section stack.
   - Mobile and touch devices fall back to native vertical scrolling.

3. Section navigation:
   - Desktop wheel handling intentionally prevents accidental partial-section drift.
   - The custom section scrollbar is keyboard and pointer operable.
   - Preserve active-section state behavior unless the user explicitly asks to change navigation.

4. Motion:
   - Use transform/opacity/filter carefully.
   - Respect `prefers-reduced-motion`.
   - Keep pointer handlers throttled when they can fire frequently.

5. Images:
   - Use `next/image`.
   - Provide meaningful alt text.
   - Use correct `sizes`.
   - Use `priority` only for above-the-fold assets.

6. Standalone routes:
   - Routes like `/get-started` must keep normal page scrolling through the `.get-started-page` exception.

## Common Tasks

### Add or edit a project

1. Put optimized images in `public/project-images` or `public/webp`.
2. Edit `content/projects.tsx`.
3. Use existing project entry patterns for `imageUrl`, `imageAlt`, `imageBlurDataURL`, `techStack`, and `websiteUrl`.
4. If a project needs a custom visual component, add it under `app/components/projects/` and wire it from the portfolio section or project content.
5. If linking out from a legacy `ProjectCard`, use its `overlay` prop.

### Update contact details

1. Edit `lib/constants.ts`.
2. Check `ContactSection.tsx` and `/get-started` if copy or routing also needs to change.
3. Preserve `mailto:` behavior and external LinkedIn behavior.

### Change hero/about content

1. Edit `app/sections/AboutSection.tsx`.
2. Keep portrait tilt/glare GPU-friendly.
3. Preserve `rafThrottle` use for pointer-driven effects.

### Change sections or navigation

1. Update `SectionKey`, `sectionKeys`, refs, and section rendering in `app/page.tsx`.
2. Update `Navigation.tsx` menu items.
3. Update section stack/scrollbar behavior only if the new section requires it.

### Change styling

1. Identify the owning CSS Module first.
2. Keep `globals.css` reserved for true global foundations.
3. For refactors, preserve visual output exactly.
4. For intentional visual changes, keep them isolated to the affected section/component.

## Accessibility Checklist

- All interactive elements must be keyboard reachable.
- Focus states must remain visible.
- Text contrast must remain strong on gradients and glass surfaces.
- Reduced-motion users must not be blocked by animations.
- Forms must retain labels, accessible names, error messaging, and disabled states.
- Images need specific, human-readable alt text.

## Performance Guardrails

- Prefer compositor-friendly animation: transform, opacity, and carefully controlled filter.
- Avoid layout thrash in scroll/pointer handlers.
- Keep the iOS aurora path lightweight.
- Use `preload="none"`, `muted`, `playsInline`, and `poster` for videos if added.
- Avoid introducing client components unless browser APIs, state, refs, or event handlers are needed.

## Verification

For code changes, normally run:

```bash
npm run lint
```

Expected current warnings:
- `next lint` deprecation warning.
- Possible stale Browserslist data warning.
- Possible local Node `--localstorage-file` warning.

These warnings are not automatically blockers unless the command exits nonzero.

For visual work:
- Do not run Playwright.
- Use Browser Use or Computer Use only if the user specifically asks.
- If visual verification is requested, compare the same route and viewport before and after.

## Git Etiquette

- Preserve user changes. Do not reset or revert unrelated work.
- Keep commits scoped.
- If the user asks for the full publish flow, use:

```bash
git add .
git commit -m "<message>"
git push
```

- If a fresh branch has no upstream, recover with:

```bash
git push --set-upstream origin <branch>
```
