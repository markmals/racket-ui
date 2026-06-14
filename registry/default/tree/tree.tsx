"use client";

// Classification: A — direct React Aria Components replacement (RAC Tree /
// TreeItem / TreeItemContent). No shadcn equivalent exists; styled to match
// shadcn/racket-ui visual language (accent bg on selection, focus ring, chevron
// expand/collapse, optional leading icon, level-based indentation).

import type { ReactNode } from "react";

import { IconChevronRight } from "@tabler/icons-react";
import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    Tree as AriaTree,
    type TreeProps as AriaTreeProps,
    TreeItem as AriaTreeItem,
    type TreeItemProps as AriaTreeItemProps,
    TreeItemContent as AriaTreeItemContent,
    type TreeItemContentRenderProps,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

// ---------------------------------------------------------------------------
// Tree
// ---------------------------------------------------------------------------

export interface TreeProps<T> extends Omit<AriaTreeProps<T>, "className"> {
    className?: string;
}

function Tree<T extends object>({ className, ...props }: TreeProps<T>) {
    return (
        <AriaTree
            className={cx(
                "flex flex-col gap-0.5 outline-none",
                "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/50",
                className,
            )}
            data-slot="tree"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// TreeItem
// ---------------------------------------------------------------------------

export interface TreeItemProps<T = object> extends AriaTreeItemProps<T> {}

function TreeItem<T extends object>({ className, children, ...props }: TreeItemProps<T>) {
    return (
        <AriaTreeItem
            className={composeRenderProps(
                className,
                (className, { isSelected, isFocusVisible, isDisabled }) =>
                    cx(
                        "relative cursor-default outline-none select-none",
                        isSelected && "rounded-md bg-accent text-accent-foreground",
                        isFocusVisible &&
                            "rounded-md ring-2 ring-ring/50 ring-offset-1 ring-offset-background",
                        isDisabled && "pointer-events-none opacity-50",
                        className,
                    ),
            )}
            data-slot="tree-item"
            {...props}
        >
            {children}
        </AriaTreeItem>
    );
}

// ---------------------------------------------------------------------------
// TreeItemContent — the styled row rendered inside each TreeItem
// ---------------------------------------------------------------------------

export interface TreeItemContentProps {
    /** Optional icon rendered before the item label. */
    icon?: ReactNode;
    /** The label text or content. */
    children?: ReactNode;
    /** Extra className merged onto the content row. */
    className?: string;
}

function TreeItemContent({ icon, children, className }: TreeItemContentProps) {
    return (
        <AriaTreeItemContent>
            {({ level, hasChildItems, isExpanded }: TreeItemContentRenderProps) => (
                <div
                    className={cx(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                        className,
                    )}
                    data-slot="tree-item-content"
                    style={{ paddingLeft: `calc(${level - 1} * 1rem)` }}
                >
                    {/* Expand / collapse chevron — only rendered for branch items */}
                    <TreeExpandButton hasChildItems={hasChildItems} isExpanded={isExpanded} />

                    {/* Optional leading icon */}
                    {icon != null && (
                        <span
                            aria-hidden="true"
                            className="flex size-4 shrink-0 items-center justify-center text-muted-foreground"
                            data-slot="tree-item-icon"
                        >
                            {icon}
                        </span>
                    )}

                    {/* Label */}
                    <span className="flex-1 truncate" data-slot="tree-item-label">
                        {children}
                    </span>
                </div>
            )}
        </AriaTreeItemContent>
    );
}

// ---------------------------------------------------------------------------
// TreeExpandButton — internal chevron button
// ---------------------------------------------------------------------------

interface TreeExpandButtonProps extends Omit<AriaButtonProps, "children" | "className"> {
    hasChildItems: boolean;
    isExpanded: boolean;
}

function TreeExpandButton({ hasChildItems, isExpanded, ...props }: TreeExpandButtonProps) {
    if (!hasChildItems) {
        // Reserve the same space so labels align, but render nothing interactive.
        return <span aria-hidden="true" className="size-4 shrink-0" />;
    }

    return (
        <AriaButton
            aria-label={isExpanded ? "Collapse" : "Expand"}
            className={cx(
                "flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-transform duration-150 outline-none",
                "data-[hovered]:text-foreground",
                "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/50",
                isExpanded && "rotate-90",
            )}
            data-slot="tree-expand-button"
            slot="chevron"
            {...props}
        >
            <IconChevronRight aria-hidden="true" className="size-4" />
        </AriaButton>
    );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Tree, TreeItem, TreeItemContent };
