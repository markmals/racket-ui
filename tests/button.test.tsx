import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
    it("renders with data-slot and variant/size attributes", () => {
        render(
            <Button size="sm" variant="secondary">
                Hi
            </Button>,
        );
        let btn = screen.getByRole("button", { name: "Hi" });
        expect(btn).toHaveAttribute("data-slot", "button");
        expect(btn).toHaveAttribute("data-variant", "secondary");
        expect(btn).toHaveAttribute("data-size", "sm");
    });

    it("fires onPress on click and keyboard (Enter / Space)", async () => {
        let user = userEvent.setup();
        let onPress = vi.fn();
        render(<Button onPress={onPress}>Go</Button>);
        let btn = screen.getByRole("button", { name: "Go" });

        await user.click(btn);
        btn.focus();
        await user.keyboard("{Enter}");
        await user.keyboard(" ");

        expect(onPress).toHaveBeenCalledTimes(3);
    });

    it("does not fire when disabled", async () => {
        let user = userEvent.setup();
        let onPress = vi.fn();
        render(
            <Button isDisabled onPress={onPress}>
                X
            </Button>,
        );
        let btn = screen.getByRole("button", { name: "X" });
        expect(btn).toBeDisabled();
        await user.click(btn);
        expect(onPress).not.toHaveBeenCalled();
    });
});
