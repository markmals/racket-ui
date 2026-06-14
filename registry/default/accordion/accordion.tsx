"use client";

// Classification: A — direct React Aria DisclosureGroup / Disclosure /
// DisclosurePanel replacement for shadcn's Radix Accordion primitives.

import { IconChevronDown } from "@tabler/icons-react";
import { useContext, useState } from "react";
import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    Disclosure as AriaDisclosure,
    DisclosureGroup as AriaDisclosureGroup,
    type DisclosureGroupProps as AriaDisclosureGroupProps,
    DisclosurePanel as AriaDisclosurePanel,
    type DisclosurePanelProps as AriaDisclosurePanelProps,
    type DisclosureProps as AriaDisclosureProps,
    DisclosureStateContext,
    Heading as AriaHeading,
    type Key,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

type AccordionBaseProps = Omit<
    AriaDisclosureGroupProps,
    "allowsMultipleExpanded" | "expandedKeys" | "defaultExpandedKeys" | "onExpandedChange"
>;

export type AccordionSingleProps = AccordionBaseProps & {
    type?: "single";
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    collapsible?: boolean;
};

export type AccordionMultipleProps = AccordionBaseProps & {
    type: "multiple";
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    collapsible?: never;
};

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

function getExpandedKeys(value: string | string[] | undefined) {
    if (value === undefined) {
        return undefined;
    }

    return Array.isArray(value) ? value : value ? [value] : [];
}

function getAccordionValue(keys: Set<Key>, type: AccordionProps["type"]) {
    if (type === "multiple") {
        return Array.from(keys, String);
    }

    return String(keys.values().next().value ?? "");
}

function Accordion({
    className,
    type = "single",
    value,
    defaultValue,
    onValueChange,
    collapsible,
    ...props
}: AccordionProps) {
    let [uncontrolledExpandedKeys, setUncontrolledExpandedKeys] = useState(
        () => new Set<Key>(getExpandedKeys(defaultValue)),
    );
    let isControlled = value !== undefined;
    let expandedKeys = isControlled
        ? new Set<Key>(getExpandedKeys(value))
        : uncontrolledExpandedKeys;

    return (
        <AriaDisclosureGroup
            allowsMultipleExpanded={type === "multiple"}
            className={composeRenderProps(className, className => cx(className))}
            data-slot="accordion"
            expandedKeys={expandedKeys}
            onExpandedChange={keys => {
                if (
                    type === "single" &&
                    collapsible !== true &&
                    expandedKeys.size > 0 &&
                    keys.size === 0
                ) {
                    return;
                }

                if (!isControlled) {
                    setUncontrolledExpandedKeys(keys);
                }

                (onValueChange as ((value: string | string[]) => void) | undefined)?.(
                    getAccordionValue(keys, type),
                );
            }}
            {...props}
        />
    );
}

export interface AccordionItemProps extends Omit<AriaDisclosureProps, "id"> {
    value: string;
}

function AccordionItem({ className, value, ...props }: AccordionItemProps) {
    return (
        <AriaDisclosure
            className={composeRenderProps(className, className =>
                cx("border-b last:border-b-0", className),
            )}
            data-slot="accordion-item"
            id={value}
            {...props}
        />
    );
}

function AccordionTrigger({ className, children, ...props }: AriaButtonProps) {
    let state = useContext(DisclosureStateContext);

    return (
        <AriaHeading className="flex">
            <AriaButton
                className={composeRenderProps(className, className =>
                    cx(
                        "flex flex-1 cursor-default items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50 [&[data-expanded]>svg]:rotate-180",
                        className,
                    ),
                )}
                data-expanded={state?.isExpanded || undefined}
                data-slot="accordion-trigger"
                slot="trigger"
                {...props}
            >
                {composeRenderProps(children, children => (
                    <>
                        {children}
                        <IconChevronDown
                            aria-hidden="true"
                            className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
                        />
                    </>
                ))}
            </AriaButton>
        </AriaHeading>
    );
}

export interface AccordionContentProps extends Omit<AriaDisclosurePanelProps, "className"> {
    className?: string;
}

function AccordionContent({ className, children, ...props }: AccordionContentProps) {
    let state = useContext(DisclosureStateContext);

    return (
        <AriaDisclosurePanel
            className="overflow-hidden text-sm data-[expanded]:animate-accordion-down [&:not([data-expanded])]:animate-accordion-up"
            data-expanded={state?.isExpanded || undefined}
            data-slot="accordion-content"
            {...props}
        >
            <div className={cx("pt-0 pb-4", className)}>{children}</div>
        </AriaDisclosurePanel>
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
