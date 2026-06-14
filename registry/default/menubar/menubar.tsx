"use client";

// Classification: B — React Aria MenuTrigger / Menu / MenuItem / MenuSection /
// SubmenuTrigger + compatibility adapters to preserve the shadcn menubar export
// surface. Top-level menus are wrapped in a horizontal bar; content and
// sub-content use React Aria Popover placement/animation data attributes.

import type { ReactNode } from "react";

import { IconCheck, IconChevronRight, IconCircleFilled } from "@tabler/icons-react";
import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    Header,
    type HeaderProps,
    Menu as AriaMenu,
    MenuItem as AriaMenuItem,
    type MenuItemProps as AriaMenuItemProps,
    MenuSection as AriaMenuSection,
    type MenuSectionProps as AriaMenuSectionProps,
    MenuTrigger as AriaMenuTrigger,
    type MenuTriggerProps as AriaMenuTriggerProps,
    Popover as AriaPopover,
    type PopoverProps as AriaPopoverProps,
    type Placement,
    Separator as AriaSeparator,
    type SeparatorProps as AriaSeparatorProps,
    SubmenuTrigger as AriaSubmenuTrigger,
    type SubmenuTriggerProps as AriaSubmenuTriggerProps,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

function Menubar({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs",
                className,
            )}
            data-slot="menubar"
            {...props}
        />
    );
}

function MenubarMenu(props: AriaMenuTriggerProps) {
    return <AriaMenuTrigger data-slot="menubar-menu" {...props} />;
}

function MenubarGroup(props: AriaMenuSectionProps<object>) {
    return <AriaMenuSection data-slot="menubar-group" {...props} />;
}

function MenubarPortal({ children }: { children?: ReactNode }) {
    return <>{children}</>;
}

export interface MenubarRadioGroupProps extends Omit<
    AriaMenuSectionProps<object>,
    "selectionMode" | "selectedKeys" | "defaultSelectedKeys" | "onSelectionChange" | "value"
> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}

function MenubarRadioGroup({
    value,
    defaultValue,
    onValueChange,
    ...props
}: MenubarRadioGroupProps) {
    return (
        <AriaMenuSection
            data-slot="menubar-radio-group"
            defaultSelectedKeys={defaultValue === undefined ? undefined : new Set([defaultValue])}
            onSelectionChange={
                onValueChange
                    ? keys => {
                          if (keys === "all") {
                              return;
                          }

                          let [key] = Array.from(keys);
                          if (key !== undefined) {
                              onValueChange(String(key));
                          }
                      }
                    : undefined
            }
            selectedKeys={value === undefined ? undefined : new Set([value])}
            selectionMode="single"
            {...props}
        />
    );
}

function MenubarTrigger({ className, ...props }: AriaButtonProps) {
    return (
        <AriaButton
            className={composeRenderProps(className, className =>
                cx(
                    "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
                    "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                    "data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
                    className,
                ),
            )}
            data-slot="menubar-trigger"
            {...props}
        />
    );
}

export interface MenubarContentProps extends Omit<
    AriaPopoverProps,
    "children" | "className" | "placement" | "offset" | "crossOffset"
> {
    align?: "start" | "center" | "end";
    alignOffset?: number;
    sideOffset?: number;
    children?: ReactNode;
    className?: string;
}

function MenubarContent({
    className,
    align = "start",
    alignOffset = -4,
    sideOffset = 8,
    children,
    ...props
}: MenubarContentProps) {
    let placement: Placement =
        align === "center" ? "bottom" : align === "start" ? "bottom start" : "bottom end";

    return (
        <MenubarPortal>
            <AriaPopover
                className={composeRenderProps(className, className =>
                    cx(
                        "z-50 min-w-[12rem] origin-(--trigger-anchor-point) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                        "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                        "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                        "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
                        className,
                    ),
                )}
                crossOffset={alignOffset}
                data-slot="menubar-content"
                offset={sideOffset}
                placement={placement}
                {...props}
            >
                <AriaMenu className="outline-none">{children}</AriaMenu>
            </AriaPopover>
        </MenubarPortal>
    );
}

export interface MenubarItemProps extends AriaMenuItemProps<object> {
    inset?: boolean;
    variant?: "default" | "destructive";
}

