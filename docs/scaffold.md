# Scaffolding with create-seabuckthorn

Use the CLI to generate a new project from this template with your locales, CMS mode, deploy profile, and themes applied at scaffold time.

## Quick start

```bash
pnpm create seabuckthorn@latest my-site
cd my-site
pnpm dev
```

Interactive prompts ask for site name, URL, locales, CMS, deploy target, themes, and optional Chromatic token.

## Non-interactive

```bash
pnpm create seabuckthorn@latest my-site -- \
  --yes \
  --name "My Site" \
  --site https://www.example.com \
  --locales en,fr \
  --cms none \
  --deploy vercel \
  --themes light,dark,high-contrast \
  --i18n-routing hidden-default \
  --no-git
```

## Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--yes`, `-y` | Skip prompts | — |
| `--name` | Display / site name | directory name |
| `--site` | Production URL (`PUBLIC_SITE_URL`) | `https://example.com` |
| `--locales` | Comma-separated: `en`, `fr`, `de` | `en` |
| `--cms` | `none` or `webiny` | `none` |
| `--deploy` | `static-only`, `vercel`, `netlify`, `cloudflare`, `aws-s3` | `static-only` |
| `--themes` | `light`, `dark`, `high-contrast` | all three |
| `--i18n-routing` | `hidden-default` or `prefix` | `hidden-default` |
| `--chromatic-token` | Chromatic project token | — |
| `--install` / `--no-install` | Run `pnpm install` | install |
| `--git` / `--no-git` | `git init` | git |

## i18n routing modes

**hidden-default** (default): default locale at root (`/blog/`), others prefixed (`/fr/blog/`).

**prefix**: every locale under `/{locale}/` (`/en/blog/`, `/fr/blog/`).

## What the CLI changes

- Writes [`seabuckthorn.config.ts`](../seabuckthorn.config.ts) from your choices
- Patches [`astro.config.mjs`](../astro.config.mjs) (site URL, `prefixDefaultLocale`, fallbacks)
- Prunes locale pages, MDX blog folders, and `src/i18n/ui-strings.ts` entries
- Optionally removes sample MDX when `cms: webiny`
- Strips high-contrast theme CSS/strings if not selected
- Sets `package.json` name and README title

Storybook assets are always included.

## Raw template (no transforms)

To clone the repo without CLI customization:

```bash
pnpm create astro@latest my-site -- --template lewinnovation/seabuckthorn
```

Then edit `seabuckthorn.config.ts` manually.

## Monorepo development

From the Seabuckthorn repo root:

```bash
pnpm sync:template          # refresh packages/create-seabuckthorn/template/
pnpm --filter create-seabuckthorn build
node packages/create-seabuckthorn/dist/index.mjs ../my-test-site --yes --locales en
```

## Publish CLI

```bash
pnpm sync:template
cd packages/create-seabuckthorn
pnpm publish
```

The `prepublishOnly` script syncs the template and rebuilds `dist/`.
