import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

describe("DropdownMenu", () => {
    it("opens from the trigger and fires onAction on an item", async () => {
        let user = userEvent.setup();
        let onAction = vi.fn();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button>Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onAction={onAction}>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Open" }));

        let item = await screen.findByRole("menuitem", { name: "Profile" });
        await user.click(item);
        expect(onAction).toHaveBeenCalledTimes(1);
    });
});

describe("ContextMenu", () => {
    it("opens on right-click with menu items", async () => {
        render(
            <ContextMenu>
                <ContextMenuTrigger>
                    <div>Right-click target</div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem>Copy</ContextMenuItem>
                    <ContextMenuItem>Paste</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>,
        );

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        fireEvent.contextMenu(screen.getByText("Right-click target"));

        expect(await screen.findByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Paste" })).toBeInTheDocument();
    });
});
