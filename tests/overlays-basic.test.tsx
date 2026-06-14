import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------

function PopoverFixture() {
    return (
        <Popover>
            <PopoverTrigger>
                <Button>Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverTitle>Dimensions</PopoverTitle>
                <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
            </PopoverContent>
        </Popover>
    );
}

describe("Popover", () => {
    it("renders the trigger button", () => {
        render(<PopoverFixture />);
        expect(screen.getByRole("button", { name: "Open popover" })).toBeInTheDocument();
    });

    it("content is not in the DOM before the trigger is clicked", () => {
        render(<PopoverFixture />);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens a dialog on trigger click and shows content", async () => {
        let user = userEvent.setup();
        render(<PopoverFixture />);

        await user.click(screen.getByRole("button", { name: "Open popover" }));

        let dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText("Dimensions")).toBeInTheDocument();
        expect(screen.getByText("Set the dimensions for the layer.")).toBeInTheDocument();
    });

    it("closes the dialog on Escape", async () => {
        let user = userEvent.setup();
        render(<PopoverFixture />);

        await user.click(screen.getByRole("button", { name: "Open popover" }));
        await screen.findByRole("dialog");

        await user.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("closes when clicking outside", async () => {
        let user = userEvent.setup();
        render(
            <div>
                <PopoverFixture />
                <div data-testid="outside">outside</div>
            </div>,
        );

        await user.click(screen.getByRole("button", { name: "Open popover" }));
        await screen.findByRole("dialog");

        await user.click(screen.getByTestId("outside"));
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });
});

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

function TooltipFixture() {
    return (
        <Tooltip>
            <TooltipTrigger>
                <Button>Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Add to library</TooltipContent>
        </Tooltip>
    );
}

describe("Tooltip", () => {
    it("renders the trigger button", () => {
        render(<TooltipFixture />);
        expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
    });

    it("tooltip is not visible before focus", () => {
        render(<TooltipFixture />);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("shows a tooltip with role=tooltip when the trigger is focused", async () => {
        let user = userEvent.setup();
        render(<TooltipFixture />);

        await user.tab();

        let tooltip = await screen.findByRole("tooltip");
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent("Add to library");
    });

    it("hides the tooltip after blur", async () => {
        let user = userEvent.setup();
        render(<TooltipFixture />);

        await user.tab();
        await screen.findByRole("tooltip");

        // Tab away to remove focus
        await user.tab();
        await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
    });
});

// ---------------------------------------------------------------------------
// Collapsible
// ---------------------------------------------------------------------------

function CollapsibleFixture() {
    return (
        <Collapsible>
            <CollapsibleTrigger>Toggle</CollapsibleTrigger>
            <CollapsibleContent>Hidden content</CollapsibleContent>
        </Collapsible>
    );
}

describe("Collapsible", () => {
    it("renders the trigger button with data-slot", () => {
        render(<CollapsibleFixture />);
        let trigger = screen.getByRole("button", { name: "Toggle" });
        expect(trigger).toBeInTheDocument();
        expect(trigger).toHaveAttribute("data-slot", "collapsible-trigger");
    });

    it("wraps content in the collapsible data-slot container", () => {
        render(<CollapsibleFixture />);
        let content = document.querySelector("[data-slot='collapsible-content']");
        expect(content).toBeInTheDocument();
    });

    it("starts collapsed (aria-expanded=false)", () => {
        render(<CollapsibleFixture />);
        expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
            "aria-expanded",
            "false",
        );
    });

    it("expands on click (aria-expanded=true, content visible)", async () => {
        let user = userEvent.setup();
        render(<CollapsibleFixture />);

        let trigger = screen.getByRole("button", { name: "Toggle" });
        await user.click(trigger);

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByText("Hidden content")).toBeVisible();
    });

    it("collapses again on second click", async () => {
        let user = userEvent.setup();
        render(<CollapsibleFixture />);

        let trigger = screen.getByRole("button", { name: "Toggle" });
        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "true");

        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
});
