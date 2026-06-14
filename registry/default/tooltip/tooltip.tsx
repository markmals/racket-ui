"use client";

// Classification: A/B — React Aria (TooltipTrigger / Tooltip / OverlayArrow).
// Notes: React Aria has no provider, so `TooltipProvider` is a pass-through and
// the delay lives on each `Tooltip` (`delay`/`closeDelay`, defaulted to shadcn's
// instant behavior). Animations use `data-[entering]`/`data-[exiting]`.

import {
    OverlayArrow,
    Tooltip as AriaTooltip,
    type TooltipProps as AriaTooltipProps,
    TooltipTrigger as AriaTooltipTrigger,
    type TooltipTriggerComponentProps,
    composeRenderProps,
} from "react-aria-components";

import { cx } from "@/lib/cva";

function TooltipProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

function Tooltip({ delay = 0, closeDelay = 0, ...props }: TooltipTriggerComponentProps) {
    return <AriaTooltipTrigger closeDelay={closeDelay} delay={delay} {...props} />;
}

function TooltipTrigger({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export interface TooltipContentProps extends AriaTooltipProps {
    sideOffset?: number;
}

function TooltipContent({ className, sideOffset = 0, children, ...props }: TooltipContentProps) {
    return (
        <AriaTooltip
            className={composeRenderProps(className, className =>
                cx(
                    "z-50 w-fit rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background",
                    "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
                    "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                    "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
                    className,
                ),
            )}
            data-slot="tooltip-content"
            offset={sideOffset}
            {...props}
        >
            {composeRenderProps(children, children => (
                <>
                    <OverlayArrow className="group">
                        {/* A real triangle (not a rotated square) that points at the
                trigger; React Aria sets data-placement so we rotate per side. */}
                        <svg
                            aria-hidden="true"
                            className="block fill-foreground group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90"
                            height={5}
                            viewBox="0 0 10 5"
                            width={10}
                        >
                            <path d="M0 0 L5 5 L10 0 Z" />
                        </svg>
                    </OverlayArrow>
                    {children}
                </>
            ))}
        </AriaTooltip>
    );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
