import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

describe("Input", () => {
    it("renders with data-slot='input'", () => {
        render(<Input aria-label="username" />);
        let input = screen.getByRole("textbox", { name: "username" });
        expect(input).toHaveAttribute("data-slot", "input");
    });

    it("accepts typed text", async () => {
        let user = userEvent.setup();
        render(<Input aria-label="search" />);
        let input = screen.getByRole("textbox", { name: "search" }) as HTMLInputElement;
        await user.type(input, "hello");
        expect(input.value).toBe("hello");
    });

    it("is not interactive when disabled", async () => {
        let user = userEvent.setup();
        render(<Input aria-label="locked" disabled />);
        let input = screen.getByRole("textbox", { name: "locked" }) as HTMLInputElement;
        expect(input).toBeDisabled();
        await user.type(input, "text");
        expect(input.value).toBe("");
    });

    it("passes aria-invalid through", () => {
        render(<Input aria-invalid="true" aria-label="bad" />);
        let input = screen.getByRole("textbox", { name: "bad" });
        expect(input).toHaveAttribute("aria-invalid", "true");
    });
});

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

describe("Label", () => {
    it("renders with data-slot='label'", () => {
        render(<Label>My label</Label>);
        let label = screen.getByText("My label");
        expect(label).toHaveAttribute("data-slot", "label");
    });

    it("associates with an input via htmlFor", () => {
        render(
            <>
                <Label htmlFor="fname">First name</Label>
                <Input id="fname" />
            </>,
        );
        // getByLabelText resolves htmlFor → id association
        let input = screen.getByLabelText("First name");
        expect(input).toBeInTheDocument();
        expect(input.tagName).toBe("INPUT");
    });
});

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

describe("Textarea", () => {
    it("renders with data-slot='textarea'", () => {
        render(<Textarea aria-label="notes" />);
        let ta = screen.getByRole("textbox", { name: "notes" });
        expect(ta).toHaveAttribute("data-slot", "textarea");
    });

    it("accepts typed text", async () => {
        let user = userEvent.setup();
        render(<Textarea aria-label="bio" />);
        let ta = screen.getByRole("textbox", { name: "bio" }) as HTMLTextAreaElement;
        await user.type(ta, "world");
        expect(ta.value).toBe("world");
    });

    it("is not editable when disabled", async () => {
        let user = userEvent.setup();
        render(<Textarea aria-label="readonly" disabled />);
        let ta = screen.getByRole("textbox", { name: "readonly" }) as HTMLTextAreaElement;
        expect(ta).toBeDisabled();
        await user.type(ta, "text");
        expect(ta.value).toBe("");
    });

    it("passes aria-invalid through", () => {
        render(<Textarea aria-invalid="true" aria-label="err" />);
        let ta = screen.getByRole("textbox", { name: "err" });
        expect(ta).toHaveAttribute("aria-invalid", "true");
    });
});

// ---------------------------------------------------------------------------
// NativeSelect
// ---------------------------------------------------------------------------

