# Deploy profiles

Host-specific configuration for static deployment of the `dist/` build output. See [docs/deploy.md](../docs/deploy.md) for full setup guides.

All profiles use:

| Setting | Value |
|---------|-------|
| Build command | `pnpm build` |
| Output directory | `dist` |
| Node.js | 22 |

## Files

| File | Profile | Activation |
|------|---------|------------|
| *(none)* | `static-only` | Upload `dist/` to any static host — see docs |
| [`vercel.json`](vercel.json) | Vercel | Copy to repo root or match settings in Vercel dashboard |
| [`netlify.toml`](netlify.toml) | Netlify | Copy to repo root; set `NETLIFY_USE_PNPM=true` if needed |
| [`cloudflare/wrangler.jsonc`](cloudflare/wrangler.jsonc) | Cloudflare | Pages Git settings or `wrangler deploy` after build |
| [`aws/sync.sh`](aws/sync.sh) | AWS S3 + CloudFront | `pnpm deploy:aws` after build (see AWS CI in docs) |

Set `deploy` in [`seabuckthorn.config.ts`](../seabuckthorn.config.ts) to track your chosen profile.
