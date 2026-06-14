import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Checkbox } from "@/components/ui/checkbox";

describe("Checkbox", () => {
    it("toggles on click and Space, and exposes the checkbox role", async () => {
        let user = userEvent.setup();
        render(<Checkbox aria-label="accept" />);
        let cb = screen.getByRole("checkbox", { name: "accept" });

        expect(cb).not.toBeChecked();
        await user.click(cb);
        expect(cb).toBeChecked();

        cb.focus();
        await user.keyboard(" ");
        expect(cb).not.toBeChecked();
    });

    it("honors defaultSelected", () => {
        render(<Checkbox aria-label="b" defaultSelected />);
        expect(screen.getByRole("checkbox", { name: "b" })).toBeChecked();
    });
});
