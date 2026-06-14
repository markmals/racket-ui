"use client";

// Classification: B — React Aria Calendar / RangeCalendar with compatibility
// props for shadcn-style visuals, month count, outside days, and button variant.

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
    Calendar as AriaCalendar,
    CalendarCell as AriaCalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    Heading,
    RangeCalendar as AriaRangeCalendar,
    composeRenderProps,
    type CalendarCellProps as AriaCalendarCellProps,
    type CalendarProps as AriaCalendarProps,
    type DateValue,
    type RangeCalendarProps as AriaRangeCalendarProps,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import { cx } from "@/lib/cva";

type CalendarButtonVariant = React.ComponentProps<typeof Button>["variant"];

type CalendarClassNames = Partial<{
    root: string;
    months: string;
    month: string;
    nav: string;
    buttonPrevious: string;
    buttonNext: string;
    monthCaption: string;
    captionLabel: string;
    table: string;
    weekdays: string;
    weekday: string;
    week: string;
    day: string;
}>;

type CalendarSharedProps = {
    buttonVariant?: CalendarButtonVariant;
    classNames?: CalendarClassNames;
    numberOfMonths?: number;
    showOutsideDays?: boolean;
};

export interface CalendarProps<T extends DateValue = DateValue>
    extends Omit<AriaCalendarProps<T>, "children">, CalendarSharedProps {}

export interface RangeCalendarProps<T extends DateValue = DateValue>
    extends Omit<AriaRangeCalendarProps<T>, "children">, CalendarSharedProps {}

export interface CalendarDayButtonProps extends AriaCalendarCellProps {
    range?: boolean;
    showOutsideDays?: boolean;
}

function getVisibleMonths(numberOfMonths?: number, visibleDuration?: { months?: number }) {
    return Math.max(1, numberOfMonths ?? visibleDuration?.months ?? 1);
}

function CalendarRoot({
    classNames,
    buttonVariant,
    numberOfMonths = 1,
    showOutsideDays = true,
    range = false,
}: Required<Pick<CalendarSharedProps, "buttonVariant">> &
    Omit<CalendarSharedProps, "buttonVariant"> & {
        range?: boolean;
    }) {
    let months = Array.from({ length: Math.max(1, numberOfMonths) });

    return (
        <>
            <div
                className={cx(
                    "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
                    classNames?.nav,
                )}
                data-slot="calendar-nav"
            >
                <Button
                    className={cx("size-(--cell-size) p-0 select-none", classNames?.buttonPrevious)}
                    data-slot="calendar-previous"
                    size="icon"
                    slot="previous"
                    variant={buttonVariant}
                >
                    <IconChevronLeft aria-hidden="true" className="size-4" />
                </Button>
                <Button
                    className={cx("size-(--cell-size) p-0 select-none", classNames?.buttonNext)}
                    data-slot="calendar-next"
                    size="icon"
                    slot="next"
                    variant={buttonVariant}
                >
                    <IconChevronRight aria-hidden="true" className="size-4" />
                </Button>
            </div>
            <div
                className={cx(
                    "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
                    classNames?.monthCaption,
                )}
                data-slot="calendar-month-caption"
            >
                <Heading
                    className={cx("text-sm font-medium select-none", classNames?.captionLabel)}
                    data-slot="calendar-caption-label"
                />
            </div>
            <div
                className={cx("relative flex flex-col gap-4 md:flex-row", classNames?.months)}
                data-slot="calendar-months"
            >
                {months.map((_, index) => (
                    <div
                        className={cx("flex w-full flex-col gap-4", classNames?.month)}
                        data-slot="calendar-month"
                        key={index}
                    >
                        <CalendarGrid
                            className={cx(
                                "w-full border-collapse [&_tbody_tr]:mt-2 [&_tbody_tr]:flex [&_tbody_tr]:w-full [&_td]:relative [&_td]:size-(--cell-size) [&_td]:p-0 [&_tr]:flex",
                                classNames?.table,
                            )}
                            data-slot="calendar-grid"
                            offset={index === 0 ? undefined : { months: index }}
                            weekdayStyle="short"
                        >
                            <CalendarGridHeader
                                className={cx("flex", classNames?.weekdays)}
                                data-slot="calendar-weekdays"
                            >
                                {day => (
                                    <CalendarHeaderCell
                                        className={cx(
                                            "flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none",
                                            classNames?.weekday,
                                        )}
                                        data-slot="calendar-weekday"
                                    >
                                        {day}
                                    </CalendarHeaderCell>
                                )}
                            </CalendarGridHeader>
                            <CalendarGridBody
                                className={classNames?.week}
                                data-slot="calendar-weeks"
                            >
                                {date => (
                                    <CalendarDayButton
                                        className={classNames?.day}
                                        date={date}
                                        range={range}
                                        showOutsideDays={showOutsideDays}
                                    />
                                )}
                            </CalendarGridBody>
                        </CalendarGrid>
                    </div>
                ))}
            </div>
        </>
    );
}

