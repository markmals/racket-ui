import { parseDate, Time } from "@internationalized/date";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DatePicker, DatePickerTrigger, DatePickerContent } from "@/components/ui/date-picker";
import {
    DateRangePicker,
    DateRangePickerField,
    DateRangePickerGroup,
    DateRangePickerInput,
    DateRangePickerButton,
    DateRangePickerContent,
} from "@/components/ui/date-range-picker";
import { TimeField, TimeFieldInput } from "@/components/ui/time-field";

// ---------------------------------------------------------------------------
// DatePicker
// ---------------------------------------------------------------------------

describe("DatePicker", () => {
    it("renders with data-slot and a group containing date segments", () => {
        render(
            <DatePicker value={parseDate("2024-01-15")}>
                <DatePickerTrigger />
            </DatePicker>,
        );

        // The trigger group renders with the data-slot
        let trigger = document.querySelector("[data-slot='date-picker-trigger']");
        expect(trigger).toBeInTheDocument();

        // DateInput/segments appear (role="group" wraps the segments in RAC)
        let groups = screen.getAllByRole("group");
        expect(groups.length).toBeGreaterThanOrEqual(1);
    });

    it("renders spinbutton segments for month/day/year", () => {
        render(
            <DatePicker value={parseDate("2024-01-15")}>
                <DatePickerTrigger />
            </DatePicker>,
        );

        let spinbuttons = screen.getAllByRole("spinbutton");
        // A date has at least 3 segments: month, day, year
        expect(spinbuttons.length).toBeGreaterThanOrEqual(3);
    });

    it("shows the correct year segment value", () => {
        render(
            <DatePicker value={parseDate("2024-01-15")}>
                <DatePickerTrigger />
            </DatePicker>,
        );

        // The year segment should display 2024
        expect(screen.getByText("2024")).toBeInTheDocument();
    });

    it("opens a dialog (calendar) when the icon button is clicked", async () => {
        let user = userEvent.setup();
        render(
            <DatePicker value={parseDate("2024-01-15")}>
                <DatePickerTrigger />
                <DatePickerContent />
            </DatePicker>,
        );

        // Before clicking, no dialog
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        // The calendar icon button is inside the trigger
        let iconBtn = document.querySelector(
            "[data-slot='date-picker-icon-button']",
        ) as HTMLElement;
        expect(iconBtn).toBeInTheDocument();
        await user.click(iconBtn);

        // A dialog (popover > dialog) should appear containing the calendar
        let dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();
    });

    it("closes the calendar dialog with Escape", async () => {
        let user = userEvent.setup();
        render(
            <DatePicker value={parseDate("2024-01-15")}>
                <DatePickerTrigger />
                <DatePickerContent />
            </DatePicker>,
        );

        let iconBtn = document.querySelector(
            "[data-slot='date-picker-icon-button']",
        ) as HTMLElement;
        await user.click(iconBtn);
        await screen.findByRole("dialog");

        await user.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });
});

// ---------------------------------------------------------------------------
// DateRangePicker
// ---------------------------------------------------------------------------

describe("DateRangePicker (DateRangePickerField convenience component)", () => {
    it("renders with data-slot on the root and the group", () => {
        render(
            <DateRangePickerField
                label="Booking window"
                value={{
                    start: parseDate("2024-01-15"),
                    end: parseDate("2024-01-22"),
                }}
            />,
        );

        expect(document.querySelector("[data-slot='date-range-picker']")).toBeInTheDocument();
        expect(document.querySelector("[data-slot='date-range-picker-group']")).toBeInTheDocument();
    });

    it("renders spinbutton segments for both start and end dates", () => {
        render(
            <DateRangePickerField
                value={{
                    start: parseDate("2024-01-15"),
                    end: parseDate("2024-01-22"),
                }}
            />,
        );

        // Two date inputs × 3 segments each = at least 6 spinbuttons
        let spinbuttons = screen.getAllByRole("spinbutton");
        expect(spinbuttons.length).toBeGreaterThanOrEqual(6);
    });

    it("renders the label when provided", () => {
        render(
            <DateRangePickerField
                label="Date range"
                value={{
                    start: parseDate("2024-01-15"),
                    end: parseDate("2024-01-22"),
                }}
            />,
        );
        expect(screen.getByText("Date range")).toBeInTheDocument();
    });

    it("opens a dialog (range calendar) when the calendar button is clicked", async () => {
        let user = userEvent.setup();
        render(
            <DateRangePickerField
                value={{
                    start: parseDate("2024-01-15"),
                    end: parseDate("2024-01-22"),
                }}
            />,
        );

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        let calBtn = document.querySelector(
            "[data-slot='date-range-picker-button']",
        ) as HTMLElement;
        expect(calBtn).toBeInTheDocument();
        await user.click(calBtn);

        let dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();
    });

    it("closes the range calendar dialog with Escape", async () => {
        let user = userEvent.setup();
        render(
            <DateRangePickerField
                value={{
                    start: parseDate("2024-01-15"),
                    end: parseDate("2024-01-22"),
                }}
            />,
        );

        let calBtn = document.querySelector(
            "[data-slot='date-range-picker-button']",
        ) as HTMLElement;
        await user.click(calBtn);
        await screen.findByRole("dialog");

        await user.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });
});

