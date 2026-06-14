"use client";

// Classification: B — React Aria (DialogTrigger / Popover / Dialog) +
// compatibility adapters. `PopoverContent` accepts shadcn's `align`/`sideOffset`
// and maps them to React Aria's `placement`/`offset`. Animations use
// `data-[entering]`/`data-[exiting]`/`data-[placement]`.

import type { ReactNode } from "react";

import {
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    type DialogTriggerProps as AriaDialogTriggerProps,
    Popover as AriaPopover,
    type PopoverProps as AriaPopoverProps,
    type Placement,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

export interface PopoverProps extends Omit<AriaDialogTriggerProps, "isOpen"> {
    open?: boolean;
}

function Popover({ open, ...props }: PopoverProps) {
    return <AriaDialogTrigger isOpen={open} {...props} />;
}

function PopoverTrigger({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

function PopoverAnchor({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export interface PopoverContentProps extends Omit<AriaPopoverProps, "placement" | "children"> {
    align?: "start" | "center" | "end";
    sideOffset?: number;
    children?: ReactNode;
}

function PopoverContent({
    className,
    align = "center",
    sideOffset = 4,
    children,
    ...props
}: PopoverContentProps) {
    let placement: Placement =
        align === "center" ? "bottom" : align === "start" ? "bottom start" : "bottom end";
    return (
        <AriaPopover
            className={composeRenderProps(className, className =>
                cx(
                    "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
                    "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                    "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                    className,
                ),
            )}
            data-slot="popover-content"
            offset={sideOffset}
            placement={placement}
            {...props}
        >
            <AriaDialog className="outline-none">{children}</AriaDialog>
        </AriaPopover>
    );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cx("flex flex-col gap-1 text-sm", className)}
            data-slot="popover-header"
            {...props}
        />
    );
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={cx("font-medium", className)} data-slot="popover-title" {...props} />;
}

function PopoverDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            className={cx("text-muted-foreground", className)}
            data-slot="popover-description"
            {...props}
        />
    );
}

export {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverAnchor,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
};
