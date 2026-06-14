"use client";

// Classification: A — direct React Aria Components replacement (RAC RadioGroup
// + Radio). Compat notes: RadioGroup uses `value`/`onChange` (not
// `onValueChange`). RadioGroupItem is a RAC `Radio`, so its label goes *inside*
// the item (`<RadioGroupItem value="a">Option A</RadioGroupItem>`) rather than a
// separate `htmlFor` Label. See COMPATIBILITY.md.

import {
    Radio as AriaRadio,
    type RadioProps as AriaRadioProps,
    RadioGroup as AriaRadioGroup,
    type RadioGroupProps as AriaRadioGroupProps,
    composeRenderProps,
} from "react-aria-components";

import { cva, cx } from "@/lib/cva";

function RadioGroup({ className, ...props }: AriaRadioGroupProps) {
    return (
        <AriaRadioGroup
            className={composeRenderProps(className, className =>
                cx(
                    "grid gap-3 data-[orientation=horizontal]:flex data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-3",
                    className,
                ),
            )}
            data-slot="radio-group"
            {...props}
        />
    );
}

let radioControlVariants = cva({
    base: [
        "flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none",
        "group-data-[focus-visible]:border-ring group-data-[focus-visible]:ring-[3px] group-data-[focus-visible]:ring-ring/50",
        "group-data-[invalid]:border-destructive group-data-[invalid]:ring-destructive/20 dark:group-data-[invalid]:ring-destructive/40",
        "dark:bg-input/30",
    ],
});

function RadioGroupItem({ className, children, ...props }: AriaRadioProps) {
    return (
        <AriaRadio
            className={composeRenderProps(className, className =>
                cx(
                    "group flex items-center gap-2 text-sm leading-none font-medium data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    className,
                ),
            )}
            data-slot="radio-group-item"
            {...props}
        >
            {composeRenderProps(children, (children, { isSelected }) => (
                <>
                    <span className={radioControlVariants()} data-slot="radio-group-control">
                        {isSelected && (
                            <span
                                className="size-2 rounded-full bg-primary"
                                data-slot="radio-group-indicator"
                            />
                        )}
                    </span>
                    {children}
                </>
            ))}
        </AriaRadio>
    );
}

export { RadioGroup, RadioGroupItem };
