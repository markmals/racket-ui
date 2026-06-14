# racket-ui authoring conventions (canonical)

This is the contract every component must follow. It is the source of truth for both human authors and delegated (Codex) workers. Read it fully before writing or porting a component. The already-built first-pass components in `registry/default/` are the reference exemplars — match their style exactly.

## Goal

Match shadcn/ui from the outside (same component names, exports, variants, `data-slot`s, visuals, light/dark, states). Replace the implementation from the inside with **React Aria Components**, **Tailwind v4**, **cva@beta**, **tailwind-merge**, and **Tabler Icons**.

The canonical shadcn source to port from lives at: `../shadcn-ui/apps/v4/registry/new-york-v4/ui/<name>.tsx` (plus `lib/`, `hooks/`). Lift the visual class strings verbatim where possible.

## Stack rules (hard)

- **No** `lucide-react` → use `@tabler/icons-react` (direct named imports).
- **No** `class-variance-authority` → use `cva@beta` via `@/lib/cva`.
- **No** `clsx` / `cn` / local class-merge helpers → use `cx`/cva from `@/lib/cva`.
- **No** Radix (`radix-ui`) → use `react-aria-components`, or a local impl, or a justified third-party package (see classifications below).
- **No** Tailwind v3 config; CSS-first tokens already live in `registry/default/base/globals.css`.
- **No** `default` exports. **No** `forwardRef` (use plain function components; React Aria components accept `ref` via props already).
- Named function components; named exports only.
- Add `"use client"` as the first line of any file that imports from `react-aria-components` or uses React state/hooks. Plain DOM-only components (badge, card, input, label, textarea, skeleton, alert, spinner) omit it.

## File layout

Each component is a directory under `registry/default/<name>/`:

```
registry/default/<name>/
  <name>.tsx            canonical source (imports use @/lib/cva, @/components/ui/*)
  registry-item.json    shadcn registry item descriptor
```

`registry-item.json` shape:

```json
{
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "<name>",
    "type": "registry:ui",
    "title": "<Title Case>",
    "description": "<one sentence>",
    "dependencies": ["react-aria-components", "@tabler/icons-react"],
    "registryDependencies": ["@racket-ui/cva", "@racket-ui/<other-component>"],
    "files": [
        {
            "path": "registry/default/<name>/<name>.tsx",
            "type": "registry:ui",
            "target": "components/ui/<name>.tsx"
        }
    ]
}
```

