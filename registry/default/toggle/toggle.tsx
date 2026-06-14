"use client";

// Classification: A - direct React Aria Components replacement (RAC ToggleButton).
// Compat note: use RAC props - `isSelected`/`defaultSelected`/`onChange`
// (not shadcn's `pressed`/`onPressedChange`). See COMPATIBILITY.md.

import {
    ToggleButton as AriaToggleButton,
    type ToggleButtonProps as AriaToggleButtonProps,
    composeRenderProps,
} from "react-aria-components";

import { cva, type VariantProps } from "@/lib/cva";

let toggleVariants = cva({
    base: [
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none",
        "data-[hovered]:bg-muted data-[hovered]:text-muted-foreground",
        "data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 dark:data-[invalid]:ring-destructive/40",
        "data-[selected]:bg-accent data-[selected]:text-accent-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ],
    variants: {
        variant: {
            default: "bg-transparent",
            outline:
                "border border-input bg-transparent shadow-xs data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
        },
        size: {
            default: "h-9 min-w-9 px-2",
            sm: "h-8 min-w-8 px-1.5",
            lg: "h-10 min-w-10 px-2.5",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

export interface ToggleProps extends AriaToggleButtonProps, VariantProps<typeof toggleVariants> {}

function Toggle({ className, variant, size, ...props }: ToggleProps) {
    return (
        <AriaToggleButton
            className={composeRenderProps(className, className =>
                toggleVariants({ variant, size, className }),
            )}
            data-slot="toggle"
            {...props}
        />
    );
}

export { Toggle, toggleVariants };
