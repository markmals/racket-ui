"use client";

// Classification: C — local implementation.
// React Aria has no context-menu primitive. ContextMenuTrigger captures the
// right-click event, prevents the browser default, records the pointer
// position into a zero-size anchor element, and opens a React Aria Menu
// inside a Popover positioned at the cursor.  All item sub-parts mirror the
// dropdown-menu exemplar exactly.

import type { ReactNode } from "react";

import { IconCheck, IconChevronRight, IconCircleFilled } from "@tabler/icons-react";
import React, { useCallback, useRef, useState } from "react";
import {
    Header,
    Menu as AriaMenu,
    type MenuItemProps as AriaMenuItemProps,
    MenuItem as AriaMenuItem,
    type MenuProps as AriaMenuProps,
    MenuSection as AriaMenuSection,
    type MenuSectionProps as AriaMenuSectionProps,
    type Placement,
    Popover as AriaPopover,
    type PopoverProps as AriaPopoverProps,
    Separator as AriaSeparator,
    type SeparatorProps as AriaSeparatorProps,
    SubmenuTrigger as AriaSubmenuTrigger,
    type SubmenuTriggerProps as AriaSubmenuTriggerProps,
    composeRenderProps,
    type Key,
    type Selection,
} from "react-aria-components";

import { cx } from "@/lib/cva";

// ---------------------------------------------------------------------------
// Shared context — lets ContextMenuContent get the open state + anchor ref
// ---------------------------------------------------------------------------

interface ContextMenuState {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    anchorRef: React.RefObject<HTMLElement | null>;
}

let ContextMenuContext = React.createContext<ContextMenuState | null>(null);

function useContextMenuContext(): ContextMenuState {
    let ctx = React.useContext(ContextMenuContext);
    if (!ctx) {
        throw new Error("ContextMenu sub-components must be used inside <ContextMenu>");
    }
    return ctx;
}

// ---------------------------------------------------------------------------
// ContextMenu — root provider
// ---------------------------------------------------------------------------

export interface ContextMenuProps {
    children: ReactNode;
    modal?: boolean;
}

