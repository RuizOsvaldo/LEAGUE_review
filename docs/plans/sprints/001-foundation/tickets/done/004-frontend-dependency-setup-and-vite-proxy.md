---
id: '004'
title: Frontend dependency setup and Vite proxy
status: done
use-cases:
- SUC-001
- SUC-002
- SUC-003
depends-on: []
---

# Frontend dependency setup and Vite proxy

## Description

Install all frontend dependencies required for LEAGUE Report and configure
the Vite dev server proxy so `/api` requests reach the Express backend.
Also initialise shadcn/ui and Tailwind CSS.

## Acceptance Criteria

- [ ] `wouter` installed in `client/package.json`
- [ ] `@tanstack/react-query` installed
- [ ] `react-hook-form`, `@hookform/resolvers`, `zod` installed
- [ ] Tailwind CSS configured (`tailwind.config.ts`, `postcss.config.js`); global styles in `client/src/index.css`
- [ ] shadcn/ui initialised (`components.json` present; at least `Button` and `Input` components added)
- [ ] `client/vite.config.ts` proxies `/api` to `http://localhost:3000`
- [ ] `client/src/main.tsx` wraps the app in `<QueryClientProvider>`
- [ ] `npm run dev` (client) starts without errors

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: none — this is a dependency/config ticket; verify manually that Tailwind classes render and `/api/health` is reachable from the browser
- **Verification command**: `npm run dev` + open browser

## Implementation Notes

- Use `@tailwindcss/vite` plugin (Tailwind v4) rather than the PostCSS plugin if available
- shadcn/ui init: `npx shadcn@latest init` — choose default style, slate base colour, CSS variables
- The Vite proxy target should read from `VITE_API_URL` env var with a fallback of `http://localhost:3000`
