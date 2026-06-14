// Classification: A — static component.

import type { ComponentProps, CSSProperties } from "react";

import { cx } from "@/lib/cva";

export interface AspectRatioProps extends ComponentProps<"div"> {
    ratio?: CSSProperties["aspectRatio"];
}

function AspectRatio({ className, ratio = 1, style, ...props }: AspectRatioProps) {
    return (
        <div
            className={cx(className)}
            data-slot="aspect-ratio"
            style={{ ...style, aspectRatio: ratio }}
            {...props}
        />
    );
}

export { AspectRatio };
