"use client";

// Classification: B — React Aria (Tabs/TabList/Tab/TabPanel) + compatibility
// adapter. shadcn's `value`-keyed API is preserved: `Tabs` accepts
// `value`/`defaultValue`/`onValueChange`, and `TabsTrigger`/`TabsContent` accept
// `value` (mapped to React Aria's `id`/`selectedKey`).

import {
    Tab as AriaTab,
    TabList as AriaTabList,
    type TabListProps,
    TabPanel as AriaTabPanel,
    type TabPanelProps,
    type TabProps,
    Tabs as AriaTabs,
    type TabsProps as AriaTabsProps,
    composeRenderProps,
} from "react-aria-components";

import { cva, cx, type VariantProps } from "@/lib/cva";

export interface TabsProps extends Omit<
    AriaTabsProps,
    "selectedKey" | "defaultSelectedKey" | "onSelectionChange"
> {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}

function Tabs({ className, value, defaultValue, onValueChange, ...props }: TabsProps) {
    return (
        <AriaTabs
            className={composeRenderProps(className, className =>
                cx("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className),
            )}
            data-slot="tabs"
            defaultSelectedKey={defaultValue}
            onSelectionChange={onValueChange ? key => onValueChange(String(key)) : undefined}
            selectedKey={value}
            {...props}
        />
    );
}

let tabsListVariants = cva({
    base: "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
    variants: {
        variant: {
            default: "bg-muted",
            line: "gap-1 bg-transparent",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

function TabsList({
    className,
    variant = "default",
    ...props
}: TabListProps<object> & VariantProps<typeof tabsListVariants>) {
    return (
        <AriaTabList
            className={composeRenderProps(className, className =>
                tabsListVariants({ variant, className }),
            )}
            data-slot="tabs-list"
            data-variant={variant}
            {...props}
        />
    );
}

let tabsTriggerVariants = cva({
    base: [
        "relative inline-flex h-[calc(100%-1px)] flex-1 cursor-default items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all outline-none select-none",
        "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        "data-[hovered]:text-foreground dark:text-muted-foreground dark:data-[hovered]:text-foreground",
        "data-[focus-visible]:border-ring data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50 data-[focus-visible]:outline-1 data-[focus-visible]:outline-ring",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "group-data-[variant=default]/tabs-list:data-[selected]:shadow-sm group-data-[variant=line]/tabs-list:data-[selected]:shadow-none",
        "data-[selected]:bg-background data-[selected]:text-foreground dark:data-[selected]:border-input dark:data-[selected]:bg-input/30 dark:data-[selected]:text-foreground",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[selected]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[selected]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[selected]:bg-transparent",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[selected]:after:opacity-100",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ],
});

export interface TabsTriggerProps extends Omit<TabProps, "id"> {
    value: string;
}

function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
    return (
        <AriaTab
            className={composeRenderProps(className, className =>
                tabsTriggerVariants({ className }),
            )}
            data-slot="tabs-trigger"
            id={value}
            {...props}
        />
    );
}

export interface TabsContentProps extends Omit<TabPanelProps, "id"> {
    value: string;
}

function TabsContent({ className, value, ...props }: TabsContentProps) {
    return (
        <AriaTabPanel
            className={composeRenderProps(className, className =>
                cx("flex-1 outline-none", className),
            )}
            data-slot="tabs-content"
            id={value}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
