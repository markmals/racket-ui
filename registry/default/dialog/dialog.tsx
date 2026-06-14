"use client";

// Classification: B — React Aria overlay (DialogTrigger / ModalOverlay / Modal /
// Dialog) + compatibility adapters to preserve the shadcn export surface and
// usage. Notes:
//   - `Dialog` maps shadcn's `open` -> React Aria's `isOpen`.
//   - `DialogTrigger` is a pass-through; place a `<Button>` (or any RAC
//     pressable) inside it — React Aria wires it as the trigger via context.
//   - Open/close animations use `data-[entering]`/`data-[exiting]` (RAC) instead
//     of Radix's `data-[state]`.

import { IconX } from "@tabler/icons-react";
import { useContext } from "react";
import {
    Button as AriaButton,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    type DialogProps as AriaDialogProps,
    type DialogTriggerProps as AriaDialogTriggerProps,
    Heading,
    type HeadingProps,
    Modal,
    ModalOverlay,
    OverlayTriggerStateContext,
    Text,
    type TextProps,
    composeRenderProps,
} from "react-aria-components";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cx } from "@/lib/cva";

export interface DialogProps extends Omit<AriaDialogTriggerProps, "isOpen"> {
    open?: boolean;
}

function Dialog({ open, ...props }: DialogProps) {
    return <AriaDialogTrigger isOpen={open} {...props} />;
}

function DialogTrigger({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

function DialogPortal({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof ModalOverlay>) {
    return (
        <ModalOverlay
            className={composeRenderProps(className, className =>
                cx(
                    "fixed inset-0 z-50 bg-black/50 data-[entering]:animate-in data-[entering]:fade-in-0 data-[exiting]:animate-out data-[exiting]:fade-out-0",
                    className,
                ),
            )}
            data-slot="dialog-overlay"
            {...props}
        />
    );
}

export interface DialogContentProps extends AriaDialogProps {
    showCloseButton?: boolean;
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: DialogContentProps) {
    return (
        <ModalOverlay
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 data-[entering]:animate-in data-[entering]:fade-in-0 data-[exiting]:animate-out data-[exiting]:fade-out-0"
            data-slot="dialog-overlay"
        >
            <Modal
                className="w-full max-w-[calc(100%-2rem)] data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 sm:max-w-lg"
                data-slot="dialog-modal"
            >
                <AriaDialog
                    className={cx(
                        "relative grid w-full gap-4 rounded-lg border bg-background p-6 shadow-lg outline-none",
                        className,
                    )}
                    data-slot="dialog-content"
                    {...props}
                >
                    {composeRenderProps(children, (children, { close }) => (
                        <>
                            {children}
                            {showCloseButton && (
                                <AriaButton
                                    aria-label="Close"
                                    className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2 data-[hovered]:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                                    data-slot="dialog-close"
                                    onPress={close}
                                >
                                    <IconX />
                                </AriaButton>
                            )}
                        </>
                    ))}
                </AriaDialog>
            </Modal>
        </ModalOverlay>
    );
}

function DialogClose({ onPress, ...props }: ButtonProps) {
    let state = useContext(OverlayTriggerStateContext);
    return (
        <Button
            data-slot="dialog-close"
            onPress={e => {
                onPress?.(e);
                state?.close();
            }}
            {...props}
        />
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cx("flex flex-col gap-2 text-center sm:text-left", className)}
            data-slot="dialog-header"
            {...props}
        />
    );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cx("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
            data-slot="dialog-footer"
            {...props}
        />
    );
}

function DialogTitle({ className, ...props }: HeadingProps) {
    return (
        <Heading
            className={cx("text-lg leading-none font-semibold", className)}
            data-slot="dialog-title"
            slot="title"
            {...props}
        />
    );
}

function DialogDescription({ className, ...props }: TextProps) {
    return (
        <Text
            className={cx("text-sm text-muted-foreground", className)}
            data-slot="dialog-description"
            slot="description"
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
