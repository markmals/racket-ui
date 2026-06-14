// Classification: A — static component (cva only).

import type { ComponentProps } from "react";

import { cva, cx, type VariantProps } from "@/lib/cva";

let emptyMediaVariants = cva({
    base: "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
    variants: {
        variant: {
            default: "bg-transparent",
            icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

function Empty({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
                className,
            )}
            data-slot="empty"
            {...props}
        />
    );
}

function EmptyHeader({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("flex max-w-sm flex-col items-center gap-2 text-center", className)}
            data-slot="empty-header"
            {...props}
        />
    );
}

interface EmptyMediaProps extends ComponentProps<"div">, VariantProps<typeof emptyMediaVariants> {}

function EmptyMedia({ className, variant = "default", ...props }: EmptyMediaProps) {
    return (
        <div
            className={emptyMediaVariants({ variant, className })}
            data-slot="empty-icon"
            data-variant={variant}
            {...props}
        />
    );
}

function EmptyTitle({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("text-lg font-medium tracking-tight", className)}
            data-slot="empty-title"
            {...props}
        />
    );
}

function EmptyDescription({ className, ...props }: ComponentProps<"p">) {
    return (
        <div
            className={cx(
                "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
                className,
            )}
            data-slot="empty-description"
            {...props}
        />
    );
}

function EmptyContent({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
                className,
            )}
            data-slot="empty-content"
            {...props}
        />
    );
}

export {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
    EmptyMedia,
    emptyMediaVariants,
};
