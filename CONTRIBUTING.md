# Contributing to Haven

Thanks for helping out! Bug reports, fixes, and small improvements are all welcome.

## Setup

```bash
npm install
cp .env.example .env   # optional: set VITE_SITE_URL
npm run dev
```

Open http://localhost:5173. The dashboard is at `/admin`; the demo sign-in details are already filled in.

## Before you open a pull request

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

All four should pass. Then check your change in the browser at phone and desktop widths.

## Conventions

- **Nothing hardcoded.** User-facing text lives in `src/data/*`, not in components. Add new copy next to the page that uses it.
- **Design tokens.** Colors, radii, shadows, and type scale come from the tokens and utilities in `src/index.css`. Don't add raw hex colors or one-off sizes in components.
- **Data goes through `src/store/*`.** Components never touch `localStorage` or `fetch` directly. That keeps the backend swap in one place (see [docs/BACKEND.md](docs/BACKEND.md)).
- **Components.** Use the shadcn/Base UI primitives in `src/components/ui` before writing custom markup. Icons are Hugeicons with stroke 1.5.
- **Accessibility.** Label every control, keep keyboard support and visible focus rings, and respect `prefers-reduced-motion`.
- **Types.** TypeScript is strict. No `any`.
- **Demo data is fictional.** Use `@example.com` emails and `555` phone numbers. Never add real people's addresses or personal details.

## Commits and pull requests

Keep pull requests focused on one change. Describe what changed and why, and add before/after screenshots for UI changes.

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
