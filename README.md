# Seabuckthorn

Production-oriented [Astro](https://astro.build) project template with built-in i18n, design tokens, MDX content collections, and Headless UI islands.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture and phased delivery plan.

## P0 features

- **Astro 6** static site (`output: "static"`)
- **MDX** content collections with Zod schemas
- **i18n** — `en`, `fr`, `de` with hidden-default URLs (`/about` vs `/fr/about`)
- **Design tokens** — light, dark, and high-contrast themes via `data-theme`
- **Headless UI** — Dialog, Menu (nav + language picker), Switch (theme toggle)

## P1 features

- **Storybook 10** with `@storybook-astro/framework` (Astro + React renderers)
- **Theme and locale toolbars** — preview tokens and i18n chrome in Storybook
- **A11y CI** — axe tests via `@storybook/addon-a11y` + Vitest browser mode
- **Component stories** — Dialog, Menu, Switch, Callout, SiteHeader

See [docs/a11y.md](docs/a11y.md) for story conventions and override policy.

## P2 features

- **Chromatic** — visual regression testing for Storybook stories
- **Theme baselines** — `Light`, `Dark`, and `HighContrast` snapshot variants
- **Required PR check** — fails on unreviewed visual changes when `CHROMATIC_PROJECT_TOKEN` is configured

See [docs/chromatic.md](docs/chromatic.md) for setup and accepting visual diffs.

## Requirements

- Node.js 22.12+
- pnpm 10+
- Playwright Chromium (installed via `pnpm install` postinstall hook)

## Getting started

```bash
pnpm install
pnpm dev
```

- Astro: [http://localhost:4321](http://localhost:4321)
- Storybook: [http://localhost:6006](http://localhost:6006)

Run Astro or Storybook alone with `pnpm dev:astro` or `pnpm dev:storybook`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Astro + Storybook concurrently |
| `pnpm dev:astro` | Astro dev server only |
| `pnpm dev:storybook` | Storybook only |
| `pnpm storybook` | Storybook dev server |
| `pnpm build-storybook` | Static Storybook to `storybook-static/` |
| `pnpm test:storybook` | Vitest browser tests (axe + interaction) |
| `pnpm chromatic` | Upload Storybook snapshots locally (no fail on changes) |
| `pnpm chromatic:ci` | Chromatic CI upload (fails on unreviewed visual diffs) |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm check` | Sync Astro types and run TypeScript (`tsc --noEmit`) |

## Project structure

```
.storybook/               # Storybook + Vitest setup
src/
├── components/
│   ├── content/          # MDX shortcodes (Callout, …)
│   ├── pages/            # Shared page compositions
│   └── ui/
│       ├── react/        # Headless UI islands + *.stories.tsx
│       └── *.astro       # Thin island shells
├── content/blog/         # Per-locale MDX posts (en/, fr/, de/)
├── i18n/                 # ui.ts string tables + helpers
├── layouts/              # Base.astro, Article.astro
├── pages/                # Locale routes
├── storybook/            # Shared story helpers (theme variants)
└── styles/               # global.css + theme tokens
```

## Configuration

- [`seabuckthorn.config.ts`](seabuckthorn.config.ts) — feature flags and locale/theme defaults
- [`astro.config.mjs`](astro.config.mjs) — Astro integrations and i18n routing
- [`.env.example`](.env.example) — public site URL placeholder

Update `site` in `astro.config.mjs` (and `.env`) before deploying.

## Themes

Three built-in themes: `light`, `dark`, `high-contrast`. The theme picker persists to `localStorage.theme` and sets `document.documentElement.dataset.theme`. Use the Storybook theme toolbar to preview components under each palette.

## Testing

```bash
pnpm test:storybook
```

CI runs typecheck, Storybook a11y tests, site build, and Storybook build on every push/PR. When `CHROMATIC_PROJECT_TOKEN` is configured, [`.github/workflows/chromatic.yml`](.github/workflows/chromatic.yml) also runs visual regression tests.

## Manual verification checklist

- [ ] `pnpm dev` and `pnpm build` succeed
- [ ] `/`, `/fr/`, `/de/` and blog routes render
- [ ] Theme switch persists across reloads; high-contrast shows visible focus
- [ ] About dialog: focus trap, Escape closes, focus returns
- [ ] Nav and language menus work with keyboard
- [ ] `<link rel="alternate" hreflang="…">` tags present
- [ ] MDX Callout shortcode renders; draft posts are excluded
- [ ] `pnpm test:storybook` passes
- [ ] Storybook theme/locale toolbars update preview
- [ ] Chromatic Visual Tests panel visible in Storybook (when opted in)

## Next phases

| Phase | Deliverable |
|-------|-------------|
| P3 | Deploy profile files |
| P4 | Webiny integration |
| P5 | `create-seabuckthorn` CLI |
