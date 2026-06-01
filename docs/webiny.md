# Webiny Headless CMS

Seabuckthorn can source blog posts from [Webiny Headless CMS](https://www.webiny.com/docs/overview/introduction) at **build time** instead of local MDX files. The default template uses `cms: "none"` and MDX content collections.

## Architecture

- Posts are fetched via GraphQL during `pnpm build` (static output unchanged).
- No CMS runtime in the browser.
- Set `cms: "webiny"` in [`seabuckthorn.config.ts`](../seabuckthorn.config.ts) to enable.
- Do **not** mix MDX blog files and Webiny for the same slug — when Webiny is enabled, the MDX `blog` collection is disabled.

See [Architecture §8.2 — Webiny](ARCHITECTURE.md#82-optional-webiny-headless-cms).

## Prerequisites

1. A Webiny cloud project ([get started](https://www.webiny.com/docs/get-started)).
2. Webiny is **not** run locally in this template — use your hosted Admin Area.

## Content model

Create a **Posts** model in Headless CMS with these fields (API IDs should match unless you edit [`queries.ts`](../src/integrations/webiny/queries.ts)):

| Field (API ID) | Type | Notes |
|----------------|------|-------|
| `title` | text | Post title |
| `slug` | text | URL slug (unique per locale) |
| `description` | text | Excerpt |
| `pubDate` | date/time | Publication date |
| `locale` | text | `en`, `fr`, or `de` |
| `draft` | boolean | Excluded from production build when `true` |
| `body` | long text (markdown) | Post body — plain markdown, not Lexical rich text in P4 |
| `cover` | text (optional) | Image URL |
| `coverAlt` | text (optional) | Cover image alt text |

GraphQL list field name defaults to `listPosts` (see `POSTS_LIST_FIELD` in [`queries.ts`](../src/integrations/webiny/queries.ts)).

### MDX shortcodes

Webiny posts render as **markdown HTML** only. MDX shortcodes such as `Callout` are available for MDX collection posts (`cms: "none"`) but not for Webiny markdown bodies.

## API credentials

1. In Webiny Admin: **Settings → Access Management → API keys**.
2. Create a key with read access to Headless CMS (and File Manager if using file fields).
3. Copy the **Headless CMS Read API URL** and **API key token**.

Add to `.env` (never commit):

```bash
WEBINY_API_URL=https://dXXXXXXX.cloudfront.net/cms/read/EN-US
WEBINY_API_TOKEN=your-token
```

Also add these to your host build environment or GitHub Actions secrets when deploying.

## Enable Webiny

1. Set `cms: "webiny"` in [`seabuckthorn.config.ts`](../seabuckthorn.config.ts).
2. Configure `WEBINY_API_URL` and `WEBINY_API_TOKEN`.
3. Remove or stop maintaining conflicting entries under `src/content/blog/` (collection is disabled when Webiny is on).
4. Run `pnpm build` — blog routes are generated from Webiny data.

If env vars are missing while `cms: "webiny"`, the build fails with an actionable error.

## Publish webhooks (rebuild on content change)

When an editor publishes in Webiny, trigger a static host rebuild:

1. Create a **deploy hook** on your host (see [deploy.md](deploy.md#cms-rebuild-hooks)).
2. In Webiny Admin: **Settings → Webhooks → Add webhook**.
3. Event: `entry.afterPublish` (or equivalent publish event for your Webiny version).
4. URL: your host deploy hook URL.
5. Optional: add a shared secret header and validate it on the host.

After publish, the host rebuilds `dist/` with fresh Webiny content.

### Per-host deploy hooks

| Host | Hook setup |
|------|------------|
| Netlify | Site settings → Build & deploy → Build hooks |
| Vercel | Project settings → Git → Deploy Hooks |
| Cloudflare Pages | Deploy hooks in Pages project settings |
| AWS | GitHub Actions `workflow_dispatch` or custom webhook → [`deploy-aws.yml`](../.github/workflows/deploy-aws.yml) |

## Code layout

```
src/integrations/webiny/   # GraphQL client, queries, WebinyBlogSource
src/lib/content/           # ContentSource adapter (MDX vs Webiny)
```

[`getBlogSource()`](../src/lib/content/index.ts) returns the active implementation based on `seabuckthorn.config.ts`.

## Rich text upgrade path

P4 uses a markdown long-text `body` field. To use Webiny Lexical rich text instead, add a renderer (e.g. `@webiny/react-rich-text-renderer` or HTML export) and update [`WebinyBlogSource`](../src/integrations/webiny/source.ts).

## Related docs

- [Deployment and CMS hooks](deploy.md)
- [Webiny + Astro tutorial](https://www.webiny.com/blog/build-blog-astro-webiny-headless-cms)
