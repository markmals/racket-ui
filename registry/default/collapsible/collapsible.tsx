"use client";

// Classification: A - direct React Aria Disclosure / Button /
// DisclosurePanel replacement for shadcn's Radix Collapsible primitives.

import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    Disclosure as AriaDisclosure,
    DisclosurePanel as AriaDisclosurePanel,
    type DisclosurePanelProps as AriaDisclosurePanelProps,
    type DisclosureProps as AriaDisclosureProps,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

function Collapsible({ className, ...props }: AriaDisclosureProps) {
    return (
        <AriaDisclosure
            className={composeRenderProps(className, className => cx(className))}
            data-slot="collapsible"
            {...props}
        />
    );
}

function CollapsibleTrigger({ className, ...props }: AriaButtonProps) {
    return (
        <AriaButton
            className={composeRenderProps(className, className => cx(className))}
            data-slot="collapsible-trigger"
            slot="trigger"
            {...props}
        />
    );
}

function CollapsibleContent({ className, ...props }: AriaDisclosurePanelProps) {
    return (
        <AriaDisclosurePanel
            className={composeRenderProps(className, className => cx(className))}
            data-slot="collapsible-content"
            {...props}
        />
    );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