function MenubarItem({ className, inset, variant = "default", ...props }: MenubarItemProps) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
                    "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "data-[inset]:pl-8 data-[variant=destructive]:text-destructive",
                    "data-[variant=destructive]:data-[focused]:bg-destructive/10 data-[variant=destructive]:data-[focused]:text-destructive dark:data-[variant=destructive]:data-[focused]:bg-destructive/20",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                    "data-[variant=destructive]:*:[svg]:text-destructive!",
                    className,
                ),
            )}
            data-inset={inset}
            data-slot="menubar-item"
            data-variant={variant}
            {...props}
        />
    );
}

function MenubarCheckboxItem({ className, children, ...props }: AriaMenuItemProps<object>) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none",
                    "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    className,
                ),
            )}
            data-slot="menubar-checkbox-item"
            {...props}
        >
            {composeRenderProps(children, (children, { isSelected }) => (
                <>
                    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                        {isSelected && <IconCheck aria-hidden="true" className="size-4" />}
                    </span>
                    {children}
                </>
            ))}
        </AriaMenuItem>
    );
}

function MenubarRadioItem({ className, children, ...props }: AriaMenuItemProps<object>) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none",
                    "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    className,
                ),
            )}
            data-slot="menubar-radio-item"
            {...props}
        >
            {composeRenderProps(children, (children, { isSelected }) => (
                <>
                    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                        {isSelected && (
                            <IconCircleFilled aria-hidden="true" className="size-2 fill-current" />
                        )}
                    </span>
                    {children}
                </>
            ))}
        </AriaMenuItem>
    );
}

export interface MenubarLabelProps extends HeaderProps {
    inset?: boolean;
}

function MenubarLabel({ className, inset, ...props }: MenubarLabelProps) {
    return (
        <Header
            className={cx("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)}
            data-inset={inset}
            data-slot="menubar-label"
            {...props}
        />
    );
}

function MenubarSeparator({ className, ...props }: AriaSeparatorProps) {
    return (
        <AriaSeparator
            className={cx("-mx-1 my-1 h-px bg-border", className)}
            data-slot="menubar-separator"
            {...props}
        />
    );
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cx("ml-auto text-xs tracking-widest text-muted-foreground", className)}
            data-slot="menubar-shortcut"
            {...props}
        />
    );
}

function MenubarSub(props: AriaSubmenuTriggerProps) {
    return <AriaSubmenuTrigger data-slot="menubar-sub" {...props} />;
}

export interface MenubarSubTriggerProps extends AriaMenuItemProps<object> {
    inset?: boolean;
}

function MenubarSubTrigger({ className, inset, children, ...props }: MenubarSubTriggerProps) {
    return (
        <AriaMenuItem
            className={composeRenderProps(className, className =>
                cx(
                    "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none",
                    "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                    "data-[inset]:pl-8 data-[open]:bg-accent data-[open]:text-accent-foreground",
                    className,
                ),
            )}
            data-inset={inset}
            data-slot="menubar-sub-trigger"
            {...props}
        >
            {composeRenderProps(children, children => (
                <>
                    {children}
                    <IconChevronRight aria-hidden="true" className="ml-auto h-4 w-4" />
                </>
            ))}
        </AriaMenuItem>
    );
}

export interface MenubarSubContentProps extends Omit<
    AriaPopoverProps,
    "children" | "className" | "placement" | "offset"
> {
    sideOffset?: number;
    children?: ReactNode;
    className?: string;
}

function MenubarSubContent({
    className,
    sideOffset = 8,
    children,
    ...props
}: MenubarSubContentProps) {
    return (
        <AriaPopover
            className={composeRenderProps(className, className =>
                cx(
                    "z-50 min-w-[8rem] origin-(--trigger-anchor-point) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
                    "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                    "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
                    className,
                ),
            )}
            data-slot="menubar-sub-content"
            offset={sideOffset}
            placement="right top"
            {...props}
        >
            <AriaMenu className="outline-none">{children}</AriaMenu>
        </AriaPopover>
    );
}

export {
    Menubar,
    MenubarPortal,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarGroup,
    MenubarSeparator,
    MenubarLabel,
    MenubarItem,
    MenubarShortcut,
    MenubarCheckboxItem,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
};
