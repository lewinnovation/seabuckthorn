# Seabuckthorn

Production-oriented [Astro](https://astro.build) project template with built-in i18n, design tokens, MDX content collections, and Headless UI islands.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture and phased delivery plan.

## P0 features

- **Astro 6** static site (`output: "static"`)
- **MDX** content collections with Zod schemas
- **i18n** — `en`, `fr`, `de` with hidden-default URLs (`/about` vs `/fr/about`)
- **Design tokens** — light, dark, and high-contrast themes via `data-theme`
- **Headless UI** — Dialog, Menu (nav + language picker), Switch (theme toggle)

## Requirements

- Node.js 22.12+
- pnpm 10+

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Astro dev server |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm check` | Run Astro type checking |

## Project structure

```
src/
├── components/
│   ├── content/          # MDX shortcodes (Callout, …)
│   ├── pages/            # Shared page compositions
│   └── ui/
│       ├── react/        # Headless UI islands
│       └── *.astro       # Thin island shells
├── content/blog/         # Per-locale MDX posts (en/, fr/, de/)
├── i18n/                 # ui.ts string tables + helpers
├── layouts/              # Base.astro, Article.astro
├── pages/                # Locale routes
└── styles/               # global.css + theme tokens
```

## Configuration

- [`seabuckthorn.config.ts`](seabuckthorn.config.ts) — feature flags and locale/theme defaults
- [`astro.config.mjs`](astro.config.mjs) — Astro integrations and i18n routing
- [`.env.example`](.env.example) — public site URL placeholder

Update `site` in `astro.config.mjs` (and `.env`) before deploying.

## Themes

Three built-in themes: `light`, `dark`, `high-contrast`. The theme picker persists to `localStorage.theme` and sets `document.documentElement.dataset.theme`.

## Manual verification checklist

- [ ] `pnpm dev` and `pnpm build` succeed
- [ ] `/`, `/fr/`, `/de/` and blog routes render
- [ ] Theme switch persists across reloads; high-contrast shows visible focus
- [ ] About dialog: focus trap, Escape closes, focus returns
- [ ] Nav and language menus work with keyboard
- [ ] `<link rel="alternate" hreflang="…">` tags present
- [ ] MDX Callout shortcode renders; draft posts are excluded

## Next phases

| Phase | Deliverable |
|-------|-------------|
| P1 | Storybook + Vitest a11y CI |
| P2 | Chromatic workflow |
| P3 | Deploy profile files |
| P4 | Webiny integration |
| P5 | `create-seabuckthorn` CLI |
