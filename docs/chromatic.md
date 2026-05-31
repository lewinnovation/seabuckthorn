# Visual regression testing with Chromatic

Seabuckthorn uses [Chromatic](https://www.chromatic.com) for visual regression testing of Storybook stories. Accessibility (axe contrast and keyboard behavior) stays in Vitest — see [a11y.md](a11y.md).

## What Chromatic covers

| Layer | Tool | Catches |
|-------|------|---------|
| Accessibility | Vitest + `@storybook/addon-a11y` | axe violations, keyboard `play()` failures |
| Visual layout | Chromatic | Token regressions, layout shifts, theme palette drift |

## Theme snapshots

Interactive React stories export `Light`, `Dark`, and `HighContrast` variants via [`src/storybook/themeVariants.ts`](../src/storybook/themeVariants.ts). Chromatic captures each variant so contrast and token changes surface per palette.

Static Astro stories (`Callout`, `SiteHeader`) are included in visual baselines.

## Keyboard stories

`Keyboard` stories run interaction tests in Vitest but **skip Chromatic snapshots** (`keyboardStoryParams` in `themeVariants.ts`) to avoid flaky captures from open dialogs, focused menus, or mid-interaction state.

## Local usage

```bash
pnpm storybook          # Visual Tests panel in Storybook UI
pnpm chromatic          # Upload snapshots (does not fail on changes)
```

Set your project token for local uploads:

```bash
export CHROMATIC_PROJECT_TOKEN=chpt_xxxxxxxx
pnpm chromatic
```

Or add the token to a local `.env` file (never commit it).

## CI setup

1. Create a project at [chromatic.com](https://www.chromatic.com) linked to this repository.
2. Add the project token as a GitHub secret: `CHROMATIC_PROJECT_TOKEN`.
3. Run `pnpm chromatic` locally once, or let the first CI run on `main` establish baselines.
4. Set `chromatic: true` in [`seabuckthorn.config.ts`](../seabuckthorn.config.ts) when opted in.
5. In GitHub branch protection, require the **Chromatic** status check on `main`.

The [`.github/workflows/chromatic.yml`](../.github/workflows/chromatic.yml) workflow:

- Skips when `CHROMATIC_PROJECT_TOKEN` is absent (fork-safe).
- Runs `pnpm chromatic:ci` — **fails on unreviewed visual changes** until accepted in the Chromatic UI.
- Uses TurboSnap (`onlyChanged` in [`chromatic.config.json`](../chromatic.config.json)) to test only stories affected by the diff.

## Accepting changes

When CI reports visual diffs:

1. Open the Chromatic build link from the PR check or GitHub comment.
2. Review each changed snapshot.
3. Accept intentional changes in the Chromatic UI.
4. Re-run CI or push again — the check passes once baselines are updated.

## Related docs

- [Chromatic Visual Tests addon](https://www.chromatic.com/docs/visual-tests-addon/)
- [Architecture §9 — Storybook and Chromatic](ARCHITECTURE.md#9-storybook-and-chromatic)
- [Accessibility guidelines](a11y.md)
