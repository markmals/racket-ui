// Classification: A — static component.

import type { ComponentProps } from "react";

import { cx } from "@/lib/cva";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("animate-pulse rounded-md bg-accent", className)}
            data-slot="skeleton"
            {...props}
        />
    );
}

export { Skeleton };
