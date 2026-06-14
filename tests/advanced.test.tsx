import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ColorPicker } from "@/components/ui/color-picker";
import { DropZone } from "@/components/ui/drop-zone";
import { Toaster, toast } from "@/components/ui/sonner";
import { Tree, TreeItem, TreeItemContent } from "@/components/ui/tree";

// ---------------------------------------------------------------------------
// Tree
// ---------------------------------------------------------------------------

/**
 * A simple fixture with a branch node (Documents) and a leaf node (Settings).
 * React Aria Tree requires items to have textValue when children are not plain
 * strings.
 */
function TreeFixture() {
    return (
        <Tree aria-label="File tree">
            <TreeItem id="docs" textValue="Documents">
                <TreeItemContent>Documents</TreeItemContent>
                <TreeItem id="readme" textValue="README">
                    <TreeItemContent>README</TreeItemContent>
                </TreeItem>
                <TreeItem id="notes" textValue="Notes">
                    <TreeItemContent>Notes</TreeItemContent>
                </TreeItem>
            </TreeItem>
            <TreeItem id="settings" textValue="Settings">
                <TreeItemContent>Settings</TreeItemContent>
            </TreeItem>
        </Tree>
    );
}

describe("Tree", () => {
    // React Aria renders Tree as role="treegrid" and TreeItems as role="row".
    // The expand button's accessible name includes the row label (e.g. "Expand Documents").

    it("renders the treegrid container with aria-label", () => {
        render(<TreeFixture />);
        // React Aria uses role="treegrid" for Tree
        expect(screen.getByRole("treegrid", { name: "File tree" })).toBeInTheDocument();
    });

    it("renders top-level items as rows", () => {
        render(<TreeFixture />);
        // React Aria TreeItem renders as role="row"
        expect(screen.getByRole("row", { name: "Documents" })).toBeInTheDocument();
        expect(screen.getByRole("row", { name: "Settings" })).toBeInTheDocument();
    });

    it("has the data-slot attribute on the tree container", () => {
        render(<TreeFixture />);
        expect(document.querySelector("[data-slot='tree']")).toBeInTheDocument();
    });

    it("has data-slot on tree items", () => {
        render(<TreeFixture />);
        let items = document.querySelectorAll("[data-slot='tree-item']");
        expect(items.length).toBeGreaterThanOrEqual(1);
    });

    it("expands a branch item on clicking the expand button", async () => {
        let user = userEvent.setup();
        render(<TreeFixture />);

        // The expand button for the "Documents" row is labelled "Expand Documents"
        // (React Aria composes the label from the button's own label + the row id)
        let expandBtn = screen.getByRole("button", { name: /expand/i });
        expect(expandBtn).toBeInTheDocument();

        await user.click(expandBtn);

        // After expanding, child rows appear
        await waitFor(() => {
            expect(screen.getByRole("row", { name: "README" })).toBeInTheDocument();
        });
    });

    it("collapses an expanded branch item on second click", async () => {
        let user = userEvent.setup();
        render(<TreeFixture />);

        let expandBtn = screen.getByRole("button", { name: /expand/i });
        await user.click(expandBtn);
        await waitFor(() =>
            expect(screen.getByRole("row", { name: "README" })).toBeInTheDocument(),
        );

        // After expanding, the button label changes to "Collapse ..."
        let collapseBtn = screen.getByRole("button", { name: /collapse/i });
        await user.click(collapseBtn);

        await waitFor(() =>
            expect(screen.queryByRole("row", { name: "README" })).not.toBeInTheDocument(),
        );
    });
});

// ---------------------------------------------------------------------------
// ColorPicker
// ---------------------------------------------------------------------------

