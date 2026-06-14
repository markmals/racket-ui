"use client";

// Classification: B — React Aria Autocomplete + Menu (SearchField / Input /
// MenuSection / MenuItem / Separator / Header) + compatibility adapters.
// Replaces cmdk with React Aria's Autocomplete for filtering and Menu for
// actionable items. Preserves shadcn's export surface exactly:
//   Command, CommandDialog, CommandInput, CommandList, CommandEmpty,
//   CommandGroup, CommandItem, CommandShortcut, CommandSeparator.
// CommandDialog wraps our own Dialog/DialogContent.

import { IconSearch } from "@tabler/icons-react";
import { Children, isValidElement, type ReactNode } from "react";
import {
    Autocomplete,
    type AutocompleteProps,
    Header,
    Input,
    Menu,
    type MenuItemProps,
    type MenuItemRenderProps,
    type MenuProps,
    MenuItem,
    MenuSection,
    SearchField,
    Separator,
    type SeparatorProps,
    composeRenderProps,
    useFilter,
} from "react-aria-components";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    type DialogProps,
} from "@/components/ui/dialog";
import { cx } from "@/lib/cva";

// Internal type mirroring react-aria-components' non-exported ClassNameOrFunction
type ClassNameOrFn<T> = string | ((values: T & { defaultClassName: string | undefined }) => string);

// ---------------------------------------------------------------------------
// Command — root wrapper. Hosts the Autocomplete with a case-insensitive
// contains filter. Children should include CommandInput + CommandList.
// ---------------------------------------------------------------------------

export interface CommandProps extends Omit<AutocompleteProps<object>, "filter" | "className"> {
    className?: string;
}

function Command({ className, children, ...props }: CommandProps) {
    let { contains } = useFilter({ sensitivity: "base" });

    function filter(textValue: string, inputValue: string): boolean {
        return contains(textValue, inputValue);
    }

    return (
        <div
            className={cx(
                "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
                className,
            )}
            data-slot="command"
        >
            <Autocomplete filter={filter} {...props}>
                {children}
            </Autocomplete>
        </div>
    );
}

// ---------------------------------------------------------------------------
// CommandDialog — Dialog containing a Command.
// ---------------------------------------------------------------------------

export interface CommandDialogProps extends Omit<DialogProps, "children"> {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
    children: ReactNode;
}

