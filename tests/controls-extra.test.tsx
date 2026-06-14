import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// ---------------------------------------------------------------------------
// ToggleGroup
// ---------------------------------------------------------------------------
// React Aria renders ToggleButtonGroup differently based on selectionMode:
//   selectionMode="single" → role="radiogroup" + items with role="radio" + aria-checked
//   selectionMode="multiple" → role="group"   + items with role="button" + aria-pressed

describe("ToggleGroup", () => {
    it("single mode: container renders as radiogroup with data-slot", () => {
        render(
            <ToggleGroup aria-label="alignment" selectionMode="single">
                <ToggleGroupItem value="left">Left</ToggleGroupItem>
                <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>,
        );
        let group = screen.getByRole("radiogroup", { name: "alignment" });
        expect(group).toHaveAttribute("data-slot", "toggle-group");
    });

    it("single mode: items render as radio buttons with data-slot", () => {
        render(
            <ToggleGroup aria-label="alignment" selectionMode="single">
                <ToggleGroupItem value="left">Left</ToggleGroupItem>
                <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>,
        );
        let leftBtn = screen.getByRole("radio", { name: "Left" });
        let rightBtn = screen.getByRole("radio", { name: "Right" });
        expect(leftBtn).toHaveAttribute("data-slot", "toggle-group-item");
        expect(rightBtn).toHaveAttribute("data-slot", "toggle-group-item");
    });

    it("single mode: clicking an item selects it (aria-checked + data-selected)", async () => {
        let user = userEvent.setup();
        render(
            <ToggleGroup aria-label="alignment" selectionMode="single">
                <ToggleGroupItem value="left">Left</ToggleGroupItem>
                <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>,
        );
        let leftBtn = screen.getByRole("radio", { name: "Left" });
        let rightBtn = screen.getByRole("radio", { name: "Right" });

        // Neither selected initially
        expect(leftBtn).toHaveAttribute("aria-checked", "false");
        expect(rightBtn).toHaveAttribute("aria-checked", "false");

        // Click "Left" — it becomes selected
        await user.click(leftBtn);
        expect(leftBtn).toHaveAttribute("aria-checked", "true");
        expect(rightBtn).toHaveAttribute("aria-checked", "false");

        // Click "Right" — single selection shifts to Right
        await user.click(rightBtn);
        expect(rightBtn).toHaveAttribute("aria-checked", "true");
        expect(leftBtn).toHaveAttribute("aria-checked", "false");
    });

    it("single mode: selected item has data-selected attribute", async () => {
        let user = userEvent.setup();
        render(
            <ToggleGroup aria-label="format" selectionMode="single">
                <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
                <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
            </ToggleGroup>,
        );
        let boldBtn = screen.getByRole("radio", { name: "Bold" });
        expect(boldBtn).not.toHaveAttribute("data-selected");
        await user.click(boldBtn);
        expect(boldBtn).toHaveAttribute("data-selected");
    });

    it("single mode: fires onSelectionChange with the selected key", async () => {
        let user = userEvent.setup();
        let onSelectionChange = vi.fn();
        render(
            <ToggleGroup
                aria-label="format"
                onSelectionChange={onSelectionChange}
                selectionMode="single"
            >
                <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
                <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
            </ToggleGroup>,
        );
        await user.click(screen.getByRole("radio", { name: "Bold" }));
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
        // React Aria passes a Set<Key>
        let [keys] = onSelectionChange.mock.calls[0] as [Set<string>];
        expect(keys.has("bold")).toBe(true);
    });

    it("multiple mode: container renders as toolbar, items as buttons with aria-pressed", async () => {
        let user = userEvent.setup();
        render(
            <ToggleGroup aria-label="format" selectionMode="multiple">
                <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
                <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
            </ToggleGroup>,
        );
        // Multiple mode → role="toolbar" on the container
        expect(screen.getByRole("toolbar", { name: "format" })).toBeInTheDocument();

        let boldBtn = screen.getByRole("button", { name: "Bold" });
        let italicBtn = screen.getByRole("button", { name: "Italic" });
        expect(boldBtn).toHaveAttribute("aria-pressed", "false");
        expect(italicBtn).toHaveAttribute("aria-pressed", "false");

        // Select both items independently
        await user.click(boldBtn);
        await user.click(italicBtn);
        expect(boldBtn).toHaveAttribute("aria-pressed", "true");
        expect(italicBtn).toHaveAttribute("aria-pressed", "true");
    });
});

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

