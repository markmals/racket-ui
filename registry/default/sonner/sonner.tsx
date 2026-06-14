"use client";

// Classification: A — React Aria UNSTABLE_ToastRegion / UNSTABLE_Toast primitives.
// Replaces the `sonner` package with React Aria's built-in toast system.
// A module-level UNSTABLE_ToastQueue drives a `toast` helper object (mirrors
// the shadcn/sonner `toast()` call-site API) and a <Toaster> component that
// renders the toast region.

import {
    IconAlertTriangle,
    IconCircleCheck,
    IconInfoCircle,
    IconLoader2,
    IconX,
} from "@tabler/icons-react";
import {
    Button,
    UNSTABLE_Toast,
    UNSTABLE_ToastContent,
    UNSTABLE_ToastQueue,
    UNSTABLE_ToastRegion,
    composeRenderProps,
    type ToastProps as AriaToastProps,
    type ToastRegionProps as AriaToastRegionProps,
    type QueuedToast,
} from "react-aria-components";

import { cx } from "@/lib/cva";

// ---------------------------------------------------------------------------
// Toast content type
// ---------------------------------------------------------------------------

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastContent {
    title: string;
    description?: string;
    variant?: ToastVariant;
}

// ---------------------------------------------------------------------------
// Module-level queue (shared singleton)
// ---------------------------------------------------------------------------

let queue = new UNSTABLE_ToastQueue<ToastContent>({ maxVisibleToasts: 5 });

// ---------------------------------------------------------------------------
// `toast` helper — mirrors the shadcn/sonner call-site API
// ---------------------------------------------------------------------------

/** Default auto-dismiss delay (ms). React Aria enforces a 5s minimum. */
const DEFAULT_DURATION = 5000;

export interface ToastOptions {
    description?: string;
    /**
     * Auto-dismiss delay in ms. Defaults to 5000. Pass `Infinity` to keep the
     * toast until it is dismissed manually (by the close button or `toast.dismiss`).
     */
    duration?: number;
}

function add(content: ToastContent, duration: number = DEFAULT_DURATION) {
    return queue.add(content, Number.isFinite(duration) ? { timeout: duration } : {});
}

function toastBase(title: string, opts?: ToastOptions) {
    return add({ title, description: opts?.description }, opts?.duration);
}

toastBase.success = (title: string, opts?: ToastOptions) =>
    add({ title, description: opts?.description, variant: "success" }, opts?.duration);

toastBase.error = (title: string, opts?: ToastOptions) =>
    add({ title, description: opts?.description, variant: "error" }, opts?.duration);

toastBase.warning = (title: string, opts?: ToastOptions) =>
    add({ title, description: opts?.description, variant: "warning" }, opts?.duration);

toastBase.info = (title: string, opts?: ToastOptions) =>
    add({ title, description: opts?.description, variant: "info" }, opts?.duration);

/** Dismiss a toast by the key returned from a `toast(...)` call. */
toastBase.dismiss = (key: string) => queue.close(key);

export const toast = toastBase;

// ---------------------------------------------------------------------------
// Per-variant icon
// ---------------------------------------------------------------------------

function VariantIcon({ variant }: { variant?: ToastVariant }) {
    let cls = "size-4 shrink-0";
    switch (variant) {
        case "success":
            return <IconCircleCheck aria-hidden="true" className={cx(cls, "text-green-500")} />;
        case "error":
            return <IconAlertTriangle aria-hidden="true" className={cx(cls, "text-destructive")} />;
        case "warning":
            return <IconAlertTriangle aria-hidden="true" className={cx(cls, "text-yellow-500")} />;
        case "info":
            return <IconInfoCircle aria-hidden="true" className={cx(cls, "text-blue-500")} />;
        default:
            return (
                <IconLoader2
                    aria-hidden="true"
                    className={cx(cls, "animate-spin text-muted-foreground")}
                />
            );
    }
}

// ---------------------------------------------------------------------------
// ToastItem — renders a single queued toast
// ---------------------------------------------------------------------------

interface ToastItemProps extends Omit<AriaToastProps<ToastContent>, "toast"> {
    toast: QueuedToast<ToastContent>;
}

function ToastItem({ toast: queuedToast, className, ...props }: ToastItemProps) {
    let { title, description, variant } = queuedToast.content;

    return (
        <UNSTABLE_Toast
            className={composeRenderProps(className, className =>
                cx(
                    "group relative flex w-full items-start gap-3 rounded-lg border bg-background p-4 shadow-lg",
                    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focused]:outline-none",
                    className,
                ),
            )}
            data-slot="toast"
            toast={queuedToast}
            {...props}
        >
            {/* Variant icon */}
            <VariantIcon variant={variant} />

            {/* Content */}
            <UNSTABLE_ToastContent className="flex-1 space-y-0.5" data-slot="toast-content">
                <div className="text-sm font-medium" data-slot="toast-title">
                    {title}
                </div>
                {description && (
                    <div className="text-sm text-muted-foreground" data-slot="toast-description">
                        {description}
                    </div>
                )}
            </UNSTABLE_ToastContent>

            {/* Close button */}
            <Button
                aria-label="Close notification"
                className={cx(
                    "shrink-0 rounded-xs opacity-60 transition-opacity outline-none",
                    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[hovered]:opacity-100",
                    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                )}
                data-slot="toast-close"
                slot="close"
            >
                <IconX aria-hidden="true" />
            </Button>
        </UNSTABLE_Toast>
    );
}

// ---------------------------------------------------------------------------
// Toaster — the region rendered once in the app layout
// ---------------------------------------------------------------------------

export interface ToasterProps extends Omit<
    AriaToastRegionProps<ToastContent>,
    "queue" | "children"
> {
    /** Position of the toast region. Defaults to 'bottom-right'. */
    position?:
        | "top-left"
        | "top-center"
        | "top-right"
        | "bottom-left"
        | "bottom-center"
        | "bottom-right";
}

let positionClasses: Record<NonNullable<ToasterProps["position"]>, string> = {
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
};

function Toaster({ position = "bottom-right", className, ...props }: ToasterProps) {
    return (
        <UNSTABLE_ToastRegion
            className={composeRenderProps(className, className =>
                cx(
                    "fixed z-[100] flex w-full max-w-sm flex-col gap-2",
                    positionClasses[position],
                    className,
                ),
            )}
            data-slot="toaster"
            queue={queue}
            {...props}
        >
            {({ toast: queuedToast }) => <ToastItem key={queuedToast.key} toast={queuedToast} />}
        </UNSTABLE_ToastRegion>
    );
}

export { Toaster };
