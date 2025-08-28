# Repository Guidelines

## Project Structure & Module Organization
- app/: Next.js App Router (entry: `app/page.tsx`, layout: `app/layout.tsx`).
- Sections: `app/sections/*` for page sections (About/Projects/Contact).
- Components: `app/components/*` grouped by domain. Projects in `app/components/projects/*`.
- Styles: Tailwind v4 via PostCSS. Global in `app/globals.css`; component CSS in `app/styles/components/*.css`.
- Utils: `app/utils/*` (e.g., `rafThrottle`). Shared `lib/` for hooks/constants.
- Assets: `public/` for images/video; prefer `.webp`. Use `./convert-to-webp.sh`.
- Config: `.eslintrc.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev at `http://localhost:3000`.
- `npm run build`: Production build (telemetry disabled in `next.config.ts`).
- `npm start`: Serve the built app.
- `npm run lint`: ESLint (Next + TypeScript rules).

## Coding Style & Naming Conventions
- Language: TypeScript with `strict: true`; ES modules.
- Components: Prefer server components; add `"use client"` only when interactivity is required.
- Naming: PascalCase for components (`PhoneMockup.tsx`), kebab-case for CSS, barrels via `index.ts`.
- Styling: Prefer Tailwind utilities; keep component CSS in `app/styles/components` imported from globals.
- Aliases: `@components/*`, `@sections/*`, `@utils/*`, `@lib/*` (set in `tsconfig.json`).

- No test suite configured. If adding tests:
  - Unit: Vitest + React Testing Library in `app/**/__tests__` or `tests/`.
  - E2E: Playwright in `e2e/`.
  - Add scripts (`test`, `test:e2e`) and aim for >80% changed-line coverage.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (`feat:`, `fix:`, `chore:`). Use imperative mood. Example: `fix: stabilize mobile menu icon`.
- Branches: `feature/...`, `fix/...` or `codex/...` to match history.
- PRs: Clear description, rationale, and screenshots/GIFs for UI changes. Link issues. Ensure `npm run lint` and `npm run build` pass; avoid adding large unoptimized assets.

## Security & Configuration Tips
- Secrets: None required; do not commit credentials.
- Runtime: Node.js 18.18+ (or 20+). Verify with `node -v`.
- Performance: Prefer assets in `public/webp`; compress videos; lazy-load where appropriate.