function ContextMenu({ children, modal: _modal }: ContextMenuProps) {
    let [isOpen, setIsOpen] = useState(false);
    // A zero-size positioned anchor div that we move to the cursor
    let anchorRef = useRef<HTMLSpanElement>(null);

    return (
        <ContextMenuContext.Provider value={{ isOpen, setIsOpen, anchorRef }}>
            <span data-slot="context-menu" style={{ display: "contents" }}>
                {/* Zero-size virtual anchor; absolute position set on contextmenu event */}
                <span
                    aria-hidden="true"
                    ref={anchorRef}
                    style={{
                        position: "fixed",
                        width: 0,
                        height: 0,
                        top: 0,
                        left: 0,
                        pointerEvents: "none",
                    }}
                />
                {children}
            </span>
        </ContextMenuContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// ContextMenuTrigger
// ---------------------------------------------------------------------------

export interface ContextMenuTriggerProps {
    children: ReactNode;
    disabled?: boolean;
    asChild?: boolean;
}

function ContextMenuTrigger({ children, disabled }: ContextMenuTriggerProps) {
    let { setIsOpen, anchorRef } = useContextMenuContext();

    let handleContextMenu = useCallback(
        (e: React.MouseEvent) => {
            if (disabled) return;
            e.preventDefault();
            // Position the virtual anchor at cursor coordinates
            if (anchorRef.current) {
                anchorRef.current.style.top = `${e.clientY}px`;
                anchorRef.current.style.left = `${e.clientX}px`;
            }
            // Delay slightly so the anchor is positioned before the popover opens
            setIsOpen(true);
        },
        [disabled, setIsOpen, anchorRef],
    );

    return (
        <span
            data-slot="context-menu-trigger"
            onContextMenu={handleContextMenu}
            style={{ display: "contents" }}
        >
            {children}
        </span>
    );
}

// ---------------------------------------------------------------------------
// ContextMenuPortal (pass-through for API compat)
// ---------------------------------------------------------------------------

function ContextMenuPortal({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

// ---------------------------------------------------------------------------
// ContextMenuContent — wraps AriaPopover + AriaMenu
// ---------------------------------------------------------------------------

export interface ContextMenuContentProps<T extends object = object> extends Omit<
    AriaMenuProps<T>,
    "children" | "className"
> {
    sideOffset?: number;
    popoverProps?: Omit<
        AriaPopoverProps,
        "children" | "className" | "triggerRef" | "isOpen" | "onOpenChange"
    >;
    className?: string;
    children?: ReactNode | ((item: T) => ReactNode);
}

function ContextMenuContent<T extends object = object>({
    className,
    sideOffset = 4,
    popoverProps,
    ...props
}: ContextMenuContentProps<T>) {
    let { isOpen, setIsOpen, anchorRef } = useContextMenuContext();

    return (
        <AriaPopover
            data-slot="context-menu-popover"
            isOpen={isOpen}
            offset={sideOffset}
            onOpenChange={setIsOpen}
            placement={"bottom start" as Placement}
            triggerRef={anchorRef as React.RefObject<Element | null>}
            {...popoverProps}
            className={cx(
                "z-50 max-h-(--visual-viewport-height) min-w-[8rem] origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                className,
            )}
        >
            <AriaMenu className="outline-hidden" data-slot="context-menu-content" {...props} />
        </AriaPopover>
    );
}

// ---------------------------------------------------------------------------
// ContextMenuGroup
// ---------------------------------------------------------------------------

function ContextMenuGroup<T extends object = object>({
    className,
    ...props
}: AriaMenuSectionProps<T>) {
    return (
        <AriaMenuSection
            className={cx("contents", className)}
            data-slot="context-menu-group"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ContextMenuItem
// ---------------------------------------------------------------------------

export interface ContextMenuItemProps<T = object> extends AriaMenuItemProps<T> {
    inset?: boolean;
    variant?: "default" | "destructive";
}

function ContextMenuItem<T = object>({
    className,
    inset,
    variant = "default",
    ...props
}: ContextMenuItemProps<T>) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[focused]:bg-accent data-[focused]:text-accent-foreground data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[focused]:bg-destructive/10 data-[variant=destructive]:data-[focused]:text-destructive dark:data-[variant=destructive]:data-[focused]:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
                    className,
                ),
            )}
            data-inset={inset}
            data-slot="context-menu-item"
            data-variant={variant}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ContextMenuCheckboxItem
// ---------------------------------------------------------------------------

export interface ContextMenuCheckboxItemProps<T = object> extends AriaMenuItemProps<T> {
    isSelected?: boolean;
}

function ContextMenuCheckboxItem<T = object>({
    className,
    children,
    isSelected,
    ...props
}: ContextMenuCheckboxItemProps<T>) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[focused]:bg-accent data-[focused]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    className,
                ),
            )}
            data-selected={isSelected || undefined}
            data-slot="context-menu-checkbox-item"
            {...props}
        >
            {composeRenderProps(children, (children, { isSelected: menuIsSelected }) => {
                let selected = isSelected ?? menuIsSelected;

                return (
                    <>
                        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                            {selected && <IconCheck className="size-4" />}
                        </span>
                        {children}
                    </>
                );
            })}
        </AriaMenuItem>
    );
}

// ---------------------------------------------------------------------------
// ContextMenuRadioGroup
// ---------------------------------------------------------------------------

export interface ContextMenuRadioGroupProps<T extends object = object> extends Omit<
    AriaMenuSectionProps<T>,
    "selectionMode" | "selectedKeys" | "defaultSelectedKeys" | "onSelectionChange" | "value"
> {
    value?: Key;
    defaultValue?: Key;
    onValueChange?: (value: Key) => void;
}

