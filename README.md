# racket-ui

A [shadcn/ui](https://ui.shadcn.com)-compatible component registry, rebuilt on **React Aria Components**, **Tailwind v4**, **`cva@beta`**, **`tailwind-merge`**, and **Tabler Icons**.

> Match shadcn/ui from the outside. Replace the implementation from the inside.

Components install with the official `shadcn` CLI and land in the same paths (`components/ui/*`, `lib/cva.ts`) with the same names, variants, `data-slot`s, and visuals as default shadcn/ui — but powered by React Aria for accessibility and state, with no Radix, Lucide, `clsx`, or `class-variance-authority`.

## Install

```sh
# one-time: design tokens, globals.css, and the cva helper
shadcn add markmals/racket-ui/base

shadcn add markmals/racket-ui/button
shadcn add markmals/racket-ui/dialog
shadcn add markmals/racket-ui/select
```

Usage is drop-in shadcn:

```tsx
import { Button } from "@/components/ui/button"

<Button>Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button size="icon" aria-label="Search"><IconSearch /></Button>
```

A small number of **prop names** differ because the internals are React Aria, not Radix (e.g. `checked` → `isSelected`). See [COMPATIBILITY.md](./COMPATIBILITY.md).

## Repository

| Path | What |
| --- | --- |
| `registry/default/<name>/` | Canonical source: `<name>.tsx` + `registry-item.json` |
| `lib/`, `components/ui/` | Generated (synced) from `registry/default` for the demo + typecheck |
| `app/` | Vite + TanStack Router demo / showcase SPA |
| `public/r/*.json` | Generated distribution artifacts (`shadcn build`) |
| `fixtures/` | Clean install fixtures for end-to-end CLI testing |
| [`CONVENTIONS.md`](./CONVENTIONS.md) | The authoring contract every component follows |
| [`COMPATIBILITY.md`](./COMPATIBILITY.md) | shadcn → racket-ui prop mapping |

## Tooling & tasks (mise)

Toolchain (Node, pnpm), environment, and tasks are managed with [mise](https://mise.jdx.dev) via [`mise.toml`](./mise.toml). `mise` pins the Node/pnpm versions and puts `node_modules/.bin` on `PATH`, so `vite`, `tsc`, `tsx`, `shadcn`, and `vitest` run without `npx`.

```sh
mise install            # install the pinned toolchain
mise run dev            # run the demo SPA (alias: mise run d)
mise run registry:build # sync + shadcn build -> public/r/*.json (alias: rb)
mise run typecheck      # tsc --noEmit (alias: tc)
mise run test           # vitest (alias: t)
mise run check          # registry:sync + typecheck + test + lint + format check
mise run info           # print toolchain + registry-item count
mise tasks              # list all tasks
```

Each task auto-runs a cached `install` first (skipped when the lockfile is unchanged). The equivalent `pnpm` scripts remain available (`pnpm dev`, `pnpm registry:build`, `pnpm typecheck`, `pnpm test`).

### Generated files & the `registry:sync` cache

`check` (and `typecheck`/`test`) depend on `registry:sync`, which mirrors the canonical source in `registry/default/` to the gitignored targets the demo app and tests import — `components/ui/*`, `lib/cva.ts`, `app/globals.css`, and `registry.json`. The sync is cached on its `sources`/`outputs`: it regenerates on a fresh checkout (when those files are absent) and whenever anything under `registry/default/` changes, and is skipped when nothing changed — so you don't wait for a rebuild that isn't needed.

> [!NOTE]
> mise's cache only forces a re-run when **all** of the generated outputs are missing. If you manually delete **some** of them and a quality gate then fails because it can't find a generated file, the fix is `mise run registry:sync --force`, which bypasses the cache and regenerates everything.

## Stack

`react` · `react-dom` · `react-aria-components` · `tailwindcss@4` · `tw-animate-css` · `cva@beta` · `tailwind-merge` · `@tabler/icons-react` · `shadcn` (registry tooling)
