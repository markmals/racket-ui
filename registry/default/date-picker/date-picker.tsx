"use client";

// Classification: B — React Aria (DatePicker / DateInput / DateSegment / Group /
// Button / Popover / Dialog / Calendar) composed into a shadcn-compatible
// date-picker widget. Value type is DateValue from @internationalized/date.

import { IconCalendar, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
    Button as AriaButton,
    Calendar as AriaCalendar,
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    DateInput,
    DatePicker as AriaDatePicker,
    type DatePickerProps as AriaDatePickerProps,
    DateSegment,
    Dialog,
    Group,
    Heading,
    Popover,
    composeRenderProps,
    type DateValue,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import { cx } from "@/lib/cva";

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {}

function DatePicker<T extends DateValue>({ className, ...props }: DatePickerProps<T>) {
    return (
        <AriaDatePicker
            className={composeRenderProps(className, className =>
                cx("group/date-picker flex flex-col gap-2", className),
            )}
            data-slot="date-picker"
            {...props}
        />
    );
}

function DatePickerTrigger({ className, ...props }: React.ComponentProps<typeof Group>) {
    return (
        <Group
            className={composeRenderProps(className as string | undefined, className =>
                cx(
                    "flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none",
                    "group-data-[focus-within]/date-picker:border-ring group-data-[focus-within]/date-picker:ring-[3px] group-data-[focus-within]/date-picker:ring-ring/50",
                    "group-data-[invalid]/date-picker:border-destructive group-data-[invalid]/date-picker:ring-destructive/20 dark:group-data-[invalid]/date-picker:ring-destructive/40",
                    "group-data-[disabled]/date-picker:cursor-not-allowed group-data-[disabled]/date-picker:opacity-50",
                    "dark:bg-input/30",
                    className,
                ),
            )}
            data-slot="date-picker-trigger"
            {...props}
        >
            <DateInput className="flex flex-1 items-center gap-px" data-slot="date-picker-input">
                {segment => (
                    <DateSegment
                        className={cx(
                            "inline rounded px-0.5 py-0.5 text-sm tabular-nums caret-transparent outline-none",
                            "data-[placeholder]:text-muted-foreground",
                            "data-[focused]:bg-primary data-[focused]:text-primary-foreground",
                            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                            "data-[type=literal]:px-0 data-[type=literal]:text-muted-foreground",
                        )}
                        data-slot="date-picker-segment"
                        segment={segment}
                    />
                )}
            </DateInput>
            <AriaButton
                className={cx(
                    "ml-auto flex size-6 shrink-0 items-center justify-center rounded transition-colors outline-none",
                    "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
                    "data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                )}
                data-slot="date-picker-icon-button"
            >
                <IconCalendar aria-hidden="true" className="size-4 text-muted-foreground" />
            </AriaButton>
        </Group>
    );
}

function DatePickerContent({ className, ...props }: React.ComponentProps<typeof Popover>) {
    return (
        <Popover
            className={composeRenderProps(className as string | undefined, className =>
                cx(
                    "z-50 rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
                    "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                    "data-[placement=bottom]:slide-in-from-top-2 data-[placement=top]:slide-in-from-bottom-2",
                    className,
                ),
            )}
            data-slot="date-picker-content"
            offset={8}
            {...props}
        >
            <Dialog className="outline-none" data-slot="date-picker-dialog">
                <DatePickerCalendar />
            </Dialog>
        </Popover>
    );
}

function DatePickerCalendar({ className, ...props }: React.ComponentProps<typeof AriaCalendar>) {
    return (
        <AriaCalendar
            aria-label="Date"
            className={composeRenderProps(className, className =>
                cx(
                    "relative w-fit bg-popover p-3 [--cell-size:--spacing(8)]",
                    "rtl:[&_[data-slot=date-picker-next]>svg]:rotate-180 rtl:[&_[data-slot=date-picker-prev]>svg]:rotate-180",
                    className,
                ),
            )}
            data-slot="date-picker-calendar"
            {...props}
        >
            {/* Nav row */}
            <div
                className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 px-3 pt-3"
                data-slot="date-picker-nav"
            >
                <Button
                    className="size-(--cell-size) p-0 select-none"
                    data-slot="date-picker-prev"
                    size="icon"
                    slot="previous"
                    variant="ghost"
                >
                    <IconChevronLeft aria-hidden="true" className="size-4" />
                </Button>
                <Button
                    className="size-(--cell-size) p-0 select-none"
                    data-slot="date-picker-next"
                    size="icon"
                    slot="next"
                    variant="ghost"
                >
                    <IconChevronRight aria-hidden="true" className="size-4" />
                </Button>
            </div>

            {/* Month caption */}
            <div
                className="flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)"
                data-slot="date-picker-month-caption"
            >
                <Heading
                    className="text-sm font-medium select-none"
                    data-slot="date-picker-caption-label"
                />
            </div>

            {/* Grid */}
            <CalendarGrid
                className="w-full border-collapse [&_tbody_tr]:mt-2 [&_tbody_tr]:flex [&_tbody_tr]:w-full [&_td]:relative [&_td]:size-(--cell-size) [&_td]:p-0 [&_tr]:flex"
                data-slot="date-picker-grid"
                weekdayStyle="short"
            >
                <CalendarGridHeader className="flex" data-slot="date-picker-weekdays">
                    {day => (
                        <CalendarHeaderCell
                            className="flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none"
                            data-slot="date-picker-weekday"
                        >
                            {day}
                        </CalendarHeaderCell>
                    )}
                </CalendarGridHeader>
                <CalendarGridBody data-slot="date-picker-weeks">
                    {date => (
                        <CalendarCell
                            className={({ isSelected }) =>
                                cx(
                                    "flex aspect-square size-auto w-full min-w-(--cell-size) items-center justify-center rounded-md text-sm leading-none font-normal transition-colors outline-none select-none",
                                    "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
                                    "data-[focused]:relative data-[focused]:z-10",
                                    "data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
                                    "data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
                                    "data-[outside-month]:text-muted-foreground data-[outside-visible-range]:invisible",
                                    "data-[today]:bg-accent data-[today]:text-accent-foreground",
                                    "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
                                    isSelected &&
                                        "data-[today]:bg-primary data-[today]:text-primary-foreground",
                                )
                            }
                            data-slot="date-picker-day"
                            date={date}
                        />
                    )}
                </CalendarGridBody>
            </CalendarGrid>
        </AriaCalendar>
    );
}

export { DatePicker, DatePickerTrigger, DatePickerContent, DatePickerCalendar };
