# Seabuckthorn

Production-oriented [Astro](https://astro.build) project template with built-in i18n, design tokens, MDX content collections, and Headless UI islands.

## Create a new project

```bash
pnpm create seabuckthorn@latest my-site
cd my-site
pnpm dev
```

See [docs/scaffold.md](docs/scaffold.md) for flags, i18n routing modes, and non-interactive usage.

This repository is the **reference template** and demo site. Contributors work here directly; consumers use `create-seabuckthorn` to copy and customize a new project.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture.

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

## P3 features

- **Deploy profiles** — Vercel, Netlify, Cloudflare, AWS S3 + CloudFront configs under [`deploy/`](deploy/)
- **Static-first** — all profiles publish the same `dist/` artifact (no SSR adapters)
- **AWS CI example** — GitHub Actions OIDC deploy on `main` when secrets are configured

See [docs/deploy.md](docs/deploy.md) for per-host setup and CMS rebuild hooks.

## P4 features

- **Optional Webiny CMS** — build-time GraphQL fetch for blog posts (`cms: "webiny"`)
- **ContentSource adapter** — swap MDX collections or Webiny without changing page routes
- **Webhook docs** — rebuild static site on Webiny publish via deploy hooks

Default is `cms: "none"` (local MDX). See [docs/webiny.md](docs/webiny.md).

## P5 features

- **`create-seabuckthorn` CLI** — interactive scaffolding with locale, CMS, deploy, and theme options
- **Template snapshot** — `pnpm sync:template` copies this repo into the publishable CLI package
- **CLI smoke CI** — scaffold + production build verified on every PR

See [docs/scaffold.md](docs/scaffold.md).

When GitHub Pages is enabled for this repository, pushes to `main` deploy the reference site via [`.github/workflows/deploy-demo.yml`](.github/workflows/deploy-demo.yml) (project URL: `https://<owner>.github.io/seabuckthorn/`).

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
| `pnpm deploy:aws` | Sync `dist/` to S3 (+ optional CloudFront invalidation) |
| `pnpm deploy:cloudflare` | Build and deploy via Wrangler (requires `wrangler` devDep) |
| `pnpm preview` | Preview the production build |
| `pnpm check` | Sync Astro types and run TypeScript (`tsc --noEmit`) |

## Project structure

```
.storybook/               # Storybook + Vitest setup
deploy/                   # Host-specific deploy configs (copy to root or use via CI)
docs/                     # Architecture, a11y, Chromatic, deploy, Webiny guides
src/
├── integrations/webiny/  # Optional Webiny GraphQL client + source
├── components/
│   ├── content/          # MDX shortcodes (Callout, …)
│   ├── pages/            # Shared page compositions
│   └── ui/
│       ├── react/        # Headless UI islands + *.stories.tsx
│       └── *.astro       # Thin island shells
├── content/blog/         # Per-locale MDX posts when cms: "none"
├── i18n/                 # ui.ts string tables + helpers
├── lib/content/          # ContentSource adapter (MDX vs Webiny)
├── layouts/              # Base.astro, Article.astro
├── pages/                # Locale routes
├── storybook/            # Shared story helpers (theme variants)
└── styles/               # global.css + theme tokens
```

## Configuration

- [`seabuckthorn.config.ts`](seabuckthorn.config.ts) — feature flags, CMS mode (`none` | `webiny`), deploy profile
- [`astro.config.mjs`](astro.config.mjs) — Astro integrations and i18n routing
- [`.env.example`](.env.example) — `PUBLIC_SITE_URL` and optional deploy secrets

Set `PUBLIC_SITE_URL` in `.env` before deploying (used for sitemap and canonical links).

## Themes

Three built-in themes: `light`, `dark`, `high-contrast`. The theme picker persists to `localStorage.theme` and sets `document.documentElement.dataset.theme`. Use the Storybook theme toolbar to preview components under each palette.

## Testing

```bash
pnpm test:storybook
```

CI runs typecheck, Storybook a11y tests, site build, and Storybook build on every push/PR. When secrets are configured, [`.github/workflows/chromatic.yml`](.github/workflows/chromatic.yml) runs visual regression tests and [`.github/workflows/deploy-aws.yml`](.github/workflows/deploy-aws.yml) deploys to AWS on pushes to `main`.

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

## Contributing to the CLI

```bash
pnpm sync:template
pnpm --filter create-seabuckthorn build
pnpm --filter create-seabuckthorn test
```
