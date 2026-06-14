"use client";

// Classification: B — React Aria overlay (DialogTrigger / ModalOverlay / Modal /
// Dialog) + compatibility adapters to preserve the shadcn sheet export surface.
// `SheetContent` renders the modal as an edge panel; open/close animations use
// React Aria's `data-[entering]`/`data-[exiting]` attributes.

import { IconX } from "@tabler/icons-react";
import { useContext, type ComponentProps, type ReactNode } from "react";
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
import { cva, cx, type VariantProps } from "@/lib/cva";

let sheetContentVariants = cva({
    base: "fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[entering]:animate-in data-[entering]:duration-500 data-[exiting]:animate-out data-[exiting]:duration-300",
    variants: {
        side: {
            top: "inset-x-0 top-0 h-auto border-b data-[entering]:slide-in-from-top data-[exiting]:slide-out-to-top",
            right: "inset-y-0 right-0 h-full w-3/4 border-l data-[entering]:slide-in-from-right data-[exiting]:slide-out-to-right sm:max-w-sm",
            bottom: "inset-x-0 bottom-0 h-auto border-t data-[entering]:slide-in-from-bottom data-[exiting]:slide-out-to-bottom",
            left: "inset-y-0 left-0 h-full w-3/4 border-r data-[entering]:slide-in-from-left data-[exiting]:slide-out-to-left sm:max-w-sm",
        },
    },
    defaultVariants: {
        side: "right",
    },
});

export interface SheetProps extends Omit<AriaDialogTriggerProps, "isOpen"> {
    open?: boolean;
}

function Sheet({ open, ...props }: SheetProps) {
    return <AriaDialogTrigger isOpen={open} {...props} />;
}

function SheetTrigger({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

function SheetClose({ onPress, ...props }: ButtonProps) {
    let state = useContext(OverlayTriggerStateContext);
    return (
        <Button
            data-slot="sheet-close"
            onPress={e => {
                onPress?.(e);
                state?.close();
            }}
            {...props}
        />
    );
}

export interface SheetContentProps
    extends AriaDialogProps, VariantProps<typeof sheetContentVariants> {
    showCloseButton?: boolean;
}

function SheetContent({
    className,
    children,
    side = "right",
    showCloseButton = true,
    ...props
}: SheetContentProps) {
    return (
        <ModalOverlay
            className="fixed inset-0 z-50 bg-black/50 data-[entering]:animate-in data-[entering]:fade-in-0 data-[exiting]:animate-out data-[exiting]:fade-out-0"
            data-slot="sheet-overlay"
        >
            <Modal
                className={composeRenderProps(className, className =>
                    sheetContentVariants({ side, className }),
                )}
                data-slot="sheet-content"
            >
                <AriaDialog
                    className="relative flex h-full w-full flex-col gap-4 outline-none"
                    {...props}
                >
                    {composeRenderProps(children, (children, { close }) => (
                        <>
                            {children}
                            {showCloseButton && (
                                <AriaButton
                                    aria-label="Close"
                                    className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity outline-none data-[disabled]:pointer-events-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2 data-[hovered]:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                                    data-slot="sheet-close"
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

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("flex flex-col gap-1.5 p-4", className)}
            data-slot="sheet-header"
            {...props}
        />
    );
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("mt-auto flex flex-col gap-2 p-4", className)}
            data-slot="sheet-footer"
            {...props}
        />
    );
}

function SheetTitle({ className, ...props }: HeadingProps) {
    return (
        <Heading
            className={cx("font-semibold text-foreground", className)}
            data-slot="sheet-title"
            slot="title"
            {...props}
        />
    );
}

function SheetDescription({ className, ...props }: TextProps) {
    return (
        <Text
            className={cx("text-sm text-muted-foreground", className)}
            data-slot="sheet-description"
            slot="description"
            {...props}
        />
    );
}

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
};
