"use client";

// Classification: B — React Aria (DialogTrigger / ModalOverlay / Modal /
// Dialog) + compatibility adapters to preserve the shadcn alert-dialog API.
// `AlertDialog` maps shadcn's `open` -> React Aria's `isOpen`; action/cancel
// buttons close via OverlayTriggerStateContext.

import { useContext } from "react";
import {
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
} from "react-aria-components";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cx } from "@/lib/cva";

export interface AlertDialogProps extends Omit<AriaDialogTriggerProps, "isOpen"> {
    open?: boolean;
}

function AlertDialog({ open, ...props }: AlertDialogProps) {
    return <AriaDialogTrigger isOpen={open} {...props} />;
}

function AlertDialogTrigger({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export interface AlertDialogContentProps extends AriaDialogProps {
    size?: "default" | "sm";
}

function AlertDialogContent({ className, size = "default", ...props }: AlertDialogContentProps) {
    return (
        <ModalOverlay
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 data-[entering]:animate-in data-[entering]:fade-in-0 data-[exiting]:animate-out data-[exiting]:fade-out-0"
            data-slot="alert-dialog-overlay"
        >
            <Modal
                className="group/alert-dialog-content w-full max-w-[calc(100%-2rem)] duration-200 data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg"
                data-size={size}
                data-slot="alert-dialog-modal"
            >
                <AriaDialog
                    className={cx(
                        "grid w-full gap-4 rounded-lg border bg-background p-6 shadow-lg outline-none",
                        className,
                    )}
                    data-slot="alert-dialog-content"
                    {...props}
                    role="alertdialog"
                />
            </Modal>
        </ModalOverlay>
    );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
                className,
            )}
            data-slot="alert-dialog-header"
            {...props}
        />
    );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
                className,
            )}
            data-slot="alert-dialog-footer"
            {...props}
        />
    );
}

function AlertDialogTitle({ className, ...props }: HeadingProps) {
    return (
        <Heading
            className={cx(
                "text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
                className,
            )}
            data-slot="alert-dialog-title"
            slot="title"
            {...props}
        />
    );
}

function AlertDialogDescription({ className, ...props }: TextProps) {
    return (
        <Text
            className={cx("text-sm text-muted-foreground", className)}
            data-slot="alert-dialog-description"
            slot="description"
            {...props}
        />
    );
}

function AlertDialogAction({
    onPress,
    variant = "default",
    size = "default",
    ...props
}: ButtonProps) {
    let state = useContext(OverlayTriggerStateContext);

    return (
        <Button
            data-slot="alert-dialog-action"
            onPress={e => {
                onPress?.(e);
                state?.close();
            }}
            size={size}
            variant={variant}
            {...props}
        />
    );
}

function AlertDialogCancel({
    onPress,
    variant = "outline",
    size = "default",
    ...props
}: ButtonProps) {
    let state = useContext(OverlayTriggerStateContext);

    return (
        <Button
            data-slot="alert-dialog-cancel"
            onPress={e => {
                onPress?.(e);
                state?.close();
            }}
            size={size}
            variant={variant}
            {...props}
        />
    );
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
};
