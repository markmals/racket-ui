// Classification: C — local styled scroll container. Radix ScrollArea has no
// React Aria equivalent; implemented as a native overflow container with Tailwind
// scrollbar utilities. Preserves shadcn export names, data-slots, and visuals.

"use client";

import type { ComponentProps } from "react";

import { cx } from "@/lib/cva";

function ScrollArea({ className, children, ...props }: ComponentProps<"div">) {
    return (
        <div className={cx("relative overflow-auto", className)} data-slot="scroll-area" {...props}>
            <div
                className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
                data-slot="scroll-area-viewport"
                tabIndex={0}
            >
                {children}
            </div>
        </div>
    );
}

type ScrollBarOrientation = "vertical" | "horizontal";

interface ScrollBarProps extends ComponentProps<"div"> {
    orientation?: ScrollBarOrientation;
}

function ScrollBar({ className, orientation = "vertical", ...props }: ScrollBarProps) {
    return (
        <div
            className={cx(
                "flex touch-none p-px transition-colors select-none",
                orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
                orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
                className,
            )}
            data-orientation={orientation}
            data-slot="scroll-area-scrollbar"
            {...props}
        >
            <div className="relative flex-1 rounded-full bg-border" data-slot="scroll-area-thumb" />
        </div>
    );
}

export { ScrollArea, ScrollBar };
