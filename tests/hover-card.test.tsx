import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

describe("HoverCard", () => {
    it("is non-modal: renders content without a focus-trapping dialog", async () => {
        render(
            <HoverCard defaultOpen>
                <HoverCardTrigger>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href="#">@racket-ui</a>
                </HoverCardTrigger>
                <HoverCardContent>Bio content</HoverCardContent>
            </HoverCard>,
        );

        await waitFor(() => expect(document.body.textContent).toContain("Bio content"), {
            timeout: 2000,
        });
        // The fix: a hover card is non-modal and must not capture focus. React
        // Aria's Popover focuses its container on open; the component hands focus
        // back, so focus must NOT remain inside the hover card content.
        let content = document.querySelector('[data-slot="hover-card-content"]')!;
        await waitFor(() => expect(content.contains(document.activeElement)).toBe(false));
    });
});
