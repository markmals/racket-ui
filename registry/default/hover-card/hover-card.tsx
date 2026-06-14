"use client";

// Classification: B — React Aria Popover + local hover/focus trigger adapter
// to preserve shadcn's HoverCard export surface.

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type ReactNode,
    type RefObject,
} from "react";
import {
    Popover as AriaPopover,
    type PopoverProps as AriaPopoverProps,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

type HoverCardSide = "top" | "right" | "bottom" | "left";
type HoverCardAlign = "start" | "center" | "end";

interface HoverCardContextValue {
    triggerRef: RefObject<HTMLElement | null>;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    openWithDelay: () => void;
    closeWithDelay: () => void;
    cancelClose: () => void;
}

let HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCardContext(component: string) {
    let context = useContext(HoverCardContext);

    if (!context) {
        throw new Error(`${component} must be used within HoverCard`);
    }

    return context;
}

export interface HoverCardProps {
    children?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    openDelay?: number;
    closeDelay?: number;
}

function HoverCard({
    children,
    open,
    defaultOpen = false,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300,
}: HoverCardProps) {
    let triggerRef = useRef<HTMLElement | null>(null);
    let openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    let closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    let [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

    let isOpen = open ?? uncontrolledOpen;

    let clearOpenTimer = useCallback(() => {
        if (openTimerRef.current) {
            clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
    }, []);

    let clearCloseTimer = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    let setOpen = useCallback(
        (nextOpen: boolean) => {
            if (open === undefined) {
                setUncontrolledOpen(nextOpen);
            }

            onOpenChange?.(nextOpen);
        },
        [onOpenChange, open],
    );

    let openWithDelay = useCallback(() => {
        clearCloseTimer();
        clearOpenTimer();

        if (openDelay <= 0) {
            setOpen(true);
            return;
        }

        openTimerRef.current = setTimeout(() => setOpen(true), openDelay);
    }, [clearCloseTimer, clearOpenTimer, openDelay, setOpen]);

    let closeWithDelay = useCallback(() => {
        clearOpenTimer();
        clearCloseTimer();

        if (closeDelay <= 0) {
            setOpen(false);
            return;
        }

        closeTimerRef.current = setTimeout(() => setOpen(false), closeDelay);
    }, [clearCloseTimer, clearOpenTimer, closeDelay, setOpen]);

    useEffect(
        () => () => {
            clearOpenTimer();
            clearCloseTimer();
        },
        [clearCloseTimer, clearOpenTimer],
    );

    let context = useMemo<HoverCardContextValue>(
        () => ({
            triggerRef,
            isOpen,
            setOpen,
            openWithDelay,
            closeWithDelay,
            cancelClose: clearCloseTimer,
        }),
        [clearCloseTimer, closeWithDelay, isOpen, openWithDelay, setOpen],
    );

    return (
        <HoverCardContext.Provider value={context}>
            <div className="contents" data-slot="hover-card">
                {children}
            </div>
        </HoverCardContext.Provider>
    );
}

export interface HoverCardTriggerProps extends ComponentPropsWithoutRef<"span"> {}

function HoverCardTrigger({
    className,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
    ...props
}: HoverCardTriggerProps) {
    let context = useHoverCardContext("HoverCardTrigger");

    return (
        <span
            className={cx("inline-block", className)}
            data-expanded={context.isOpen ? "" : undefined}
            data-slot="hover-card-trigger"
            onBlur={event => {
                let nextTarget = event.relatedTarget as Node | null;

                if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                    context.closeWithDelay();
                }

                onBlur?.(event);
            }}
            onFocus={event => {
                context.cancelClose();
                context.setOpen(true);
                onFocus?.(event);
            }}
            onPointerEnter={event => {
                context.openWithDelay();
                onPointerEnter?.(event);
            }}
            onPointerLeave={event => {
                context.closeWithDelay();
                onPointerLeave?.(event);
            }}
            ref={node => {
                context.triggerRef.current = node;
            }}
            {...props}
        />
    );
}

export interface HoverCardContentProps extends Omit<
    AriaPopoverProps,
    "children" | "defaultOpen" | "isOpen" | "offset" | "onOpenChange" | "placement" | "triggerRef"
> {
    align?: HoverCardAlign;
    side?: HoverCardSide;
    sideOffset?: number;
    children?: ReactNode;
}

function getPlacement(side: HoverCardSide, align: HoverCardAlign): AriaPopoverProps["placement"] {
    if (align === "center") {
        return side;
    }

    if (side === "left" || side === "right") {
        return `${side} ${align === "start" ? "top" : "bottom"}`;
    }

    return `${side} ${align}`;
}

function HoverCardContent({
    className,
    align = "center",
    side = "bottom",
    sideOffset = 4,
    children,
    onPointerEnter,
    onPointerLeave,
    ...props
}: HoverCardContentProps) {
    let context = useHoverCardContext("HoverCardContent");

    return (
        <AriaPopover
            className={composeRenderProps(className, className =>
                cx(
                    "z-50 w-64 origin-(--trigger-anchor-point) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
                    "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                    "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
                    className,
                ),
            )}
            data-slot="hover-card-content"
            // A hover card is non-modal: `isNonModal` stops React Aria from
            // scroll-locking, aria-hiding the page, and capturing focus into the
            // overlay (which would be wrong for a hover/focus-triggered card).
            isNonModal
            isOpen={context.isOpen}
            offset={sideOffset}
            onOpenChange={context.setOpen}
            onPointerEnter={event => {
                context.cancelClose();
                onPointerEnter?.(event);
            }}
            onPointerLeave={event => {
                context.closeWithDelay();
                onPointerLeave?.(event);
            }}
            placement={getPlacement(side, align)}
            trigger="focus"
            triggerRef={context.triggerRef}
            {...props}
        >
            {/* No Dialog wrapper: a hover card is non-modal and must not steal focus
          from the trigger. Rendering children directly in the Popover keeps it
          a lightweight, focusless overlay (matching shadcn/Radix HoverCard). */}
            {children}
        </AriaPopover>
    );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
