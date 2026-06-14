import type { ReactNode } from "react";

import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    Header,
    ListBox as AriaListBox,
    ListBoxItem as AriaListBoxItem,
    type ListBoxItemProps as AriaListBoxItemProps,
    type ListBoxProps as AriaListBoxProps,
    ListBoxSection,
    type ListBoxSectionProps,
    Popover as AriaPopover,
    Select as AriaSelect,
    type SelectProps as AriaSelectProps,
    SelectValue as AriaSelectValue,
    type SelectValueProps as AriaSelectValueProps,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

export interface SelectProps extends Omit<
    AriaSelectProps<object>,
    "selectedKey" | "defaultSelectedKey" | "onSelectionChange"
> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}

function Select({ value, defaultValue, onValueChange, ...props }: SelectProps) {
    return (
        <AriaSelect
            data-slot="select"
            defaultSelectedKey={defaultValue}
            onSelectionChange={onValueChange ? key => onValueChange(String(key)) : undefined}
            selectedKey={value}
            {...props}
        />
    );
}

function SelectGroup(props: ListBoxSectionProps<object>) {
    return <ListBoxSection data-slot="select-group" {...props} />;
}

export interface SelectValueProps extends AriaSelectValueProps<object> {
    placeholder?: ReactNode;
}

function SelectValue({ className, placeholder, ...props }: SelectValueProps) {
    return (
        <AriaSelectValue
            className={composeRenderProps(className, className =>
                cx(
                    "line-clamp-1 flex items-center gap-2 data-[placeholder]:text-muted-foreground",
                    className,
                ),
            )}
            data-slot="select-value"
            {...props}
        >
            {({ isPlaceholder, defaultChildren }) =>
                isPlaceholder ? placeholder : defaultChildren
            }
        </AriaSelectValue>
    );
}

export interface SelectTriggerProps extends AriaButtonProps {
    size?: "sm" | "default";
}

function SelectTrigger({ className, size = "default", children, ...props }: SelectTriggerProps) {
    return (
        <AriaButton
            className={composeRenderProps(className, className =>
                cx(
                    "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none",
                    "data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    "data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 dark:data-[invalid]:ring-destructive/40",
                    "data-[size=default]:h-9 data-[size=sm]:h-8",
                    "dark:bg-input/30 dark:data-[hovered]:bg-input/50",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                    className,
                ),
            )}
            data-size={size}
            data-slot="select-trigger"
            {...props}
        >
            {composeRenderProps(children, children => (
                <>
                    {children}
                    <IconChevronDown aria-hidden="true" className="size-4 opacity-50" />
                </>
            ))}
        </AriaButton>
    );
}

function SelectContent({ className, children, ...props }: AriaListBoxProps<object>) {
    return (
        <AriaPopover
            className="z-50 max-h-(--trigger-height) min-w-[8rem] origin-(--trigger-anchor-point) overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=top]:slide-in-from-bottom-2"
            data-slot="select-content"
        >
            <AriaListBox
                className={cx(
                    "max-h-[inherit] w-full min-w-[var(--trigger-width)] overflow-y-auto p-1 outline-none",
                    className,
                )}
                data-slot="select-listbox"
                {...props}
            >
                {children}
            </AriaListBox>
        </AriaPopover>
    );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof Header>) {
    return (
        <Header
            className={cx("px-2 py-1.5 text-xs text-muted-foreground", className)}
            data-slot="select-label"
            {...props}
        />
    );
}

export interface SelectItemProps extends Omit<AriaListBoxItemProps, "id" | "value"> {
    value?: string;
}

function SelectItem({ className, children, value, ...props }: SelectItemProps) {
    return (
        <AriaListBoxItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none",
                    "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                    className,
                ),
            )}
            data-slot="select-item"
            id={value}
            textValue={typeof children === "string" ? children : undefined}
            {...props}
        >
            {composeRenderProps(children, (children, { isSelected }) => (
                <>
                    <span className="absolute right-2 flex size-3.5 items-center justify-center">
                        {isSelected && <IconCheck className="size-4" />}
                    </span>
                    {children}
                </>
            ))}
        </AriaListBoxItem>
    );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cx("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
            data-slot="select-separator"
            role="separator"
            {...props}
        />
    );
}

// React Aria's ListBox scrolls natively; these exist for shadcn API parity.
function SelectScrollUpButton() {
    return null;
}

function SelectScrollDownButton() {
    return null;
}

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
