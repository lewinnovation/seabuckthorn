# Deployment

Seabuckthorn ships as a **static-first** site. Every deploy profile publishes the same artifact: the `dist/` directory produced by `pnpm build`. No SSR adapters are installed by default.

## Profile picker

Set `deploy` in [`seabuckthorn.config.ts`](../seabuckthorn.config.ts) to document your target host:

| `deploy` value | Config files | Host |
|----------------|--------------|------|
| `static-only` | *(none)* | Any static host |
| `vercel` | [`deploy/vercel.json`](../deploy/vercel.json) | [Vercel](https://vercel.com) |
| `netlify` | [`deploy/netlify.toml`](../deploy/netlify.toml) | [Netlify](https://netlify.com) |
| `cloudflare` | [`deploy/cloudflare/wrangler.jsonc`](../deploy/cloudflare/wrangler.jsonc) | [Cloudflare Pages](https://pages.cloudflare.com) |
| `aws-s3` | [`deploy/aws/sync.sh`](../deploy/aws/sync.sh) | AWS S3 + CloudFront |

See [`deploy/README.md`](../deploy/README.md) for a quick file index.

## Before you deploy

1. Set `PUBLIC_SITE_URL` in `.env` (or as a host environment variable). [`astro.config.mjs`](../astro.config.mjs) reads this for sitemap and canonical URLs.
2. Run `pnpm build` locally and verify `dist/` contains your locale routes.

### i18n and trailing slashes

This template uses hidden-default locale routing (`/` for English, `/fr/`, `/de/`) with `trailingSlash: "always"`. Static hosts serve pre-rendered HTML files — no special rewrites are required for locale paths.

Astro may log build warnings about `/fr` vs `/fr/` route conflicts; these do not block deployment.

## static-only

```bash
pnpm build
# Upload dist/ to your host (S3, GitHub Pages, nginx, etc.)
```

## Vercel

1. Copy [`deploy/vercel.json`](../deploy/vercel.json) to the repo root, **or** set equivalent values in the Vercel dashboard:
   - Build command: `pnpm build`
   - Output directory: `dist`
   - Framework: Astro
2. Connect the Git repository in Vercel.
3. Set `PUBLIC_SITE_URL` to your production domain in project environment variables.

Do not add URL rewrites in `vercel.json` for Astro static routes — use Astro's file-based output instead.

## Netlify

1. Copy [`deploy/netlify.toml`](../deploy/netlify.toml) to the repo root.
2. Connect the Git repository in Netlify.
3. If pnpm is not detected, set `NETLIFY_USE_PNPM=true` in site environment variables.
4. Set `PUBLIC_SITE_URL` for production builds.

## Cloudflare

### Pages (Git integration)

1. Connect the repository in the Cloudflare dashboard.
2. Build command: `pnpm build`
3. Build output directory: `dist`
4. Node.js version: 22

### CLI (optional)

Install Wrangler as a dev dependency, then:

```bash
pnpm deploy:cloudflare
```

This runs `pnpm build` and deploys using [`deploy/cloudflare/wrangler.jsonc`](../deploy/cloudflare/wrangler.jsonc).

## AWS S3 + CloudFront

### Local deploy

```bash
pnpm build
export AWS_S3_BUCKET=your-bucket
export AWS_CLOUDFRONT_DISTRIBUTION_ID=E1234567890   # optional
export AWS_REGION=us-east-1                          # optional
pnpm deploy:aws
```

Requires the [AWS CLI](https://aws.amazon.com/cli/) and credentials with `s3:PutObject`, `s3:DeleteObject`, and (if invalidating) `cloudfront:CreateInvalidation`.

### GitHub Actions (OIDC)

[`.github/workflows/deploy-aws.yml`](../.github/workflows/deploy-aws.yml) deploys to S3 on every push to `main` when secrets are configured. The workflow is skipped on forks and fresh clones without secrets.

**GitHub secrets**

| Secret | Required | Purpose |
|--------|----------|---------|
| `AWS_ROLE_ARN` | Yes | IAM role ARN for OIDC |
| `AWS_S3_BUCKET` | Yes | Target S3 bucket |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | No | CloudFront invalidation |

**GitHub variables (optional)**

| Variable | Default | Purpose |
|----------|---------|---------|
| `AWS_REGION` | `us-east-1` | AWS region |
| `PUBLIC_SITE_URL` | `https://example.com` | Passed to `pnpm build` |

**IAM OIDC trust policy (example)**

Replace `ORG/REPO` with your GitHub org and repository:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:ORG/REPO:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

Attach a policy allowing `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the target bucket, and `cloudfront:CreateInvalidation` on the distribution if used.

## CMS rebuild hooks

When using Webiny (`cms: "webiny"`) or another headless CMS, configure the host to rebuild on content changes:

1. Create a **deploy hook** or **build hook** in your host's dashboard (see per-host sections above).
2. In **Webiny Admin → Settings → Webhooks**, add a webhook for `entry.afterPublish` pointing at that hook URL.
3. Optionally protect the hook with a shared secret header validated by the host.

Full Webiny setup (content model, API keys, webhook details): [webiny.md](webiny.md).

## SSR upgrade path

To enable server rendering or hybrid output:

1. Run `npx astro add vercel`, `netlify`, or `cloudflare`.
2. Change `output` in `astro.config.mjs` to `"server"` or `"hybrid"`.
3. Review implications for i18n middleware and CMS preview.

The default template does not enable SSR.

## Related docs

- [Architecture §10 — Deployment](ARCHITECTURE.md#10-deployment-architecture)
- [Deploy profiles index](../deploy/README.md)
- [Webiny Headless CMS integration](webiny.md)
