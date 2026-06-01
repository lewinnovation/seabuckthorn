# create-seabuckthorn

CLI to scaffold a [Seabuckthorn](https://github.com/lewinnovation/seabuckthorn) Astro site.

```bash
pnpm create seabuckthorn@latest my-site
```

See the [scaffold guide](../../docs/scaffold.md) in the template repo.

## Development

From the monorepo root:

```bash
pnpm sync:template
pnpm --filter create-seabuckthorn build
pnpm --filter create-seabuckthorn test
```
