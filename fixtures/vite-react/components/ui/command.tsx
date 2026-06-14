"use client";

// Classification: D — third-party package retained for parity (cmdk).
// Wrap cmdk's Command primitives, restyle with cva/cx, swap Search icon to
// IconSearch from @tabler/icons-react. CommandDialog composes our
// Dialog/DialogContent instead of cmdk's built-in Radix Dialog.

import { IconSearch } from "@tabler/icons-react";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cx } from "@/lib/cva";

// ─── Types ──────────────────────────────────────────────────────────────────

type CommandPrimitiveType = typeof CommandPrimitive;
type CommandProps = React.ComponentProps<CommandPrimitiveType>;
type CommandInputProps = React.ComponentProps<CommandPrimitiveType["Input"]>;
type CommandListProps = React.ComponentProps<CommandPrimitiveType["List"]>;
type CommandEmptyProps = React.ComponentProps<CommandPrimitiveType["Empty"]>;
type CommandGroupProps = React.ComponentProps<CommandPrimitiveType["Group"]>;
type CommandSeparatorProps = React.ComponentProps<CommandPrimitiveType["Separator"]>;
type CommandItemProps = React.ComponentProps<CommandPrimitiveType["Item"]>;

// ─── Command ────────────────────────────────────────────────────────────────

function Command({ className, ...props }: CommandProps) {
    return (
        <CommandPrimitive
            className={cx(
                "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
                className,
            )}
            data-slot="command"
            {...props}
        />
    );
}

// ─── CommandDialog ───────────────────────────────────────────────────────────

export interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
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
            <DialogContent
                className={cx("overflow-hidden p-0", className)}
                showCloseButton={showCloseButton}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
}

// ─── CommandInput ────────────────────────────────────────────────────────────

function CommandInput({ className, ...props }: CommandInputProps) {
    return (
        <div
            className="flex h-9 items-center gap-2 border-b px-3"
            data-slot="command-input-wrapper"
        >
            <IconSearch aria-hidden="true" className="size-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
                className={cx(
                    "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                data-slot="command-input"
                {...props}
            />
        </div>
    );
}

// ─── CommandList ─────────────────────────────────────────────────────────────

function CommandList({ className, ...props }: CommandListProps) {
    return (
        <CommandPrimitive.List
            className={cx("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)}
            data-slot="command-list"
            {...props}
        />
    );
}

// ─── CommandEmpty ─────────────────────────────────────────────────────────────

function CommandEmpty({ ...props }: CommandEmptyProps) {
    return (
        <CommandPrimitive.Empty
            className="py-6 text-center text-sm"
            data-slot="command-empty"
            {...props}
        />
    );
}

// ─── CommandGroup ─────────────────────────────────────────────────────────────

function CommandGroup({ className, ...props }: CommandGroupProps) {
    return (
        <CommandPrimitive.Group
            className={cx(
                "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
                className,
            )}
            data-slot="command-group"
            {...props}
        />
    );
}

// ─── CommandSeparator ─────────────────────────────────────────────────────────

function CommandSeparator({ className, ...props }: CommandSeparatorProps) {
    return (
        <CommandPrimitive.Separator
            className={cx("-mx-1 h-px bg-border", className)}
            data-slot="command-separator"
            {...props}
        />
    );
}

// ─── CommandItem ──────────────────────────────────────────────────────────────

function CommandItem({ className, ...props }: CommandItemProps) {
    return (
        <CommandPrimitive.Item
            className={cx(
                "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                className,
            )}
            data-slot="command-item"
            {...props}
        />
    );
}

// ─── CommandShortcut ──────────────────────────────────────────────────────────

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cx("ml-auto text-xs tracking-widest text-muted-foreground", className)}
            data-slot="command-shortcut"
            {...props}
        />
    );
}

// ─── Exports ─────────────────────────────────────────────────────────────────

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