function Calendar<T extends DateValue>({
    className,
    classNames,
    buttonVariant = "ghost",
    numberOfMonths,
    showOutsideDays = true,
    visibleDuration,
    ...props
}: CalendarProps<T>) {
    let months = getVisibleMonths(numberOfMonths, visibleDuration);

    return (
        <AriaCalendar
            aria-label={props["aria-label"] ?? "Calendar"}
            className={composeRenderProps(className, className =>
                cx(
                    "group/calendar relative w-fit bg-background p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
                    "rtl:[&_[data-slot=calendar-next]>svg]:rotate-180 rtl:[&_[data-slot=calendar-previous]>svg]:rotate-180",
                    classNames?.root,
                    className,
                ),
            )}
            data-slot="calendar"
            visibleDuration={visibleDuration ?? { months }}
            {...props}
        >
            <CalendarRoot
                buttonVariant={buttonVariant}
                classNames={classNames}
                numberOfMonths={months}
                showOutsideDays={showOutsideDays}
            />
        </AriaCalendar>
    );
}

function RangeCalendar<T extends DateValue>({
    className,
    classNames,
    buttonVariant = "ghost",
    numberOfMonths,
    showOutsideDays = true,
    visibleDuration,
    ...props
}: RangeCalendarProps<T>) {
    let months = getVisibleMonths(numberOfMonths, visibleDuration);

    return (
        <AriaRangeCalendar
            aria-label={props["aria-label"] ?? "Date range"}
            className={composeRenderProps(className, className =>
                cx(
                    "group/calendar relative w-fit bg-background p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
                    "rtl:[&_[data-slot=calendar-next]>svg]:rotate-180 rtl:[&_[data-slot=calendar-previous]>svg]:rotate-180",
                    classNames?.root,
                    className,
                ),
            )}
            data-slot="range-calendar"
            visibleDuration={visibleDuration ?? { months }}
            {...props}
        >
            <CalendarRoot
                buttonVariant={buttonVariant}
                classNames={classNames}
                numberOfMonths={months}
                range
                showOutsideDays={showOutsideDays}
            />
        </AriaRangeCalendar>
    );
}

function CalendarDayButton({
    className,
    range = false,
    showOutsideDays = true,
    ...props
}: CalendarDayButtonProps) {
    return (
        <AriaCalendarCell
            className={composeRenderProps(className, (className, renderProps) =>
                cx(
                    "flex aspect-square size-auto w-full min-w-(--cell-size) items-center justify-center rounded-md text-sm leading-none font-normal transition-colors outline-none select-none",
                    // Gate hover styling to non-selected cells so it never overrides the
                    // selected/range background while leaving white selected-text behind
                    // (which produced invisible white-on-light text mid range-select).
                    "data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50 data-[focused]:relative data-[focused]:z-10 not-data-[selected]:data-[hovered]:bg-accent not-data-[selected]:data-[hovered]:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50 data-[outside-month]:text-muted-foreground data-[outside-visible-range]:invisible data-[outside-month]:data-[selected]:text-muted-foreground",
                    "not-data-[selected]:data-[today]:bg-accent not-data-[selected]:data-[today]:text-accent-foreground dark:not-data-[selected]:data-[hovered]:text-accent-foreground",
                    !showOutsideDays && "data-[outside-month]:invisible",
                    range
                        ? "data-[selected]:rounded-none data-[selected]:bg-accent data-[selected]:text-accent-foreground data-[selection-end]:rounded-md data-[selection-end]:rounded-r-md data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-start]:rounded-md data-[selection-start]:rounded-l-md data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground"
                        : "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
                    renderProps.isSelected &&
                        !range &&
                        "data-[today]:bg-primary data-[today]:text-primary-foreground",
                    className,
                ),
            )}
            data-slot="calendar-day-button"
            {...props}
        />
    );
}

export { Calendar, CalendarDayButton, RangeCalendar };