describe("ColorPicker", () => {
    it("renders a trigger button showing the initial hex value", () => {
        render(<ColorPicker defaultValue="#ff0000" />);

        // The trigger button should show the hex value
        let trigger = screen.getByRole("button");
        expect(trigger).toBeInTheDocument();
        expect(trigger).toHaveAttribute("data-slot", "color-picker-trigger");

        // Should display the hex string
        expect(trigger).toHaveTextContent(/#ff0000/i);
    });

    it("renders the color swatch inside the trigger", () => {
        render(<ColorPicker defaultValue="#00ff00" />);
        expect(document.querySelector("[data-slot='color-picker-swatch']")).toBeInTheDocument();
    });

    it("opens a dialog/popover with color controls when the trigger is clicked", async () => {
        let user = userEvent.setup();
        render(<ColorPicker defaultValue="#0000ff" />);

        let trigger = screen.getByRole("button");
        await user.click(trigger);

        // The popover contains a dialog
        let dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();

        // Color area and color slider should be present (smoke: data-slot)
        await waitFor(() => {
            expect(document.querySelector("[data-slot='color-picker-area']")).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(
                document.querySelector("[data-slot='color-picker-hue-slider']"),
            ).toBeInTheDocument();
        });
    });

    it("closes the popover on Escape", async () => {
        let user = userEvent.setup();
        render(<ColorPicker defaultValue="#123456" />);

        await user.click(screen.getByRole("button"));
        await screen.findByRole("dialog");

        await user.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });
});

// ---------------------------------------------------------------------------
// DropZone
// ---------------------------------------------------------------------------

describe("DropZone", () => {
    it("renders the drop zone container with data-slot", () => {
        render(<DropZone />);
        expect(document.querySelector("[data-slot='drop-zone']")).toBeInTheDocument();
    });

    it("renders the file-select button", () => {
        render(<DropZone />);
        let btn = screen.getByRole("button", { name: /select files/i });
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveAttribute("data-slot", "drop-zone-trigger");
    });

    it("renders the helper text", () => {
        render(<DropZone helperText="Drop PDFs here" />);
        expect(screen.getByText("Drop PDFs here")).toBeInTheDocument();
    });

    it("renders custom helper text via prop", () => {
        render(<DropZone helperText="Drag your images" />);
        expect(screen.getByText("Drag your images")).toBeInTheDocument();
    });

    it("defaults to 'Drag & drop files here' helper text", () => {
        render(<DropZone />);
        expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument();
    });

    it("has the upload icon slot", () => {
        render(<DropZone />);
        expect(document.querySelector("[data-slot='drop-zone-icon']")).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Toaster / toast
// ---------------------------------------------------------------------------

// The module-level toast queue is a singleton. Each test adds toasts that
// persist into subsequent tests unless the close button is pressed.  To keep
// tests independent we use unique titles so we can query exactly which toast
// we care about, and we tolerate accumulated toasts from prior tests.

describe("Toaster", () => {
    it("renders the toaster region with data-slot after adding a toast", async () => {
        render(<Toaster />);

        // The UNSTABLE_ToastRegion only mounts its portal DOM once a toast is
        // queued. Add one to ensure the region is present.
        act(() => {
            toast("Region smoke test");
        });

        await waitFor(() =>
            expect(document.querySelector("[data-slot='toaster']")).toBeInTheDocument(),
        );
    });

    it("shows a success toast after toast.success() is called", async () => {
        render(<Toaster />);

        act(() => {
            toast.success("Saved successfully");
        });

        await waitFor(() => expect(screen.getByText("Saved successfully")).toBeInTheDocument());
    });

    it("shows an error toast after toast.error() is called", async () => {
        render(<Toaster />);

        act(() => {
            toast.error("Something went wrong");
        });

        await waitFor(() => expect(screen.getByText("Something went wrong")).toBeInTheDocument());
    });

    it("shows a toast with description", async () => {
        render(<Toaster />);

        act(() => {
            toast("Update available", { description: "Version 2.0 is ready" });
        });

        await waitFor(() => {
            expect(screen.getByText("Update available")).toBeInTheDocument();
            expect(screen.getByText("Version 2.0 is ready")).toBeInTheDocument();
        });
    });

    it("renders close buttons on toasts", async () => {
        render(<Toaster />);

        act(() => {
            toast.info("Check this out unique title 9x7");
        });

        await waitFor(() =>
            expect(screen.getByText("Check this out unique title 9x7")).toBeInTheDocument(),
        );

        // Multiple close buttons may exist (one per visible toast) — just assert at least one
        let closeBtns = screen.getAllByRole("button", { name: /close notification/i });
        expect(closeBtns.length).toBeGreaterThanOrEqual(1);
    });
});
