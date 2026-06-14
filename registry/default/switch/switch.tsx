"use client";

// Classification: A — direct React Aria Components replacement (RAC Switch).
// Compat note: use RAC props — `isSelected`/`defaultSelected`/`onChange`
// (not shadcn's `checked`/`onCheckedChange`). See COMPATIBILITY.md.

import {
    Switch as AriaSwitch,
    type SwitchProps as AriaSwitchProps,
    composeRenderProps,
} from "react-aria-components";

import { cva, type VariantProps } from "@/lib/cva";

let switchVariants = cva({
    base: [
        "group peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
        "data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        "bg-input data-[selected]:bg-primary dark:bg-input/80 dark:data-[selected]:bg-primary",
    ],
    variants: {
        size: {
            default: "h-[1.15rem] w-8",
            sm: "h-3.5 w-6",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

let switchThumbVariants = cva({
    base: [
        "pointer-events-none block rounded-full bg-background ring-0 transition-transform",
        "translate-x-0 group-data-[selected]:translate-x-[calc(100%-2px)]",
        "dark:bg-foreground dark:group-data-[selected]:bg-primary-foreground",
    ],
    variants: {
        size: {
            default: "size-4",
            sm: "size-3",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

export interface SwitchProps extends AriaSwitchProps, VariantProps<typeof switchVariants> {}

function Switch({ className, size, ...props }: SwitchProps) {
    return (
        <AriaSwitch
            className={composeRenderProps(className, className =>
                switchVariants({ size, className }),
            )}
            data-size={size}
            data-slot="switch"
            {...props}
        >
            <span className={switchThumbVariants({ size })} data-slot="switch-thumb" />
        </AriaSwitch>
    );
}

export { Switch };
