import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

/**
 * Configured `cva` helpers for the racket-ui registry.
 *
 * Every generated class string is passed through `tailwind-merge` via the
 * `onComplete` hook so later utility classes win over earlier conflicting ones
 * (the role the classic shadcn `cn` helper played). Components import from
 * `@/lib/cva` and never from `"cva"` directly.
 */
export const { cva, cx, compose } = defineConfig({
    hooks: {
        onComplete: className => twMerge(className),
    },
});

export type { VariantProps } from "cva";
