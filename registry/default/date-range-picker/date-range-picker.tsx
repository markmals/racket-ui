"use client";

// Classification: A — direct React Aria Components replacement (RAC
// DateRangePicker + DateInput + RangeCalendar + Popover + Dialog + Group).
// Renders two DateInputs (start/end) separated by a dash inside a styled Group,
// with a calendar icon Button that opens a Popover > Dialog > RangeCalendar.
// Consistent with the `calendar` component's range cell styles.

import { IconCalendar } from "@tabler/icons-react";
import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    DateInput as AriaDateInput,
    type DateInputProps as AriaDateInputProps,
    DateRangePicker as AriaDateRangePicker,
    type DateRangePickerProps as AriaDateRangePickerProps,
    type DateRangePickerRenderProps,
    DateSegment,
    Dialog,
    FieldError,
    type FieldErrorProps,
    Group,
    type GroupProps,
    Label,
    type LabelProps,
    Popover as AriaPopover,
    Text,
    type TextProps,
    composeRenderProps,
    type DateValue,
} from "react-aria-components";

import { RangeCalendar } from "@/components/ui/calendar";
import { cx } from "@/lib/cva";

// ---------------------------------------------------------------------------
// DateRangePicker (root)
// ---------------------------------------------------------------------------

export interface DateRangePickerProps<
    T extends DateValue = DateValue,
> extends AriaDateRangePickerProps<T> {}

function DateRangePicker<T extends DateValue>({ className, ...props }: DateRangePickerProps<T>) {
    return (
        <AriaDateRangePicker
            className={composeRenderProps(className, className =>
                cx("group/date-range-picker flex flex-col gap-2", className),
            )}
            data-slot="date-range-picker"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// DateRangePickerLabel
// ---------------------------------------------------------------------------

function DateRangePickerLabel({ className, ...props }: LabelProps) {
    return (
        <Label
            className={cx(
                "text-sm leading-none font-medium peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-70",
                className,
            )}
            data-slot="date-range-picker-label"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// DateRangePickerGroup — the trigger row: [start input] – [end input] [button]
// ---------------------------------------------------------------------------

function DateRangePickerGroup({ className, children, ...props }: GroupProps) {
    return (
        <Group
            className={composeRenderProps(className, className =>
                cx(
                    "flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow]",
                    "data-[focus-within]:border-ring data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/50",
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    "data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 dark:data-[invalid]:ring-destructive/40",
                    className,
                ),
            )}
            data-slot="date-range-picker-group"
            {...props}
        >
            {children}
        </Group>
    );
}

// ---------------------------------------------------------------------------
// DateRangePickerInput — a single DateInput (start or end)
// ---------------------------------------------------------------------------

export interface DateRangePickerInputProps extends Omit<AriaDateInputProps, "children"> {
    children?: AriaDateInputProps["children"];
}

function DateRangePickerInput({ className, children, ...props }: DateRangePickerInputProps) {
    return (
        <AriaDateInput
            className={composeRenderProps(className, className =>
                cx("flex items-center gap-0.5", className),
            )}
            data-slot="date-range-picker-input"
            {...props}
        >
            {children ??
                (segment => (
                    <DateSegment
                        className={cx(
                            "inline rounded px-0.5 py-0.5 text-sm caret-transparent transition-colors outline-none",
                            "data-[type=literal]:px-0 data-[type=literal]:text-muted-foreground",
                            "data-[placeholder]:text-muted-foreground",
                            "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                            "data-[invalid]:data-[focused]:bg-destructive data-[invalid]:data-[focused]:text-destructive-foreground",
                        )}
                        segment={segment}
                    />
                ))}
        </AriaDateInput>
    );
}

// ---------------------------------------------------------------------------
// DateRangePickerButton — calendar icon button to open the popover
// ---------------------------------------------------------------------------

function DateRangePickerButton({ className, ...props }: AriaButtonProps) {
    return (
        <AriaButton
            className={composeRenderProps(className, className =>
                cx(
                    "-mr-1 ml-auto flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none",
                    "data-[hovered]:text-foreground",
                    "data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    className,
                ),
            )}
            data-slot="date-range-picker-button"
            {...props}
        >
            <IconCalendar aria-hidden="true" className="size-4" />
        </AriaButton>
    );
}

// ---------------------------------------------------------------------------
// DateRangePickerContent — Popover > Dialog > RangeCalendar
// ---------------------------------------------------------------------------

export interface DateRangePickerContentProps extends Omit<
    React.ComponentProps<typeof AriaPopover>,
    "children"
> {
    calendarProps?: React.ComponentProps<typeof RangeCalendar>;
}

function DateRangePickerContent({
    className,
    calendarProps,
    ...props
}: DateRangePickerContentProps) {
    return (
        <AriaPopover
            className={composeRenderProps(className, className =>
                cx(
                    "z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
                    "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                    "data-[placement=bottom]:slide-in-from-top-2 data-[placement=top]:slide-in-from-bottom-2",
                    "data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2",
                    className,
                ),
            )}
            data-slot="date-range-picker-content"
            offset={4}
            {...props}
        >
            <Dialog className="outline-none" data-slot="date-range-picker-dialog">
                <RangeCalendar {...calendarProps} />
            </Dialog>
        </AriaPopover>
    );
}

// ---------------------------------------------------------------------------
// DateRangePickerDescription
// ---------------------------------------------------------------------------

function DateRangePickerDescription({ className, ...props }: TextProps) {
    return (
        <Text
            className={cx("text-sm text-muted-foreground", className)}
            data-slot="date-range-picker-description"
            slot="description"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// DateRangePickerError
// ---------------------------------------------------------------------------

function DateRangePickerError({ className, ...props }: FieldErrorProps) {
    return (
        <FieldError
            className={cx("text-sm font-medium text-destructive", className)}
            data-slot="date-range-picker-error"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Convenience compound component
// ---------------------------------------------------------------------------

/**
 * A fully composed DateRangePicker trigger with the standard layout:
 *   Label (optional) → Group [ DateInput — DateInput  CalendarButton ] →
 *   Popover > Dialog > RangeCalendar
 *
 * For custom layouts, compose the sub-parts directly.
 */
function DateRangePickerField<T extends DateValue>({
    label,
    description,
    ...props
}: DateRangePickerProps<T> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
}) {
    return (
        <DateRangePicker {...props}>
            {label && <DateRangePickerLabel>{label}</DateRangePickerLabel>}
            <DateRangePickerGroup>
                <DateRangePickerInput slot="start" />
                <span aria-hidden="true" className="px-1 text-muted-foreground select-none">
                    –
                </span>
                <DateRangePickerInput slot="end" />
                <DateRangePickerButton />
            </DateRangePickerGroup>
            {description && <DateRangePickerDescription>{description}</DateRangePickerDescription>}
            <DateRangePickerError />
            <DateRangePickerContent />
        </DateRangePicker>
    );
}

export {
    DateRangePicker,
    DateRangePickerLabel,
    DateRangePickerGroup,
    DateRangePickerInput,
    DateRangePickerButton,
    DateRangePickerContent,
    DateRangePickerDescription,
    DateRangePickerError,
    DateRangePickerField,
};

export type { DateRangePickerRenderProps };
