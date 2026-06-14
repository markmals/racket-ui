"use client";

// Classification: A — direct React Aria Components replacement (RAC DropZone + FileTrigger).
// shadcn has no DropZone component; this is an original racket-ui component styled to match
// the shadcn design system using React Aria's native DropZone and FileTrigger primitives.

import { IconUpload } from "@tabler/icons-react";
import {
    DropZone as AriaDropZone,
    type DropZoneProps as AriaDropZoneProps,
    FileTrigger,
    type FileTriggerProps,
    composeRenderProps,
    Text,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import { cx } from "@/lib/cva";

// ---------------------------------------------------------------------------
// DropZone
// ---------------------------------------------------------------------------

export interface DropZoneProps extends Omit<AriaDropZoneProps, "children"> {
    /** Helper text shown below the icon inside the drop zone. */
    helperText?: string;
    /** Props forwarded to the inner FileTrigger (file picker). */
    fileTriggerProps?: Omit<FileTriggerProps, "children">;
    /** Called when files are selected via the FileTrigger button. */
    onSelect?: FileTriggerProps["onSelect"];
}

function DropZone({
    className,
    helperText = "Drag & drop files here",
    fileTriggerProps,
    onSelect,
    ...props
}: DropZoneProps) {
    return (
        <AriaDropZone
            className={composeRenderProps(className, className =>
                cx(
                    // base layout
                    "flex flex-col items-center justify-center gap-3",
                    "rounded-lg border-2 border-dashed p-8 text-center",
                    "border-border bg-background text-foreground",
                    "transition-colors duration-150 outline-none",
                    // hover state
                    "data-[hovered]:border-primary/60 data-[hovered]:bg-accent/30",
                    // drop-target state (something is being dragged over)
                    "data-[drop-target]:border-primary data-[drop-target]:bg-accent/50",
                    // focus-visible ring
                    "data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50",
                    // disabled
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    className,
                ),
            )}
            data-slot="drop-zone"
            {...props}
        >
            <DropZoneContent
                fileTriggerProps={fileTriggerProps}
                helperText={helperText}
                onSelect={onSelect}
            />
        </AriaDropZone>
    );
}

// ---------------------------------------------------------------------------
// DropZoneContent — the default inner layout (icon + text + button).
// Exported so consumers can suppress it or build a custom one alongside <DropZone>.
// ---------------------------------------------------------------------------

export interface DropZoneContentProps {
    helperText?: string;
    fileTriggerProps?: Omit<FileTriggerProps, "children">;
    onSelect?: FileTriggerProps["onSelect"];
}

function DropZoneContent({
    helperText = "Drag & drop files here",
    fileTriggerProps,
    onSelect,
}: DropZoneContentProps) {
    return (
        <>
            <div aria-hidden="true" data-slot="drop-zone-icon">
                <IconUpload className="size-8 text-muted-foreground" strokeWidth={1.5} />
            </div>

            {helperText && (
                <Text
                    className="text-sm text-muted-foreground"
                    data-slot="drop-zone-helper-text"
                    slot="description"
                >
                    {helperText}
                </Text>
            )}

            <FileTrigger onSelect={onSelect} {...fileTriggerProps}>
                <Button data-slot="drop-zone-trigger" size="sm" variant="outline">
                    Select files
                </Button>
            </FileTrigger>
        </>
    );
}

export { DropZone, DropZoneContent };
