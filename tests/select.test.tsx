import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function Fixture({ onValueChange }: { onValueChange: (v: string) => void }) {
    return (
        <Select onValueChange={onValueChange}>
            <SelectTrigger>
                <SelectValue placeholder="Pick a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
            </SelectContent>
        </Select>
    );
}

describe("Select", () => {
    it("opens and reports the chosen value via the shadcn value adapter", async () => {
        let user = userEvent.setup();
        let onValueChange = vi.fn();
        render(<Fixture onValueChange={onValueChange} />);

        await user.click(screen.getByRole("button"));
        let option = await screen.findByRole("option", { name: "Banana" });
        await user.click(option);

        expect(onValueChange).toHaveBeenCalledWith("banana");
    });
});