describe("NativeSelect", () => {
    it("renders a <select> with data-slot='native-select'", () => {
        render(
            <NativeSelect aria-label="fruit">
                <NativeSelectOption value="apple">Apple</NativeSelectOption>
                <NativeSelectOption value="banana">Banana</NativeSelectOption>
            </NativeSelect>,
        );
        let select = screen.getByRole("combobox", { name: "fruit" }) as HTMLSelectElement;
        expect(select).toHaveAttribute("data-slot", "native-select");
        expect(select.options).toHaveLength(2);
        expect(select.options[0].value).toBe("apple");
        expect(select.options[1].value).toBe("banana");
    });

    it("changes value when an option is selected", async () => {
        let user = userEvent.setup();
        render(
            <NativeSelect aria-label="color">
                <NativeSelectOption value="red">Red</NativeSelectOption>
                <NativeSelectOption value="blue">Blue</NativeSelectOption>
            </NativeSelect>,
        );
        let select = screen.getByRole("combobox", { name: "color" }) as HTMLSelectElement;
        expect(select.value).toBe("red");
        await user.selectOptions(select, "blue");
        expect(select.value).toBe("blue");
    });

    it("wraps with data-slot='native-select-wrapper'", () => {
        let { container } = render(
            <NativeSelect aria-label="size">
                <NativeSelectOption value="s">S</NativeSelectOption>
            </NativeSelect>,
        );
        expect(container.querySelector("[data-slot='native-select-wrapper']")).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// InputGroup
// ---------------------------------------------------------------------------

describe("InputGroup", () => {
    it("renders with data-slot='input-group' and role='group'", () => {
        render(
            <InputGroup aria-label="email field">
                <InputGroupAddon>@</InputGroupAddon>
                <InputGroupInput aria-label="email" />
            </InputGroup>,
        );
        let group = screen.getByRole("group", { name: "email field" });
        expect(group).toHaveAttribute("data-slot", "input-group");
    });

    it("contains a functional text input via InputGroupInput", async () => {
        let user = userEvent.setup();
        render(
            <InputGroup>
                <InputGroupAddon>$</InputGroupAddon>
                <InputGroupInput aria-label="amount" />
            </InputGroup>,
        );
        let input = screen.getByRole("textbox", { name: "amount" }) as HTMLInputElement;
        expect(input).toHaveAttribute("data-slot", "input-group-control");
        await user.type(input, "99");
        expect(input.value).toBe("99");
    });

    it("contains a functional textarea via InputGroupTextarea", async () => {
        let user = userEvent.setup();
        render(
            <InputGroup>
                <InputGroupTextarea aria-label="message" />
            </InputGroup>,
        );
        let ta = screen.getByRole("textbox", { name: "message" }) as HTMLTextAreaElement;
        expect(ta).toHaveAttribute("data-slot", "input-group-control");
        await user.type(ta, "hi");
        expect(ta.value).toBe("hi");
    });

    it("renders InputGroupText with data-slot='input-group-text'", () => {
        let { container } = render(
            <InputGroup>
                <InputGroupAddon>
                    <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput aria-label="url" />
            </InputGroup>,
        );
        expect(container.querySelector("[data-slot='input-group-text']")).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// ButtonGroup
// ---------------------------------------------------------------------------

describe("ButtonGroup", () => {
    it("renders with data-slot='button-group' and role='group'", () => {
        render(
            <ButtonGroup aria-label="actions">
                <Button>One</Button>
                <Button>Two</Button>
            </ButtonGroup>,
        );
        let group = screen.getByRole("group", { name: "actions" });
        expect(group).toHaveAttribute("data-slot", "button-group");
    });

    it("renders all child buttons", () => {
        render(
            <ButtonGroup aria-label="tools">
                <Button>Cut</Button>
                <Button>Copy</Button>
                <Button>Paste</Button>
            </ButtonGroup>,
        );
        expect(screen.getByRole("button", { name: "Cut" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Paste" })).toBeInTheDocument();
    });

    it("applies data-orientation when passed", () => {
        render(
            <ButtonGroup aria-label="vert" orientation="vertical">
                <Button>A</Button>
                <Button>B</Button>
            </ButtonGroup>,
        );
        let group = screen.getByRole("group", { name: "vert" });
        expect(group).toHaveAttribute("data-orientation", "vertical");
    });

    it("renders ButtonGroupText with data-slot='button-group-text'", () => {
        let { container } = render(
            <ButtonGroup aria-label="with text">
                <ButtonGroupText>Label</ButtonGroupText>
                <Button>Go</Button>
            </ButtonGroup>,
        );
        expect(container.querySelector("[data-slot='button-group-text']")).toBeInTheDocument();
    });

    it("renders ButtonGroupSeparator with role='separator'", () => {
        render(
            <ButtonGroup aria-label="sep group">
                <Button>Left</Button>
                <ButtonGroupSeparator />
                <Button>Right</Button>
            </ButtonGroup>,
        );
        expect(screen.getByRole("separator")).toBeInTheDocument();
    });
});
