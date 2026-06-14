import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function Fixture() {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Open</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Make changes here.</DialogDescription>
            </DialogContent>
        </Dialog>
    );
}

describe("Dialog", () => {
    it("opens from the trigger and labels the dialog", async () => {
        let user = userEvent.setup();
        render(<Fixture />);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Open" }));

        let dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText("Edit profile")).toBeInTheDocument();
    });

    it("closes on Escape", async () => {
        let user = userEvent.setup();
        render(<Fixture />);
        await user.click(screen.getByRole("button", { name: "Open" }));
        await screen.findByRole("dialog");

        await user.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });
});
