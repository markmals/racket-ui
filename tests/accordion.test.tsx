import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

describe("Accordion", () => {
    it("expands and collapses an item (single, collapsible)", async () => {
        let user = userEvent.setup();
        render(
            <Accordion collapsible type="single">
                <AccordionItem value="a">
                    <AccordionTrigger>Question</AccordionTrigger>
                    <AccordionContent>Answer</AccordionContent>
                </AccordionItem>
            </Accordion>,
        );
        let trigger = screen.getByRole("button", { name: "Question" });
        expect(trigger).toHaveAttribute("aria-expanded", "false");

        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByText("Answer")).toBeVisible();

        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
});
