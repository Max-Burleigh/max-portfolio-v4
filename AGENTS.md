# AGENTS.md

A lean Next.js 15 portfolio. Keep behavior identical while reducing files and friction.

## Quick facts

* Framework: Next.js 15 (App Router). Node 18.18+ or 20+.
* Styling: Tailwind CSS v4 (single global CSS).
* Language: TypeScript, strict where present.
* No external dependencies should be added without a strong reason.

## Run commands

* Dev: `npm run dev`
* Build: `npm run build`
* Lint: `npm run lint`
* Start: `npm start`

## Code style and repo norms

* No emojis in code comments.
* Avoid em dashes across code and docs.
* Prefer a single good home for each concept over many tiny files.
* Keep imports explicit. Avoid deep barrel trees unless they add real value.
* Keep UI and behavior identical when refactoring.

## Directory map (post‑refactor)

```
app/
layout.tsx
page.tsx
globals.css
components/
AuroraBackground.tsx
Navigation.tsx
Phone.tsx
TechStack.tsx
Icons.tsx
projects/
ProjectCard.tsx
BasedChat.tsx
sections/
AboutSection.tsx
ProjectsSection.tsx
ContactSection.tsx
content/
projects.tsx
lib/
hooks.ts
constants.ts
public/
... assets (images, video)
```

## Component notes

* **AuroraBackground** renders both blob animations and an iOS canvas fallback. CSS classes on `<html>` decide visibility. Do not break `.is-ios-device` and `.not-ios-device`.
* **Phone** unifies the phone mockup and content. Supports `variant`, optional click handlers, and either image or preview content.
* **ProjectCard** includes an optional overlay:

  ```ts
  overlay?: { href: string; emoji?: string; text?: string; className?: string }
  ```

- **TechStack** is a simple presentational component.
- **Icons** exports `ModernWindowsIcon` and any future local icons.

## Hooks

All hooks and the `rafThrottle` helper live in `lib/hooks.ts`:

* `useActiveSection`
* `useCursorFollower`
* `useIsMobile`
* `rafThrottle`

## Build expectations

* `npm run lint` must pass.
* `npm run build` must complete with zero type errors.
* Visual output should match current production behavior.

## Agent guidance

* Before broad changes, make a plan, then apply atomic commits.
* Keep Tailwind v4 directives in `globals.css`. Avoid introducing new CSS files unless strictly necessary.
* When you move files, update all import paths and run a type check.
* Do not modify analytics, fonts, or metadata unless explicitly asked.

## Security and approvals

* Do not exfiltrate secrets. There are no runtime secrets in this repo.
* Work only inside the repository. Ask before touching global config.

## PR and commit guidance

* Conventional commits preferred: `refactor: ...`, `fix: ...`, `feat: ...`.
* Include a short summary of what moved and why.
* Screenshots or GIFs only when visual changes occur.

## Local QA checklist

* Navigation highlights the active section while scrolling.
* Cursor follower animates on desktop.
* Based Chat card video plays and tech icons render.
* Project overlays link out correctly.
* iOS-specific canvas background still shows on Safari iOS.
