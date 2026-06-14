"use client";

// Classification: A — direct React Aria replacement. Composes TimeField >
// DateInput > DateSegment. Styled to match the racket-ui input/select-trigger
// look: h-9 border rounded-md px-3, data-[focus-within] ring, segments with
// data-[focused] bg-accent highlight and data-[placeholder] muted foreground.

import type { TimeValue } from "react-aria-components";

import {
    DateInput,
    type DateInputProps,
    DateSegment,
    type DateSegmentProps,
    TimeField as AriaTimeField,
    type TimeFieldProps as AriaTimeFieldProps,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

// ── TimeField ────────────────────────────────────────────────────────────────

export interface TimeFieldProps<T extends TimeValue> extends AriaTimeFieldProps<T> {}

function TimeField<T extends TimeValue>({ className, children, ...props }: TimeFieldProps<T>) {
    return (
        <AriaTimeField
            className={composeRenderProps(className, className =>
                cx("group/time-field flex flex-col gap-2", className),
            )}
            data-slot="time-field"
            {...props}
        >
            {children}
        </AriaTimeField>
    );
}

// ── TimeFieldInput (styled DateInput) ────────────────────────────────────────

export interface TimeFieldInputProps extends Omit<DateInputProps, "children"> {}

function TimeFieldInput({ className, ...props }: TimeFieldInputProps) {
    return (
        <DateInput
            className={composeRenderProps(className, className =>
                cx(
                    // Base — matches input / select-trigger shape
                    "flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                    // Dark-mode tint
                    "dark:bg-input/30",
                    // Focus-within ring (React Aria sets data-[focus-within] on DateInput)
                    "data-[focus-within]:border-ring data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/50",
                    // Focus-visible ring (keyboard navigation)
                    "data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
                    // Invalid state
                    "data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 dark:data-[invalid]:ring-destructive/40",
                    // Disabled
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    className,
                ),
            )}
            data-slot="time-field-input"
            {...props}
        >
            {segment => <TimeFieldSegment segment={segment} />}
        </DateInput>
    );
}

// ── TimeFieldSegment (styled DateSegment) ────────────────────────────────────

export interface TimeFieldSegmentProps extends DateSegmentProps {}

function TimeFieldSegment({ className, ...props }: TimeFieldSegmentProps) {
    return (
        <DateSegment
            className={composeRenderProps(className, className =>
                cx(
                    // Base segment shape
                    "inline rounded px-0.5 py-0.5 text-sm tabular-nums caret-transparent outline-none",
                    // Literal separators (colon, space)
                    "data-[type=literal]:px-0 data-[type=literal]:text-muted-foreground data-[type=literal]:select-none",
                    // Placeholder styling (unfilled value)
                    "data-[placeholder]:text-muted-foreground",
                    // Focused segment highlight
                    "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                    // Invalid
                    "data-[invalid]:text-destructive data-[invalid]:data-[focused]:bg-destructive data-[invalid]:data-[focused]:text-destructive-foreground",
                    // Read-only
                    "data-[readonly]:cursor-default data-[readonly]:opacity-50",
                    // Disabled
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    className,
                ),
            )}
            data-slot="time-field-segment"
            {...props}
        />
    );
}

export { TimeField, TimeFieldInput, TimeFieldSegment };