function CommandDialog({
    title = "Command Palette",
    description = "Search for a command to run...",
    children,
    className,
    showCloseButton = true,
    ...props
}: CommandDialogProps) {
    return (
        <Dialog {...props}>
            <DialogHeader className="sr-only">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogContent
                className={cx("overflow-hidden p-0", className)}
                showCloseButton={showCloseButton}
            >
                <Command className="[&_[data-slot=command-input-wrapper]]:h-12 [&_[data-slot=command-item]]:px-2 [&_[data-slot=command-item]]:py-3 [&_[data-slot=command-item]_svg]:size-5">
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
}

// ---------------------------------------------------------------------------
// CommandInput — SearchField with a search icon, styled like shadcn's
// command input (h-9 wrapper, border-b). The Input is wired to Autocomplete
// via React Aria context automatically.
// ---------------------------------------------------------------------------

export interface CommandInputProps extends Omit<
    React.ComponentProps<typeof SearchField>,
    "className" | "children"
> {
    className?: string;
    placeholder?: string;
}

function CommandInput({ className, placeholder, ...props }: CommandInputProps) {
    return (
        <SearchField
            aria-label={placeholder ?? "Search"}
            data-slot="command-search-field"
            {...props}
        >
            <div
                className="flex h-9 items-center gap-2 border-b px-3"
                data-slot="command-input-wrapper"
            >
                <IconSearch aria-hidden="true" className="size-4 shrink-0 opacity-50" />
                <Input
                    className={cx(
                        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                        // Hide the native search input's clear (×) button.
                        "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
                        className,
                    )}
                    data-slot="command-input"
                    placeholder={placeholder ?? "Search..."}
                />
            </div>
        </SearchField>
    );
}

// ---------------------------------------------------------------------------
// CommandList — Menu acts as the scrollable list of actionable items. The
// Autocomplete wires the SearchField input to filter the Menu items via
// React Aria context.
// ---------------------------------------------------------------------------

export interface CommandListProps extends Omit<MenuProps<object>, "className"> {
    className?: string;
}

function CommandList({ className, children, ...props }: CommandListProps) {
    // A React Aria Menu's collection only accepts items/sections, so a
    // <CommandEmpty> placed inside <CommandList> (the shadcn/cmdk API) would break
    // item rendering. For static children, pull it out and route its content
    // through renderEmptyState; pass only the real items to the Menu collection.
    // (A render-function child = dynamic collection; pass it through untouched.)
    let emptyState: ReactNode = null;
    let content = children;
    if (typeof children !== "function") {
        let items: ReactNode[] = [];
        Children.forEach(children, child => {
            if (isValidElement(child) && child.type === CommandEmpty) {
                emptyState = child;
            } else {
                items.push(child);
            }
        });
        content = items;
    }

    return (
        <Menu
            aria-label="Commands"
            className={composeRenderProps(
                className as ClassNameOrFn<{ isEmpty: boolean }> | undefined,
                cls =>
                    cx(
                        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto p-1 outline-none",
                        cls,
                    ),
            )}
            data-slot="command-list"
            renderEmptyState={() =>
                emptyState ?? (
                    <div
                        className="py-6 text-center text-sm text-muted-foreground"
                        data-slot="command-empty"
                    >
                        No results found.
                    </div>
                )
            }
            {...props}
        >
            {content}
        </Menu>
    );
}

// ---------------------------------------------------------------------------
// CommandEmpty — rendered when no results match. Exported for API parity;
// CommandList's renderEmptyState already provides a default empty state.
// ---------------------------------------------------------------------------

function CommandEmpty({ className, children, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cx("py-6 text-center text-sm", className)}
            data-slot="command-empty"
            {...props}
        >
            {children}
        </div>
    );
}

// ---------------------------------------------------------------------------
// CommandGroup — MenuSection with an optional heading Header.
// ---------------------------------------------------------------------------

export interface CommandGroupProps {
    heading?: ReactNode;
    className?: string;
    children: ReactNode;
    "aria-label"?: string;
}

function CommandGroup({
    className,
    heading,
    children,
    "aria-label": ariaLabel,
}: CommandGroupProps) {
    return (
        <MenuSection
            aria-label={ariaLabel ?? (typeof heading === "string" ? heading : undefined)}
            className={cx("overflow-hidden p-1 text-foreground", className)}
            data-slot="command-group"
        >
            {heading != null && (
                <Header
                    className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
                    data-slot="command-group-heading"
                >
                    {heading}
                </Header>
            )}
            {children}
        </MenuSection>
    );
}

// ---------------------------------------------------------------------------
// CommandSeparator — thin horizontal rule between groups.
// ---------------------------------------------------------------------------

export interface CommandSeparatorProps extends SeparatorProps {
    className?: string;
}

function CommandSeparator({ className, ...props }: CommandSeparatorProps) {
    return (
        <Separator
            className={cx("-mx-1 h-px bg-border", className)}
            data-slot="command-separator"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// CommandItem — MenuItem styled like shadcn's command item.
// onSelect is shadcn compat; forward to onAction (React Aria idiom).
// ---------------------------------------------------------------------------

export interface CommandItemProps extends Omit<MenuItemProps<object>, "className"> {
    className?: ClassNameOrFn<MenuItemRenderProps>;
    onSelect?: () => void;
}

function CommandItem({ className, children, onSelect, onAction, ...props }: CommandItemProps) {
    return (
        <MenuItem
            className={composeRenderProps(className, cls =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
                    "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                    cls,
                ),
            )}
            data-slot="command-item"
            onAction={onSelect ?? onAction}
            {...props}
        >
            {children}
        </MenuItem>
    );
}

// ---------------------------------------------------------------------------
// CommandShortcut — right-aligned keyboard shortcut label.
// ---------------------------------------------------------------------------

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cx("ml-auto text-xs tracking-widest text-muted-foreground", className)}
            data-slot="command-shortcut"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Exports — preserve shadcn export names exactly.
// ---------------------------------------------------------------------------

export {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
};
