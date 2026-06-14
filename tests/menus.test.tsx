import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxTrigger,
} from "@/components/ui/combobox";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";

// ---------------------------------------------------------------------------
// Menubar
// ---------------------------------------------------------------------------

describe("Menubar", () => {
    it("renders the bar with data-slot", () => {
        render(
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>New</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>,
        );
        expect(screen.getByText("File")).toBeInTheDocument();
        expect(document.querySelector("[data-slot='menubar']")).toBeInTheDocument();
    });

    it("opens the menu content when a MenubarTrigger is clicked", async () => {
        let user = userEvent.setup();
        render(
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>New Tab</MenubarItem>
                        <MenubarItem>Open File</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>,
        );

        expect(screen.queryByRole("menuitem", { name: "New Tab" })).not.toBeInTheDocument();

        await user.click(screen.getByText("File"));

        let item = await screen.findByRole("menuitem", { name: "New Tab" });
        expect(item).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Open File" })).toBeInTheDocument();
    });

    it("fires onAction when a menu item is clicked", async () => {
        let user = userEvent.setup();
        let onAction = vi.fn();
        render(
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>Edit</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onAction={onAction}>Cut</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>,
        );

        await user.click(screen.getByText("Edit"));
        let cutItem = await screen.findByRole("menuitem", { name: "Cut" });
        await user.click(cutItem);

        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it("supports multiple menus in a bar", () => {
        render(
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>New</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Edit</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>Undo</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>Zoom In</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>,
        );

        expect(screen.getByText("File")).toBeInTheDocument();
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("View")).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Combobox
// ---------------------------------------------------------------------------

const FRUITS = ["Apple", "Banana", "Blueberry", "Cherry", "Grape"];

function ComboboxFixture({ onValueChange }: { onValueChange?: (v: string) => void }) {
    return (
        <Combobox onValueChange={onValueChange}>
            <ComboboxInput placeholder="Pick a fruit" />
            <ComboboxTrigger />
            <ComboboxContent>
                {FRUITS.map(f => (
                    <ComboboxItem key={f} value={f}>
                        {f}
                    </ComboboxItem>
                ))}
            </ComboboxContent>
        </Combobox>
    );
}

describe("Combobox", () => {
    it("renders the input with data-slot", () => {
        render(<ComboboxFixture />);
        expect(document.querySelector("[data-slot='combobox-input']")).toBeInTheDocument();
    });

    it("shows all options when the trigger button is clicked", async () => {
        let user = userEvent.setup();
        render(<ComboboxFixture />);

        expect(screen.queryByRole("option", { name: "Apple" })).not.toBeInTheDocument();

        await user.click(document.querySelector("[data-slot='combobox-trigger']")!);

        let option = await screen.findByRole("option", { name: "Apple" });
        expect(option).toBeInTheDocument();
        for (let fruit of FRUITS) {
            expect(screen.getByRole("option", { name: fruit })).toBeInTheDocument();
        }
    });

    it("filters options as the user types", async () => {
        let user = userEvent.setup();
        render(<ComboboxFixture />);

        let input = screen.getByPlaceholderText("Pick a fruit");
        await user.click(input);
        await user.type(input, "bl");

        // "Blueberry" should match; "Apple" should not
        let blueberry = await screen.findByRole("option", { name: "Blueberry" });
        expect(blueberry).toBeInTheDocument();

        await waitFor(() =>
            expect(screen.queryByRole("option", { name: "Apple" })).not.toBeInTheDocument(),
        );
    });

    it("calls onValueChange when an option is selected", async () => {
        let user = userEvent.setup();
        let onValueChange = vi.fn();
        render(<ComboboxFixture onValueChange={onValueChange} />);

        let input = screen.getByPlaceholderText("Pick a fruit");
        await user.click(input);
        await user.type(input, "ban");

        let option = await screen.findByRole("option", { name: "Banana" });
        await user.click(option);

        expect(onValueChange).toHaveBeenCalledWith("Banana");
    });
});

// ---------------------------------------------------------------------------
// Command
// ---------------------------------------------------------------------------

function CommandFixture() {
    return (
        <Command>
            <CommandInput placeholder="Search commands..." />
            <CommandList>
                <CommandGroup heading="Suggestions">
                    <CommandItem>Calendar</CommandItem>
                    <CommandItem>Search Emoji</CommandItem>
                    <CommandItem>Calculator</CommandItem>
                </CommandGroup>
                <CommandGroup heading="Settings">
                    <CommandItem>Profile</CommandItem>
                    <CommandItem>Billing</CommandItem>
                    <CommandItem>Settings</CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    );
}

describe("Command", () => {
    it("renders with data-slot and shows all items initially", () => {
        render(<CommandFixture />);
        expect(document.querySelector("[data-slot='command']")).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Calendar" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Profile" })).toBeInTheDocument();
    });

    it("renders the search input", () => {
        render(<CommandFixture />);
        let input = screen.getByPlaceholderText("Search commands...");
        expect(input).toBeInTheDocument();
    });

    it("filters items as the user types — matching items visible, non-matching gone", async () => {
        let user = userEvent.setup();
        render(<CommandFixture />);

        let input = screen.getByPlaceholderText("Search commands...");
        await user.type(input, "cal");

        // "Calendar" and "Calculator" should match "cal"
        let calendar = await screen.findByRole("menuitem", { name: "Calendar" });
        expect(calendar).toBeInTheDocument();

        let calculator = await screen.findByRole("menuitem", { name: "Calculator" });
        expect(calculator).toBeInTheDocument();

        // "Profile", "Billing", "Search Emoji", "Settings" should not be present
        await waitFor(() => {
            expect(screen.queryByRole("menuitem", { name: "Profile" })).not.toBeInTheDocument();
            expect(screen.queryByRole("menuitem", { name: "Billing" })).not.toBeInTheDocument();
            expect(
                screen.queryByRole("menuitem", { name: "Search Emoji" }),
            ).not.toBeInTheDocument();
        });
    });

    it("fires onAction (onSelect) when a CommandItem is clicked", async () => {
        let user = userEvent.setup();
        let onSelect = vi.fn();
        render(
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandGroup heading="Actions">
                        <CommandItem onSelect={onSelect}>Run Tests</CommandItem>
                        <CommandItem>Deploy</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>,
        );

        await user.click(screen.getByRole("menuitem", { name: "Run Tests" }));
        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it("shows no results state when nothing matches", async () => {
        let user = userEvent.setup();
        render(<CommandFixture />);

        let input = screen.getByPlaceholderText("Search commands...");
        await user.type(input, "zzznothing");

        await waitFor(() => {
            expect(screen.queryByRole("menuitem", { name: "Calendar" })).not.toBeInTheDocument();
        });
        // The CommandList renders an empty state div
        let empty = await screen.findByText("No results found.");
        expect(empty).toBeInTheDocument();
    });
});
