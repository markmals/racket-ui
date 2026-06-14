# shadcn → racket-ui compatibility

racket-ui matches shadcn/ui's **look, component names, exports, variants, and `data-slot`s**. Because the internals are React Aria Components (not Radix), a few **prop names** differ. Usage is otherwise drop-in.

## Global prop renames (React Aria idiom)

| shadcn (Radix) | racket-ui (React Aria) | Components |
| --- | --- | --- |
| `checked` | `isSelected` | Checkbox, Switch |
| `defaultChecked` | `defaultSelected` | Checkbox, Switch |
| `onCheckedChange` | `onChange` (gets `boolean`) | Checkbox, Switch |
| `disabled` | `isDisabled` | all React Aria widgets |
| `required` | `isRequired` | inputs/fields |
| `open` / `onOpenChange` | `open` (→ `isOpen`) / `onOpenChange` | Dialog, Popover, Sheet, AlertDialog (adapter keeps `open`) |
| `onSelect` | `onAction` | Menu / Command items |
| `value`/`onValueChange` | `value`/`onValueChange` (adapter) → `selectedKey`/`onSelectionChange` | Tabs, Select, Combobox |

`onClick` works on `Button` (React Aria also supports `onPress`, the preferred handler). `asChild` is **not** supported (React Aria has no Slot); use the exported `*Variants` (e.g. `buttonVariants`, `badgeVariants`) on a `<Link>`/anchor for styled non-button elements.

## Component-specific notes

- **Button** — no `asChild`. Use `buttonVariants({ variant, size })` on a link.
- **Tabs** — keeps shadcn's `value` API: `<Tabs defaultValue>`, `<TabsTrigger value>`, `<TabsContent value>`.
- **Select** — keeps shadcn's `value` API: `<Select value/defaultValue onValueChange>`, `<SelectItem value>`, `<SelectValue placeholder>`. Scroll buttons are no-ops (React Aria's listbox scrolls natively).
- **RadioGroup** — `onValueChange` → `onChange`. The label goes **inside** the item (`<RadioGroupItem value="a">Option A</RadioGroupItem>`), not a separate `htmlFor` Label.
- **Dialog / Sheet / Popover** — place a `<Button>` inside `<DialogTrigger>` (drop `asChild`). Controlled via `open`/`onOpenChange` on the root.
- **Tooltip** — no provider needed; `TooltipProvider` is a pass-through and the open delay lives on each `Tooltip` (`delay`/`closeDelay`).
- **HoverCard** — non-modal (does not steal focus); opens on hover/focus.

## Components rebuilt on React Aria natives (no third-party lib)

These previously wrapped a third-party package; they now use React Aria:

- **sonner → `Toaster` + `toast`** — built on React Aria's toast primitives (`UNSTABLE_Toast*` + a module-level `ToastQueue`). Call-site API is preserved: `toast.success(...)`, `toast.error(...)`, etc.; render `<Toaster />` once.
- **command → React Aria `Autocomplete`** (was `cmdk`). Same exports (`Command`, `CommandInput`, `CommandList`, `CommandItem`, `CommandGroup`, `CommandEmpty`, `CommandSeparator`, `CommandShortcut`, `CommandDialog`). `CommandItem` accepts `onSelect` (shadcn alias) and `onAction`.
- **form → TanStack Form** (was react-hook-form). Different paradigm: there is no `control` — create the form with `useForm()` and render fields with `<form.Field name>{(field) => …}</form.Field>`. Pass the `field` to `<FormControl field={field}>` / `<FormMessage field={field}>`. `FormControl` injects `id`/`aria-*` onto its child input (no manual `id` needed).
- **input-otp → custom on a single React Aria text input** (was `input-otp`). Same exports (`InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`).

## New native components (beyond shadcn/ui's set)

- **DatePicker / DateRangePicker / TimeField** — React Aria date primitives; values use `@internationalized/date` (`parseDate`, `CalendarDate`, `Time`, …).
- **Tree** — React Aria `Tree` (expandable/selectable rows).
- **ColorPicker** — React Aria `ColorPicker` (area + hue slider + hex field + swatches).
- **DropZone** — React Aria `DropZone` + `FileTrigger` (drag-drop + file select).
