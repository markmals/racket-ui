"use client";

// Classification: B — React Aria field primitives + compatibility wrappers to
// preserve shadcn's field export surface and visuals.

import { useMemo, type ComponentProps } from "react";
import {
    FieldError as AriaFieldError,
    type FieldErrorProps as AriaFieldErrorProps,
    Label as AriaLabel,
    type LabelProps as AriaLabelProps,
    Separator as AriaSeparator,
    Text,
    type TextFieldProps as AriaTextFieldProps,
    type TextProps,
    TextField as AriaTextField,
    composeRenderProps,
} from "react-aria-components";

import { cva, cx, type VariantProps } from "@/lib/cva";

function FieldSet({ className, ...props }: ComponentProps<"fieldset">) {
    return (
        <fieldset
            className={cx(
                "flex flex-col gap-6",
                "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
                className,
            )}
            data-slot="field-set"
            {...props}
        />
    );
}

function FieldLegend({
    className,
    variant = "legend",
    ...props
}: ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
    return (
        <legend
            className={cx(
                "mb-3 font-medium",
                "data-[variant=legend]:text-base",
                "data-[variant=label]:text-sm",
                className,
            )}
            data-slot="field-legend"
            data-variant={variant}
            {...props}
        />
    );
}

function FieldGroup({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
                className,
            )}
            data-slot="field-group"
            {...props}
        />
    );
}

let fieldVariants = cva({
    base: "group/field flex w-full gap-3 data-[invalid]:text-destructive",
    variants: {
        orientation: {
            vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
            horizontal: [
                "flex-row items-center",
                "[&>[data-slot=field-label]]:flex-auto",
                "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
            ],
            responsive: [
                "flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto",
                "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
                "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
            ],
        },
    },
    defaultVariants: {
        orientation: "vertical",
    },
});

interface FieldProps extends AriaTextFieldProps, VariantProps<typeof fieldVariants> {}

function Field({ className, orientation = "vertical", ...props }: FieldProps) {
    return (
        <AriaTextField
            className={composeRenderProps(className, className =>
                fieldVariants({ orientation, className }),
            )}
            data-orientation={orientation}
            data-slot="field"
            {...props}
        />
    );
}

function FieldContent({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
                className,
            )}
            data-slot="field-content"
            {...props}
        />
    );
}

function FieldLabel({ className, ...props }: AriaLabelProps) {
    return (
        <AriaLabel
            className={cx(
                "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled]/field:opacity-50",
                "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
                "has-data-[selected]:border-primary has-data-[selected]:bg-primary/5 dark:has-data-[selected]:bg-primary/10",
                className,
            )}
            data-slot="field-label"
            {...props}
        />
    );
}

function FieldTitle({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled]/field:opacity-50",
                className,
            )}
            data-slot="field-label"
            {...props}
        />
    );
}

function FieldDescription({ className, ...props }: TextProps) {
    return (
        <Text
            className={cx(
                "text-sm leading-normal font-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance",
                "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
                "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
                className,
            )}
            data-slot="field-description"
            elementType="p"
            slot="description"
            {...props}
        />
    );
}

function FieldSeparator({ children, className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
                className,
            )}
            data-content={!!children}
            data-slot="field-separator"
            {...props}
        >
            <AriaSeparator
                className="absolute inset-0 top-1/2 h-px w-full shrink-0 bg-border"
                data-slot="separator"
            />
            {children && (
                <span
                    className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
                    data-slot="field-separator-content"
                >
                    {children}
                </span>
            )}
        </div>
    );
}

interface FieldErrorProps extends AriaFieldErrorProps {
    errors?: Array<{ message?: string } | undefined>;
}

function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
    let content = useMemo(() => {
        if (children) {
            return children;
        }

        if (!errors?.length) {
            return null;
        }

        let uniqueErrors = [...new Map(errors.map(error => [error?.message, error])).values()];

        if (uniqueErrors.length === 1) {
            return uniqueErrors[0]?.message;
        }

        return (
            <ul className="ml-4 flex list-disc flex-col gap-1">
                {uniqueErrors.map(
                    (error, index) => error?.message && <li key={index}>{error.message}</li>,
                )}
            </ul>
        );
    }, [children, errors]);

    if (errors && !content) {
        return null;
    }

    return (
        <AriaFieldError
            className={composeRenderProps(className, className =>
                cx("text-sm font-normal text-destructive", className),
            )}
            data-slot="field-error"
            elementType="div"
            {...props}
        >
            {content}
        </AriaFieldError>
    );
}

export {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldContent,
    FieldTitle,
};
