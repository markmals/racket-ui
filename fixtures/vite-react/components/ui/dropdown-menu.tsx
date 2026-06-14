"use client";

// Classification: B — React Aria MenuTrigger / Menu / MenuItem / Popover plus
// compatibility adapters to preserve shadcn's dropdown-menu export surface.
// Notes:
//   - `DropdownMenu` maps shadcn's `open` -> React Aria's `isOpen`.
//   - `DropdownMenuTrigger` and `DropdownMenuPortal` are pass-through adapters.
//   - Open/close animations use `data-[entering]`/`data-[exiting]`; item
//     highlight uses `data-[focused]`.

import type { ReactNode } from "react";

import { IconCheck, IconChevronRight, IconCircleFilled } from "@tabler/icons-react";
import {
    Header,
    Menu as AriaMenu,
    type MenuItemProps as AriaMenuItemProps,
    MenuItem as AriaMenuItem,
    type MenuProps as AriaMenuProps,
    MenuSection as AriaMenuSection,
    type MenuSectionProps as AriaMenuSectionProps,
    MenuTrigger as AriaMenuTrigger,
    type MenuTriggerProps as AriaMenuTriggerProps,
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

function getPlacement(
    side: "top" | "right" | "bottom" | "left",
    align: "start" | "center" | "end",
): Placement {
    if (align === "center") {
        return side;
    }

    if (side === "left" || side === "right") {
        return `${side} ${align === "start" ? "top" : "bottom"}`;
    }

    return `${side} ${align}`;
}

export interface DropdownMenuProps extends Omit<AriaMenuTriggerProps, "isOpen"> {
    open?: boolean;
    modal?: boolean;
}

function DropdownMenu({ open, modal: _modal, ...props }: DropdownMenuProps) {
    return <AriaMenuTrigger data-slot="dropdown-menu" isOpen={open} {...props} />;
}

function DropdownMenuPortal({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

function DropdownMenuTrigger({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

export interface DropdownMenuContentProps<T extends object = object> extends Omit<
    AriaMenuProps<T>,
    "children" | "className"
> {
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    popoverProps?: Omit<AriaPopoverProps, "children" | "className">;
    className?: string;
    children?: ReactNode | ((item: T) => ReactNode);
}

function DropdownMenuContent<T extends object = object>({
    className,
    align = "center",
    side = "bottom",
    sideOffset = 4,
    popoverProps,
    ...props
}: DropdownMenuContentProps<T>) {
    let placement = getPlacement(side, align);

    return (
        <AriaPopover
            data-slot="dropdown-menu-popover"
            offset={sideOffset}
            placement={placement}
            {...popoverProps}
            className={cx(
                "z-50 max-h-(--visual-viewport-height) min-w-[8rem] origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                className,
            )}
        >
            <AriaMenu className="outline-hidden" data-slot="dropdown-menu-content" {...props} />
        </AriaPopover>
    );
}

function DropdownMenuGroup<T extends object = object>({
    className,
    ...props
}: AriaMenuSectionProps<T>) {
    return (
        <AriaMenuSection
            className={cx("contents", className)}
            data-slot="dropdown-menu-group"
            {...props}
        />
    );
}

export interface DropdownMenuItemProps<T = object> extends AriaMenuItemProps<T> {
    inset?: boolean;
    variant?: "default" | "destructive";
}

function DropdownMenuItem<T = object>({
    className,
    inset,
    variant = "default",
    ...props
}: DropdownMenuItemProps<T>) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[focused]:bg-accent data-[focused]:text-accent-foreground data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[focused]:bg-destructive/10 data-[variant=destructive]:data-[focused]:text-destructive dark:data-[variant=destructive]:data-[focused]:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
                    className,
                ),
            )}
            data-inset={inset}
            data-slot="dropdown-menu-item"
            data-variant={variant}
            {...props}
        />
    );
}

export interface DropdownMenuCheckboxItemProps<T = object> extends AriaMenuItemProps<T> {
    isSelected?: boolean;
}

function DropdownMenuCheckboxItem<T = object>({
    className,
    children,
    isSelected,
    ...props
}: DropdownMenuCheckboxItemProps<T>) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[focused]:bg-accent data-[focused]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    className,
                ),
            )}
            data-selected={isSelected || undefined}
            data-slot="dropdown-menu-checkbox-item"
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

export interface DropdownMenuRadioGroupProps<T extends object = object> extends Omit<
    AriaMenuSectionProps<T>,
    "selectionMode" | "selectedKeys" | "defaultSelectedKeys" | "onSelectionChange" | "value"
> {
    value?: Key;
    defaultValue?: Key;
    onValueChange?: (value: Key) => void;
}

function DropdownMenuRadioGroup<T extends object = object>({
    value,
    defaultValue,
    onValueChange,
    ...props
}: DropdownMenuRadioGroupProps<T>) {
    return (
        <AriaMenuSection
            data-slot="dropdown-menu-radio-group"
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

function DropdownMenuRadioItem<T = object>({
    className,
    children,
    ...props
}: AriaMenuItemProps<T>) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[focused]:bg-accent data-[focused]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    className,
                ),
            )}
            data-slot="dropdown-menu-radio-item"
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

function DropdownMenuLabel({
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
            data-slot="dropdown-menu-label"
            {...props}
        />
    );
}

function DropdownMenuSeparator({ className, ...props }: AriaSeparatorProps) {
    return (
        <AriaSeparator
            className={cx("-mx-1 my-1 h-px bg-border", className)}
            data-slot="dropdown-menu-separator"
            {...props}
        />
    );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cx("ml-auto text-xs tracking-widest text-muted-foreground", className)}
            data-slot="dropdown-menu-shortcut"
            {...props}
        />
    );
}

function DropdownMenuSub({ children, delay }: AriaSubmenuTriggerProps) {
    return (
        <AriaSubmenuTrigger
            {...({
                "data-slot": "dropdown-menu-sub",
                delay,
                children,
            } as AriaSubmenuTriggerProps & {
                "data-slot": string;
            })}
        />
    );
}

function DropdownMenuSubTrigger<T = object>({
    className,
    inset,
    children,
    ...props
}: AriaMenuItemProps<T> & {
    inset?: boolean;
}) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[focused]:bg-accent data-[focused]:text-accent-foreground data-[inset]:pl-8 data-[open]:bg-accent data-[open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                    className,
                ),
            )}
            data-inset={inset}
            data-slot="dropdown-menu-sub-trigger"
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

export interface DropdownMenuSubContentProps<T extends object = object> extends Omit<
    AriaMenuProps<T>,
    "children" | "className"
> {
    sideOffset?: number;
    popoverProps?: Omit<AriaPopoverProps, "children" | "className">;
    className?: string;
    children?: ReactNode | ((item: T) => ReactNode);
}

function DropdownMenuSubContent<T extends object = object>({
    className,
    sideOffset = 4,
    popoverProps,
    ...props
}: DropdownMenuSubContentProps<T>) {
    return (
        <AriaPopover
            data-slot="dropdown-menu-sub-popover"
            offset={sideOffset}
            {...popoverProps}
            className={cx(
                "z-50 min-w-[8rem] origin-(--trigger-anchor-point) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
                "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                className,
            )}
        >
            <AriaMenu className="outline-hidden" data-slot="dropdown-menu-sub-content" {...props} />
        </AriaPopover>
    );
}

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
};
