// Classification: A — static component (cva only).

import type { ComponentProps } from "react";

import { cva, cx, type VariantProps } from "@/lib/cva";

let itemVariants = cva({
    base: "group/item flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-accent/50",
    variants: {
        variant: {
            default: "bg-transparent",
            outline: "border-border",
            muted: "bg-muted/50",
        },
        size: {
            default: "gap-4 p-4",
            sm: "gap-2.5 px-4 py-3",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

let itemMediaVariants = cva({
    base: "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
    variants: {
        variant: {
            default: "bg-transparent",
            icon: "size-8 rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-4",
            image: "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface ItemGroupProps extends ComponentProps<"div"> {}

function ItemGroup({ className, ...props }: ItemGroupProps) {
    return (
        <div
            className={cx("group/item-group flex flex-col", className)}
            data-slot="item-group"
            role="list"
            {...props}
        />
    );
}

export interface ItemSeparatorProps extends ComponentProps<"div"> {
    orientation?: "horizontal" | "vertical";
}

function ItemSeparator({ className, orientation = "horizontal", ...props }: ItemSeparatorProps) {
    return (
        <div
            aria-orientation={orientation}
            className={cx(
                "my-0 shrink-0 bg-border",
                orientation === "vertical" ? "h-full w-px" : "h-px w-full",
                className,
            )}
            data-orientation={orientation}
            data-slot="item-separator"
            role="separator"
            {...props}
        />
    );
}

export interface ItemProps extends ComponentProps<"div">, VariantProps<typeof itemVariants> {}

function Item({ className, variant = "default", size = "default", ...props }: ItemProps) {
    return (
        <div
            className={itemVariants({ variant, size, className })}
            data-size={size}
            data-slot="item"
            data-variant={variant}
            {...props}
        />
    );
}

export interface ItemMediaProps
    extends ComponentProps<"div">, VariantProps<typeof itemMediaVariants> {}

function ItemMedia({ className, variant = "default", ...props }: ItemMediaProps) {
    return (
        <div
            className={itemMediaVariants({ variant, className })}
            data-slot="item-media"
            data-variant={variant}
            {...props}
        />
    );
}

function ItemContent({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
                className,
            )}
            data-slot="item-content"
            {...props}
        />
    );
}

function ItemTitle({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex w-fit items-center gap-2 text-sm leading-snug font-medium",
                className,
            )}
            data-slot="item-title"
            {...props}
        />
    );
}

function ItemDescription({ className, ...props }: ComponentProps<"p">) {
    return (
        <p
            className={cx(
                "line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground",
                "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
                className,
            )}
            data-slot="item-description"
            {...props}
        />
    );
}

function ItemActions({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("flex items-center gap-2", className)}
            data-slot="item-actions"
            {...props}
        />
    );
}

function ItemHeader({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("flex basis-full items-center justify-between gap-2", className)}
            data-slot="item-header"
            {...props}
        />
    );
}

function ItemFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("flex basis-full items-center justify-between gap-2", className)}
            data-slot="item-footer"
            {...props}
        />
    );
}

export {
    Item,
    ItemMedia,
    ItemContent,
    ItemActions,
    ItemGroup,
    ItemSeparator,
    ItemTitle,
    ItemDescription,
    ItemHeader,
    ItemFooter,
    itemVariants,
    itemMediaVariants,
};
