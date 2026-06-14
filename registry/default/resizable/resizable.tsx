// Classification: D — third-party package retained (react-resizable-panels) for parity with shadcn resizable.

"use client";

import type { GroupProps, PanelProps, SeparatorProps } from "react-resizable-panels";

import { IconGripVertical } from "@tabler/icons-react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cx } from "@/lib/cva";

function ResizablePanelGroup({ className, ...props }: GroupProps) {
    return (
        <Group
            className={cx("flex h-full w-full aria-[orientation=vertical]:flex-col", className)}
            data-slot="resizable-panel-group"
            {...props}
        />
    );
}

function ResizablePanel({ ...props }: PanelProps) {
    return <Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
    withHandle,
    className,
    ...props
}: SeparatorProps & {
    withHandle?: boolean;
}) {
    return (
        <Separator
            className={cx(
                "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
                className,
            )}
            data-slot="resizable-handle"
            {...props}
        >
            {withHandle && (
                <div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
                    <IconGripVertical aria-hidden="true" className="size-2.5" />
                </div>
            )}
        </Separator>
    );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
