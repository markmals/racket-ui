"use client";

// Classification: A — direct React Aria Components replacement (RAC Separator).

import { Separator as AriaSeparator, type SeparatorProps } from "react-aria-components";

import { cva } from "@/lib/cva";

let separatorVariants = cva({
    base: "shrink-0 bg-border",
    variants: {
        orientation: {
            horizontal: "h-px w-full",
            vertical: "h-full w-px",
        },
    },
    defaultVariants: {
        orientation: "horizontal",
    },
});

function Separator({ className, orientation = "horizontal", ...props }: SeparatorProps) {
    return (
        <AriaSeparator
            className={separatorVariants({ orientation, className })}
            data-slot="separator"
            orientation={orientation}
            {...props}
        />
    );
}

export { Separator };
