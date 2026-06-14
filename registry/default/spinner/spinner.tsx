// Classification: A — static component (Tabler icon).

import { IconLoader2, type IconProps } from "@tabler/icons-react";

import { cx } from "@/lib/cva";

function Spinner({ className, ...props }: IconProps) {
    return (
        <IconLoader2
            aria-label="Loading"
            className={cx("size-4 animate-spin", className)}
            role="status"
            {...props}
        />
    );
}

export { Spinner };
