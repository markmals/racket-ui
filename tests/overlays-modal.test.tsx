import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Sheet
// ---------------------------------------------------------------------------

function SheetFixture({ side }: { side?: "left" | "right" | "top" | "bottom" }) {
    return (
        <Sheet>
            <SheetTrigger>
                <Button>Open Sheet</Button>
            </SheetTrigger>
            <SheetContent side={side}>
                <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>Sheet description text</SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}

describe("Sheet", () => {
    it("is closed on initial render", () => {
        render(<SheetFixture />);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens when the trigger is clicked and shows title", async () => {
        let user = userEvent.setup();
        render(<SheetFixture />);

        await user.click(screen.getByRole("button", { name: "Open Sheet" }));

        let dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText("Sheet Title")).toBeInTheDocument();
        expect(screen.getByText("Sheet description text")).toBeInTheDocument();
    });

    it("closes on Escape", async () => {
        let user = userEvent.setup();
        render(<SheetFixture />);

        await user.click(screen.getByRole("button", { name: "Open Sheet" }));
        await screen.findByRole("dialog");

        await user.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("closes when the X close button is pressed", async () => {
        let user = userEvent.setup();
        render(<SheetFixture />);

        await user.click(screen.getByRole("button", { name: "Open Sheet" }));
        await screen.findByRole("dialog");

        let closeBtn = screen.getByRole("button", { name: "Close" });
        await user.click(closeBtn);

        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("opens from the left side", async () => {
        let user = userEvent.setup();
        render(<SheetFixture side="left" />);

        await user.click(screen.getByRole("button", { name: "Open Sheet" }));
        let dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// AlertDialog
// ---------------------------------------------------------------------------

function AlertDialogFixture({
    onAction,
    onCancel,
}: {
    onAction?: () => void;
    onCancel?: () => void;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onPress={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onPress={onAction}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

describe("AlertDialog", () => {
    it("is closed on initial render", () => {
        render(<AlertDialogFixture />);
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });

    it("opens when the trigger is clicked and shows title", async () => {
        let user = userEvent.setup();
        render(<AlertDialogFixture />);

        await user.click(screen.getByRole("button", { name: "Delete" }));

        let dialog = await screen.findByRole("alertdialog");
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText("Are you sure?")).toBeInTheDocument();
        expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    });

    it("closes when Cancel is clicked", async () => {
        let user = userEvent.setup();
        render(<AlertDialogFixture />);

        await user.click(screen.getByRole("button", { name: "Delete" }));
        await screen.findByRole("alertdialog");

        await user.click(screen.getByRole("button", { name: "Cancel" }));

        await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    });

    it("fires onAction and closes when Continue is clicked", async () => {
        let actionFired = false;
        let user = userEvent.setup();
        render(
            <AlertDialogFixture
                onAction={() => {
                    actionFired = true;
                }}
            />,
        );

        await user.click(screen.getByRole("button", { name: "Delete" }));
        await screen.findByRole("alertdialog");

        await user.click(screen.getByRole("button", { name: "Continue" }));

        expect(actionFired).toBe(true);
        await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    });

    it("closes on Escape", async () => {
        let user = userEvent.setup();
        render(<AlertDialogFixture />);

        await user.click(screen.getByRole("button", { name: "Delete" }));
        await screen.findByRole("alertdialog");

        await user.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    });
});

// ---------------------------------------------------------------------------
// Drawer (vaul)
// ---------------------------------------------------------------------------

function DrawerFixture() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button>Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Drawer Title</DrawerTitle>
                    <DrawerDescription>Drawer description text</DrawerDescription>
                </DrawerHeader>
                <DrawerClose asChild>
                    <Button>Close Drawer</Button>
                </DrawerClose>
            </DrawerContent>
        </Drawer>
    );
}

describe("Drawer", () => {
    it("renders the trigger button before opening", () => {
        render(<DrawerFixture />);
        expect(screen.getByRole("button", { name: "Open Drawer" })).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens when the trigger is clicked and renders drawer content", async () => {
        let user = userEvent.setup();
        render(<DrawerFixture />);

        await user.click(screen.getByRole("button", { name: "Open Drawer" }));

        let dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText("Drawer Title")).toBeInTheDocument();
        expect(screen.getByText("Drawer description text")).toBeInTheDocument();
    });

    it("has drawer-content data-slot when open", async () => {
        let user = userEvent.setup();
        render(<DrawerFixture />);

        await user.click(screen.getByRole("button", { name: "Open Drawer" }));
        await screen.findByRole("dialog");

        expect(document.querySelector("[data-slot='drawer-content']")).toBeInTheDocument();
    });

    it("transitions to closed state when the close button is clicked", async () => {
        let user = userEvent.setup();
        render(<DrawerFixture />);

        await user.click(screen.getByRole("button", { name: "Open Drawer" }));
        let dialog = await screen.findByRole("dialog");
        expect(dialog).toHaveAttribute("data-state", "open");

        await user.click(screen.getByRole("button", { name: "Close Drawer" }));

        // vaul keeps the element in the DOM with data-state="closed" in jsdom
        await waitFor(() => expect(dialog).toHaveAttribute("data-state", "closed"));
    });
});
