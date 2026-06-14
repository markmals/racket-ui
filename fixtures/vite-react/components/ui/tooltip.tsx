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
                    <OverlayArrow>
                        <div className="size-2.5 rotate-45 rounded-[2px] bg-foreground" />
                    </OverlayArrow>
                    {children}
                </>
            ))}
        </AriaTooltip>
    );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