describe("DateRangePicker (manual composition)", () => {
    it("renders composed parts correctly", () => {
        render(
            <DateRangePicker
                value={{
                    start: parseDate("2024-03-01"),
                    end: parseDate("2024-03-31"),
                }}
            >
                <DateRangePickerGroup>
                    <DateRangePickerInput slot="start" />
                    <span aria-hidden="true">–</span>
                    <DateRangePickerInput slot="end" />
                    <DateRangePickerButton />
                </DateRangePickerGroup>
                <DateRangePickerContent />
            </DateRangePicker>,
        );

        expect(document.querySelector("[data-slot='date-range-picker']")).toBeInTheDocument();
        expect(document.querySelector("[data-slot='date-range-picker-group']")).toBeInTheDocument();
        let spinbuttons = screen.getAllByRole("spinbutton");
        expect(spinbuttons.length).toBeGreaterThanOrEqual(6);
    });
});

// ---------------------------------------------------------------------------
// TimeField
// ---------------------------------------------------------------------------

describe("TimeField", () => {
    it("renders with data-slot on the root", () => {
        render(
            <TimeField value={new Time(10, 30)}>
                <TimeFieldInput />
            </TimeField>,
        );

        expect(document.querySelector("[data-slot='time-field']")).toBeInTheDocument();
        expect(document.querySelector("[data-slot='time-field-input']")).toBeInTheDocument();
    });

    it("renders spinbutton segments for hours and minutes", () => {
        render(
            <TimeField value={new Time(10, 30)}>
                <TimeFieldInput />
            </TimeField>,
        );

        // At minimum: hour and minute spinbuttons (and AM/PM if 12h locale)
        let spinbuttons = screen.getAllByRole("spinbutton");
        expect(spinbuttons.length).toBeGreaterThanOrEqual(2);
    });

    it("renders time segment slots", () => {
        render(
            <TimeField value={new Time(10, 30)}>
                <TimeFieldInput />
            </TimeField>,
        );

        let segments = document.querySelectorAll("[data-slot='time-field-segment']");
        expect(segments.length).toBeGreaterThanOrEqual(2);
    });

    it("renders a group role wrapping the time input", () => {
        render(
            <TimeField aria-label="Appointment time" value={new Time(10, 30)}>
                <TimeFieldInput />
            </TimeField>,
        );

        // The TimeField root exposes a group role with its aria-label
        let group = screen.getByRole("group", { name: "Appointment time" });
        expect(group).toBeInTheDocument();
    });

    it("can be rendered in disabled state", () => {
        render(
            <TimeField aria-label="Disabled time" isDisabled value={new Time(10, 30)}>
                <TimeFieldInput />
            </TimeField>,
        );

        // The input group should reflect the disabled state via data attribute
        let input = document.querySelector("[data-slot='time-field-input']");
        expect(input).toBeInTheDocument();
        // Spinbuttons are aria-disabled when the field is disabled
        let spinbuttons = screen.getAllByRole("spinbutton");
        // At least one spinbutton should be disabled/aria-disabled
        let hasDisabled = spinbuttons.some(
            s => s.getAttribute("aria-disabled") === "true" || (s as HTMLInputElement).disabled,
        );
        expect(hasDisabled).toBe(true);
    });
});
