"use client";

// Classification: B — React Aria (ComboBox / Input / Button / Popover /
// ListBox / ListBoxItem) + compatibility adapters. shadcn's `value`-keyed API
// is preserved: `Combobox` accepts `value`/`defaultValue`/`onValueChange`, and
// `ComboboxItem` accepts `value` (mapped to React Aria's `id`/`selectedKey`).

import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import {
    Children,
    isValidElement,
    type ComponentProps,
    type ReactElement,
    type ReactNode,
} from "react";
import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    ComboBox as AriaComboBox,
    type ComboBoxProps as AriaComboBoxProps,
    Input as AriaInput,
    type InputProps as AriaInputProps,
    ListBox as AriaListBox,
    ListBoxItem as AriaListBoxItem,
    type ListBoxItemProps as AriaListBoxItemProps,
    ListBoxSection,
    type ListBoxSectionProps,
    type ListBoxProps as AriaListBoxProps,
    Popover as AriaPopover,
    type PopoverProps as AriaPopoverProps,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

export interface ComboboxProps extends Omit<
    AriaComboBoxProps<object>,
    | "value"
    | "defaultValue"
    | "onChange"
    | "selectedKey"
    | "defaultSelectedKey"
    | "onSelectionChange"
> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}

function Combobox({ className, value, defaultValue, onValueChange, ...props }: ComboboxProps) {
    return (
        <AriaComboBox
            className={composeRenderProps(className, className =>
                cx(
                    "group/combobox flex min-h-9 w-full items-center gap-1 rounded-md border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] outline-none",
                    "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    "data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 dark:data-[invalid]:ring-destructive/40",
                    "dark:bg-input/30",
                    className,
                ),
            )}
            data-slot="combobox"
            defaultSelectedKey={defaultValue}
            onSelectionChange={
                onValueChange
                    ? key => {
                          if (key != null) {
                              onValueChange(String(key));
                          }
                      }
                    : undefined
            }
            selectedKey={value}
            {...props}
        />
    );
}

function ComboboxInput({ className, ...props }: AriaInputProps) {
    return (
        <AriaInput
            className={composeRenderProps(className, className =>
                cx(
                    "min-w-16 flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                    "data-[disabled]:cursor-not-allowed",
                    className,
                ),
            )}
            data-slot="combobox-input"
            {...props}
        />
    );
}

function ComboboxTrigger({ className, children, ...props }: AriaButtonProps) {
    return (
        <AriaButton
            className={composeRenderProps(className, className =>
                cx(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none",
                    "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
                    "data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
                    "data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    className,
                ),
            )}
            data-slot="combobox-trigger"
            {...props}
        >
            {composeRenderProps(children, children => (
                <>
                    {children}
                    <IconChevronDown
                        aria-hidden="true"
                        className="size-4"
                        data-slot="combobox-trigger-icon"
                    />
                </>
            ))}
        </AriaButton>
    );
}

export interface ComboboxContentProps extends Omit<AriaPopoverProps, "children"> {
    children?: ReactNode;
    listBoxClassName?: AriaListBoxProps<object>["className"];
}

function ComboboxContent({
    className,
    children,
    listBoxClassName,
    offset = 6,
    ...props
}: ComboboxContentProps) {
    let childArray = Children.toArray(children);
    let emptyState = childArray.find(isComboboxEmptyElement);
    let listBoxChildren = childArray.filter(child => !isComboboxEmptyElement(child));

    return (
        <AriaPopover
            className={composeRenderProps(className, className =>
                cx(
                    "group/combobox-content z-50 max-h-96 w-(--trigger-width) min-w-[var(--trigger-width)] origin-(--trigger-anchor-point) overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
                    "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                    "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                    className,
                ),
            )}
            data-slot="combobox-content"
            offset={offset}
            {...props}
        >
            <AriaListBox
                className={composeRenderProps(listBoxClassName, className =>
                    cx(
                        "max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-1 outline-none data-[empty]:p-0",
                        className,
                    ),
                )}
                data-slot="combobox-list"
                renderEmptyState={() => emptyState ?? null}
            >
                {listBoxChildren}
            </AriaListBox>
        </AriaPopover>
    );
}

export interface ComboboxItemProps extends Omit<AriaListBoxItemProps, "id" | "value"> {
    value?: string;
}

function ComboboxItem({ className, children, value, ...props }: ComboboxItemProps) {
    return (
        <AriaListBoxItem
            className={composeRenderProps(className, className =>
                cx(
                    "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none",
                    "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    className,
                ),
            )}
            data-slot="combobox-item"
            id={value}
            textValue={typeof children === "string" ? children : undefined}
            {...props}
        >
            {composeRenderProps(children, (children, { isSelected }) => (
                <>
                    {children}
                    <span
                        className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
                        data-slot="combobox-item-indicator"
                    >
                        {isSelected && (
                            <IconCheck
                                aria-hidden="true"
                                className="pointer-events-none size-4 pointer-coarse:size-5"
                            />
                        )}
                    </span>
                </>
            ))}
        </AriaListBoxItem>
    );
}

function ComboboxGroup(props: ListBoxSectionProps<object>) {
    return <ListBoxSection data-slot="combobox-group" {...props} />;
}

type ComboboxEmptyProps = ComponentProps<"div">;

function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
    return (
        <div
            className={cx(
                "flex w-full justify-center py-2 text-center text-sm text-muted-foreground",
                className,
            )}
            data-slot="combobox-empty"
            {...props}
        />
    );
}

function isComboboxEmptyElement(child: ReactNode): child is ReactElement<ComboboxEmptyProps> {
    return isValidElement(child) && child.type === ComboboxEmpty;
}

export {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxTrigger,
};
