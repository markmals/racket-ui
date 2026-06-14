// Classification: A — static component (cva only). React Aria has no Slot, so
// `asChild` is dropped.

import type { ComponentProps } from "react";

import { cva, cx, type VariantProps } from "@/lib/cva";

let buttonGroupVariants = cva({
    base: "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
    variants: {
        orientation: {
            horizontal:
                "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
            vertical:
                "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
        },
    },
    defaultVariants: {
        orientation: "horizontal",
    },
});

export interface ButtonGroupProps
    extends ComponentProps<"div">, VariantProps<typeof buttonGroupVariants> {}

function ButtonGroup({ className, orientation, ...props }: ButtonGroupProps) {
    return (
        <div
            className={buttonGroupVariants({ orientation, className })}
            data-orientation={orientation}
            data-slot="button-group"
            role="group"
            {...props}
        />
    );
}

function ButtonGroupText({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            data-slot="button-group-text"
            {...props}
        />
    );
}

export interface ButtonGroupSeparatorProps extends ComponentProps<"div"> {
    orientation?: "horizontal" | "vertical";
}

function ButtonGroupSeparator({
    className,
    orientation = "vertical",
    ...props
}: ButtonGroupSeparatorProps) {
    return (
        <div
            aria-orientation={orientation}
            className={cx(
                "relative m-0! self-stretch bg-input data-[orientation=vertical]:h-auto",
                orientation === "vertical" ? "w-px" : "h-px w-full",
                className,
            )}
            data-orientation={orientation}
            data-slot="button-group-separator"
            role="separator"
            {...props}
        />
    );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
