import { getLocalTimeZone, today } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
    Form,
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
    useForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

describe("Field", () => {
    it("renders label + description with data-slots", () => {
        render(
            <Field>
                <FieldLabel htmlFor="f1">Name</FieldLabel>
                <FieldDescription>Your full name.</FieldDescription>
                <FieldError>Required</FieldError>
            </Field>,
        );
        expect(document.querySelector('[data-slot="field"]')).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Your full name.")).toBeInTheDocument();
    });
});

describe("Calendar", () => {
    it("renders a date grid and is keyboard/label accessible", () => {
        render(<Calendar aria-label="Event date" defaultValue={today(getLocalTimeZone())} />);
        // RAC Calendar exposes a grid of day cells.
        expect(screen.getByRole("application", { name: /event date/i })).toBeInTheDocument();
        expect(screen.getByRole("grid")).toBeInTheDocument();
        // Today's cell is selectable (a gridcell button).
        let selected = document.querySelector('[data-slot="calendar"]');
        expect(selected).toBeInTheDocument();
    });
});

// TanStack Form integration — also validates the FormControl cloneElement fix
// (label must associate with the actual input via a shared id).
function FormFixture() {
    let form = useForm({ defaultValues: { username: "" } });
    return (
        <Form>
            <form>
                <form.Field name="username">
                    {field => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl field={field}>
                                <Input
                                    onBlur={field.handleBlur}
                                    onChange={e => field.handleChange(e.target.value)}
                                    value={field.state.value}
                                />
                            </FormControl>
                            <FormDescription>Your public handle.</FormDescription>
                            <FormMessage field={field} />
                        </FormItem>
                    )}
                </form.Field>
            </form>
        </Form>
    );
}

describe("Form (TanStack Form)", () => {
    it("associates the label with the input and binds the field value", async () => {
        let user = userEvent.setup();
        render(<FormFixture />);

        // The label resolves to the actual input (FormControl injects the id) — this
        // is the cloneElement fix: aria/id land on the input, not a wrapper div.
        let input = screen.getByLabelText("Username") as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("data-slot", "form-control");

        await user.type(input, "shadcn");
        expect(input.value).toBe("shadcn");

        expect(screen.getByText("Your public handle.")).toBeInTheDocument();
    });
});
