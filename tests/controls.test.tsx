import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";

describe("Switch", () => {
    it("toggles on click", async () => {
        let user = userEvent.setup();
        render(<Switch aria-label="wifi" />);
        let sw = screen.getByRole("switch", { name: "wifi" });
        expect(sw).not.toBeChecked();
        await user.click(sw);
        expect(sw).toBeChecked();
    });
});

describe("RadioGroup", () => {
    it("selects a radio and is single-select", async () => {
        let user = userEvent.setup();
        render(
            <RadioGroup aria-label="g">
                <RadioGroupItem value="a">A</RadioGroupItem>
                <RadioGroupItem value="b">B</RadioGroupItem>
            </RadioGroup>,
        );
        let a = screen.getByRole("radio", { name: "A" });
        let b = screen.getByRole("radio", { name: "B" });
        await user.click(a);
        expect(a).toBeChecked();
        await user.click(b);
        expect(b).toBeChecked();
        expect(a).not.toBeChecked();
    });
});

describe("Toggle", () => {
    it("toggles aria-pressed", async () => {
        let user = userEvent.setup();
        render(<Toggle aria-label="bold">B</Toggle>);
        let t = screen.getByRole("button", { name: "bold" });
        expect(t).toHaveAttribute("aria-pressed", "false");
        await user.click(t);
        expect(t).toHaveAttribute("aria-pressed", "true");
    });
});

describe("Slider", () => {
    it("exposes value via the slider role (native range input)", () => {
        render(<Slider aria-label="vol" defaultValue={[40]} />);
        let s = screen.getByRole("slider", { name: "vol" }) as HTMLInputElement;
        expect(s.value).toBe("40");
    });
});
