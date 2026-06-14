"use client";

// Classification: A — direct React Aria Components replacement (RAC Button).
// shadcn `asChild` is intentionally dropped (RAC has no Slot); use `buttonVariants`
// on a `<Link>`/anchor for link-styled buttons, exactly as shadcn recommends.

import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    composeRenderProps,
} from "react-aria-components";

import { cva, type VariantProps } from "@/lib/cva";

let buttonVariants = cva({
    base: [
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none",
        "data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ],
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground data-[hovered]:bg-primary/90",
            destructive:
                "bg-destructive text-white data-[focus-visible]:ring-destructive/20 data-[hovered]:bg-destructive/90 dark:bg-destructive/60 dark:data-[focus-visible]:ring-destructive/40",
            outline:
                "border bg-background shadow-xs data-[hovered]:bg-accent data-[hovered]:text-accent-foreground dark:border-input dark:bg-input/30 dark:data-[hovered]:bg-input/50",
            secondary:
                "bg-secondary text-secondary-foreground shadow-xs data-[hovered]:bg-secondary/80",
            ghost: "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground dark:data-[hovered]:bg-accent/50",
            link: "text-primary underline-offset-4 data-[hovered]:underline",
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
            sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
            "icon-sm": "size-8",
            "icon-lg": "size-10",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

export interface ButtonProps extends AriaButtonProps, VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
    return (
        <AriaButton
            className={composeRenderProps(className, className =>
                buttonVariants({ variant, size, className }),
            )}
            data-size={size}
            data-slot="button"
            data-variant={variant}
            {...props}
        />
    );
}

export { Button, buttonVariants };
