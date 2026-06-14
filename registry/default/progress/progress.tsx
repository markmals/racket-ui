"use client";

// Classification: A — direct React Aria Components replacement (RAC ProgressBar).

import {
    ProgressBar as AriaProgressBar,
    type ProgressBarProps as AriaProgressBarProps,
    composeRenderProps,
} from "react-aria-components";

import { cva, cx } from "@/lib/cva";

let progressVariants = cva({
    base: "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
});

function Progress({ className, children: _children, ...props }: AriaProgressBarProps) {
    return (
        <AriaProgressBar
            className={composeRenderProps(className, className => progressVariants({ className }))}
            data-slot="progress"
            {...props}
        >
            {({ percentage }) => (
                <div
                    className={cx("h-full w-full flex-1 bg-primary transition-all")}
                    data-slot="progress-indicator"
                    style={{ transform: `translateX(-${100 - (percentage ?? 0)}%)` }}
                />
            )}
        </AriaProgressBar>
    );
}

export { Progress };