function ContextMenuRadioGroup<T extends object = object>({
    value,
    defaultValue,
    onValueChange,
    ...props
}: ContextMenuRadioGroupProps<T>) {
    return (
        <AriaMenuSection
            data-slot="context-menu-radio-group"
            defaultSelectedKeys={defaultValue === undefined ? undefined : [defaultValue]}
            onSelectionChange={(keys: Selection) => {
                if (keys === "all") {
                    return;
                }

                let nextValue = keys.values().next().value;

                if (nextValue != null) {
                    onValueChange?.(nextValue);
                }
            }}
            selectedKeys={value === undefined ? undefined : [value]}
            selectionMode="single"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ContextMenuRadioItem
// ---------------------------------------------------------------------------

function ContextMenuRadioItem<T = object>({ className, children, ...props }: AriaMenuItemProps<T>) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[focused]:bg-accent data-[focused]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    className,
                ),
            )}
            data-slot="context-menu-radio-item"
            {...props}
        >
            {composeRenderProps(children, (children, { isSelected }) => (
                <>
                    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                        {isSelected && <IconCircleFilled className="size-2 fill-current" />}
                    </span>
                    {children}
                </>
            ))}
        </AriaMenuItem>
    );
}

// ---------------------------------------------------------------------------
// ContextMenuLabel
// ---------------------------------------------------------------------------

function ContextMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof Header> & {
    inset?: boolean;
}) {
    return (
        <Header
            className={cx("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)}
            data-inset={inset}
            data-slot="context-menu-label"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ContextMenuSeparator
// ---------------------------------------------------------------------------

function ContextMenuSeparator({ className, ...props }: AriaSeparatorProps) {
    return (
        <AriaSeparator
            className={cx("-mx-1 my-1 h-px bg-border", className)}
            data-slot="context-menu-separator"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ContextMenuShortcut
// ---------------------------------------------------------------------------

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cx("ml-auto text-xs tracking-widest text-muted-foreground", className)}
            data-slot="context-menu-shortcut"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ContextMenuSub
// ---------------------------------------------------------------------------

function ContextMenuSub({ children, delay }: AriaSubmenuTriggerProps) {
    return (
        <AriaSubmenuTrigger
            {...({ "data-slot": "context-menu-sub", delay, children } as AriaSubmenuTriggerProps & {
                "data-slot": string;
            })}
        />
    );
}

// ---------------------------------------------------------------------------
// ContextMenuSubTrigger
// ---------------------------------------------------------------------------

function ContextMenuSubTrigger<T = object>({
    className,
    inset,
    children,
    ...props
}: AriaMenuItemProps<T> & { inset?: boolean }) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[focused]:bg-accent data-[focused]:text-accent-foreground data-[inset]:pl-8 data-[open]:bg-accent data-[open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                    className,
                ),
            )}
            data-inset={inset}
            data-slot="context-menu-sub-trigger"
            {...props}
        >
            {composeRenderProps(children, children => (
                <>
                    {children}
                    <IconChevronRight className="ml-auto size-4" />
                </>
            ))}
        </AriaMenuItem>
    );
}

// ---------------------------------------------------------------------------
// ContextMenuSubContent
// ---------------------------------------------------------------------------

export interface ContextMenuSubContentProps<T extends object = object> extends Omit<
    AriaMenuProps<T>,
    "children" | "className"
> {
    sideOffset?: number;
    popoverProps?: Omit<AriaPopoverProps, "children" | "className">;
    className?: string;
    children?: ReactNode | ((item: T) => ReactNode);
}

function ContextMenuSubContent<T extends object = object>({
    className,
    sideOffset = 4,
    popoverProps,
    ...props
}: ContextMenuSubContentProps<T>) {
    return (
        <AriaPopover
            data-slot="context-menu-sub-popover"
            offset={sideOffset}
            {...popoverProps}
            className={cx(
                "z-50 min-w-[8rem] origin-(--trigger-anchor-point) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
                "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                className,
            )}
        >
            <AriaMenu className="outline-hidden" data-slot="context-menu-sub-content" {...props} />
        </AriaPopover>
    );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuPortal,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuLabel,
    ContextMenuItem,
    ContextMenuCheckboxItem,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
};