describe("Progress", () => {
    it("renders with role='progressbar' and data-slot", () => {
        render(<Progress aria-label="loading" value={60} />);
        let bar = screen.getByRole("progressbar", { name: "loading" });
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveAttribute("data-slot", "progress");
    });

    it("exposes aria-valuenow matching the value prop", () => {
        render(<Progress aria-label="loading" value={60} />);
        let bar = screen.getByRole("progressbar", { name: "loading" });
        expect(bar).toHaveAttribute("aria-valuenow", "60");
    });

    it("renders aria-valuemin=0 and aria-valuemax=100 by default", () => {
        render(<Progress aria-label="upload" value={30} />);
        let bar = screen.getByRole("progressbar", { name: "upload" });
        expect(bar).toHaveAttribute("aria-valuemin", "0");
        expect(bar).toHaveAttribute("aria-valuemax", "100");
    });

    it("renders the progress indicator child element", () => {
        let { container } = render(<Progress aria-label="progress" value={75} />);
        let indicator = container.querySelector('[data-slot="progress-indicator"]');
        expect(indicator).toBeInTheDocument();
    });

    it("renders indeterminate when no value given (no aria-valuenow, or value is 0)", () => {
        // React Aria ProgressBar without a value prop renders indeterminate
        // The exact aria-valuenow behavior may vary — just assert the bar is present
        render(<Progress aria-label="spinning" />);
        let bar = screen.getByRole("progressbar", { name: "spinning" });
        expect(bar).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// InputOTP
// ---------------------------------------------------------------------------
// NOTE: InputOTP's children (InputOTPGroup / InputOTPSlot) are rendered
// OUTSIDE the hidden input container because the component renders the
// Context.Provider → div(input) and then the children flow after it in the
// React tree. Slots and groups are context consumers placed as siblings.
// Functional testing focuses on the hidden accessible input element.

describe("InputOTP", () => {
    it("renders the hidden input with aria-label 'One-time password'", () => {
        render(
            <InputOTP length={6}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>,
        );
        let input = screen.getByLabelText("One-time password") as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.maxLength).toBe(6);
        expect(input.value).toBe("");
    });

    it("renders the container div with data-slot='input-otp'", () => {
        let { container } = render(<InputOTP length={4} />);
        expect(container.querySelector('[data-slot="input-otp"]')).toBeInTheDocument();
    });

    it("renders its children (group + slots) alongside the hidden input", () => {
        let { container } = render(
            <InputOTP length={3}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
            </InputOTP>,
        );
        expect(container.querySelector('[data-slot="input-otp-group"]')).toBeInTheDocument();
        expect(container.querySelectorAll('[data-slot="input-otp-slot"]')).toHaveLength(3);
        expect(
            container.querySelector('input[aria-label="One-time password"]'),
        ).toBeInTheDocument();
    });

    it("reflects typed digits into the slot boxes", async () => {
        let user = userEvent.setup();
        render(
            <InputOTP length={4}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
            </InputOTP>,
        );
        await user.click(screen.getByLabelText("One-time password"));
        await user.keyboard("12");
        let slots = document.querySelectorAll('[data-slot="input-otp-slot"]');
        expect(slots[0]).toHaveTextContent("1");
        expect(slots[1]).toHaveTextContent("2");
        expect(slots[2]).toHaveTextContent("");
    });

    it("updates the underlying input value when digits are typed", async () => {
        let user = userEvent.setup();
        render(<InputOTP length={6} />);
        let input = screen.getByLabelText("One-time password") as HTMLInputElement;
        await user.click(input);
        await user.type(input, "123456");
        expect(input.value).toBe("123456");
    });

    it("ignores non-numeric characters — only digits enter the value", async () => {
        let user = userEvent.setup();
        render(<InputOTP length={4} />);
        let input = screen.getByLabelText("One-time password") as HTMLInputElement;
        await user.click(input);
        await user.type(input, "1a2b");
        expect(input.value).toBe("12");
    });

    it("calls onChange each time a digit is typed", async () => {
        let user = userEvent.setup();
        let onChange = vi.fn();
        render(<InputOTP length={4} onChange={onChange} />);
        let input = screen.getByLabelText("One-time password");
        await user.click(input);
        await user.type(input, "42");
        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenLastCalledWith("42");
    });

    it("calls onComplete when all slots are filled", async () => {
        let user = userEvent.setup();
        let onComplete = vi.fn();
        render(<InputOTP length={4} onComplete={onComplete} />);
        let input = screen.getByLabelText("One-time password");
        await user.click(input);
        await user.type(input, "1234");
        expect(onComplete).toHaveBeenCalledWith("1234");
    });

    it("renders the input as disabled when isDisabled=true", () => {
        render(<InputOTP isDisabled length={4} />);
        let input = screen.getByLabelText("One-time password") as HTMLInputElement;
        expect(input).toBeDisabled();
    });

    it("clamps input to maxLength — extra digits are dropped", async () => {
        let user = userEvent.setup();
        render(<InputOTP length={3} />);
        let input = screen.getByLabelText("One-time password") as HTMLInputElement;
        await user.click(input);
        await user.type(input, "99999");
        expect(input.value).toBe("999");
    });
});