- `dependencies` = npm packages the file imports (only include `@tabler/icons-react` if icons are used; only include `react-aria-components` if used).
- `registryDependencies` = **always** include `"@racket-ui/cva"`. Add `"@racket-ui/<component>"` for every OTHER `@/components/ui/<component>` this file imports (e.g. dialog → `"@racket-ui/button"`). **Always namespace with `@racket-ui/`** — never a bare name (a bare `"button"` resolves to shadcn.com's Radix button).
- Multi-file components keep one entry per file in `files`.

Imports inside the `.tsx` use the **consumer target aliases**: `import { cva, cx, type VariantProps } from "@/lib/cva"` and `import { Button } from "@/components/ui/button"`. Never import from `"cva"` directly. Never use `@/registry/...` paths.

## cva / cx / composeRenderProps (the class pattern)

`@/lib/cva` exports `cva`, `cx`, `compose`, and `type VariantProps`. Every output is run through `tailwind-merge` automatically (the `onComplete` hook), so later utilities win over earlier conflicting ones.

- **Styled element with variants** → call the cva fn with `className` merged in: `buttonVariants({ variant, size, className })`.
- **Static sub-parts (no variants)** → `cx("base classes", className)`.
- **React Aria components** whose `className` may be a render function (`string | (renderProps) => string`) → wrap with `composeRenderProps` so a function className is not silently dropped:

    ```tsx
    import { composeRenderProps } from "react-aria-components"
    className={composeRenderProps(className, (className) =>
      fooVariants({ variant, className })
    )}
    ```

- `compose(a, b)` composes multiple **cva functions** (not strings); use it to share a fragment such as a focus ring across components. Do **not** call `compose(stringResult, className)` — that does not type-check.

`children` render functions (e.g. a Checkbox indicator, a Dialog close button needing `close`) also use `composeRenderProps(children, (children, rp) => ...)`.

## data-slot

Every public primitive and sub-part gets `data-slot="<kebab-name>"` (e.g. `data-slot="select-trigger"`). Mirror shadcn's slot names exactly.

## State styling: Radix → React Aria attribute map

shadcn styles state via Radix `data-[state=...]` and CSS pseudo-classes. React Aria exposes its own data attributes. Translate as follows (keep everything else identical):

| shadcn / Radix | racket-ui / React Aria |
| --- | --- |
| `hover:` (interactive widgets) | `data-[hovered]:` |
| `focus-visible:` | `data-[focus-visible]:` |
| `focus:` (listbox/menu highlight) | `data-[focused]:` |
| `disabled:` (RAC widgets) | `data-[disabled]:` |
| `data-[state=checked]` | `data-[selected]` |
| `data-[state=unchecked]` | (default / unprefixed) |
| `data-[state=indeterminate]` | `data-[indeterminate]` |
| `data-[state=on]` (toggle) | `data-[selected]` |
| `data-[state=active]` (tabs) | `data-[selected]` |
| `data-[state=open]` (open trigger) | `data-[pressed]` on trigger / context |
| `data-[state=open]` (overlay enter) | `data-[entering]` |
| `data-[state=closed]` (overlay exit) | `data-[exiting]` |
| `data-[side=top\|bottom\|left\|right]` | `data-[placement=top\|bottom\|left\|right]` |
| `aria-invalid:` / Radix invalid | `data-[invalid]:` (RAC) — keep `aria-invalid:` for plain inputs |
| `data-[disabled]` (menu/listbox item) | `data-[disabled]` |

Notes:

- Plain DOM elements (`input`, `textarea`, `label`) keep native pseudo-classes (`focus-visible:`, `disabled:`, `aria-invalid:`) — they are real elements.
- Overlay open/close animation is driven by `data-[entering]`/`data-[exiting]` (provided by `Modal`, `ModalOverlay`, `Popover`, `Tooltip`). React Aria keeps the element mounted through the exit animation automatically.

## Icons (Tabler)

Direct named imports, e.g. `import { IconCheck, IconChevronDown } from "@tabler/icons-react"`. Control icons 16px (`size-4`), larger affordances 20px (`size-5`), stroke 2 (Tabler default). Decorative icons get `aria-hidden="true"` (or rely on parent labeling). Icon-only controls require an accessible label. Lucide → Tabler:

```
Check→IconCheck  ChevronDown→IconChevronDown  ChevronUp→IconChevronUp
ChevronLeft→IconChevronLeft  ChevronRight→IconChevronRight  ChevronsUpDown→IconSelector
X→IconX  Search→IconSearch  Circle→IconCircle  Dot/filled→IconCircleFilled
PanelLeft→IconLayoutSidebar  MoreHorizontal→IconDots  MoreVertical→IconDotsVertical
GripVertical→IconGripVertical  Calendar→IconCalendar  Clock→IconClock
Loader2→IconLoader2  AlertCircle→IconAlertCircle  Info→IconInfoCircle
CheckCircle→IconCircleCheck  Minus→IconMinus  Plus→IconPlus  ArrowLeft→IconArrowLeft
ArrowRight→IconArrowRight  ArrowUpDown→IconArrowsUpDown  Star→IconStar
```

Need a name not listed? Pick the closest Tabler outline icon (browse `../shadcn-ui/apps/v4/registry/icons/__tabler__.ts` for shadcn's own mapping).

## Component classification (write it in a top-of-file comment)

- **A** — direct React Aria replacement (Button, Checkbox, Switch, Separator, RadioGroup, Slider, Tabs, Tooltip, ProgressBar, ToggleButton…).
- **B** — React Aria + a compatibility adapter (Dialog, Popover, Select, Combobox, Menu — preserve shadcn exports/value-API on top of RAC primitives).
- **C** — local implementation (Sidebar, Navigation Menu, Input OTP if no pkg).
- **D** — third-party package retained for parity (Carousel→embla, Chart→recharts, Sonner→sonner, Resizable→react-resizable-panels, Drawer→vaul if RAC modal can't reach parity, Data Table→@tanstack/react-table). Restyle with our tokens/cva.

Decision rule: prioritize 1:1 shadcn usage/behavior over purity. Prefer React Aria when it meets parity; avoid Radix; only reach for D when it preserves shadcn functionality better than forcing RAC into the wrong role.

## API compatibility

- Preserve shadcn export names exactly (e.g. `Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose`). Preserve `variant`/`size` names and `data-slot`s.
- Base the component's props on the React Aria primitive's props (`extends AriaXProps`), then add `VariantProps<typeof xVariants>` where relevant.
- For boolean/selection controls expose **React Aria props** (`isSelected`, `onChange`, `isDisabled`, `isOpen`) and record the rename in `COMPATIBILITY.md`.
- For collection components (Tabs, Select, Combobox, Menu), additionally accept shadcn's `value`-keyed API and map it to React Aria `id`/`selectedKey` (`Tabs`/`Select` exemplars show the pattern). `asChild` is dropped everywhere (React Aria has no Slot); export `xVariants` for element composition instead.

## Verification (every component)

1. `pnpm registry:sync` then `pnpm typecheck` must pass with zero errors.
2. `pnpm registry:build` must build the item.
3. No `lucide-react`, `class-variance-authority`, `clsx`, `cn`, or `radix-ui` imports. No `@/registry/...` imports. No default exports.
