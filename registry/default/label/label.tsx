// Classification: C — plain `<label>` for shadcn drop-in usage (`htmlFor`).
// React Aria's `Label` is used inside field composition (see the `field`
// component); standalone, a native label preserves the shadcn API exactly.

import type { ComponentProps } from "react";

import { cx } from "@/lib/cva";

function Label({ className, ...props }: ComponentProps<"label">) {
    return (
        <label
            className={cx(
                "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                className,
            )}
            data-slot="label"
            {...props}
        />
    );
}

export { Label };
