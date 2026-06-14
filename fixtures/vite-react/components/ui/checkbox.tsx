"use client";

// Classification: A — direct React Aria Components replacement (RAC Checkbox).
// Compat note: use RAC props — `isSelected`/`defaultSelected`/`onChange`
// (not shadcn's `checked`/`onCheckedChange`). See COMPATIBILITY.md.

import { IconCheck, IconMinus } from "@tabler/icons-react";
import {
    Checkbox as AriaCheckbox,
    type CheckboxProps as AriaCheckboxProps,
    composeRenderProps,
} from "react-aria-components";

import { cva } from "@/lib/cva";

let checkboxVariants = cva({
    base: [
        "peer inline-grid size-4 shrink-0 place-content-center rounded-[4px] border border-input text-current shadow-xs transition-shadow outline-none",
        "data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        "data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 dark:data-[invalid]:ring-destructive/40",
        "data-[selected]:border-primary data-[selected]:bg-primary data-[selected]:text-primary-foreground",
        "data-[indeterminate]:border-primary data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground",
        "dark:bg-input/30 dark:data-[selected]:bg-primary",
    ],
});

function Checkbox({ className, ...props }: AriaCheckboxProps) {
    return (
        <AriaCheckbox
            className={composeRenderProps(className, className => checkboxVariants({ className }))}
            data-slot="checkbox"
            {...props}
        >
            {({ isSelected, isIndeterminate }) => (
                <span
                    className="grid place-content-center text-current"
                    data-slot="checkbox-indicator"
                >
                    {isIndeterminate ? (
                        <IconMinus className="size-3.5" />
                    ) : isSelected ? (
                        <IconCheck className="size-3.5" />
                    ) : null}
                </span>
            )}
        </AriaCheckbox>
    );
}

export { Checkbox };
