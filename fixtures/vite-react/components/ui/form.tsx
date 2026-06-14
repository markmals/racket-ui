"use client";

// Classification: D — react-hook-form retained for shadcn ergonomic parity.
// FormControl uses React.cloneElement to forward ids/aria attrs onto the
// immediate child without Radix's Slot dependency.

import * as React from "react";
import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cx } from "@/lib/cva";

// ─── Form (= FormProvider) ───────────────────────────────────────────────────

let Form = FormProvider;

// ─── FormField ───────────────────────────────────────────────────────────────

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

let FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
}

// ─── useFormField ─────────────────────────────────────────────────────────────

function useFormField() {
    let fieldContext = React.useContext(FormFieldContext);
    let itemContext = React.useContext(FormItemContext);
    let { getFieldState } = useFormContext();
    let formState = useFormState({ name: fieldContext.name });
    let fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }

    let { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
}

// ─── FormItem ────────────────────────────────────────────────────────────────

type FormItemContextValue = {
    id: string;
};

let FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
    let id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={cx("grid gap-2", className)} data-slot="form-item" {...props} />
        </FormItemContext.Provider>
    );
}

// ─── FormLabel ───────────────────────────────────────────────────────────────

function FormLabel({ className, ...props }: React.ComponentProps<"label">) {
    let { error, formItemId } = useFormField();

    return (
        <Label
            className={cx("data-[error=true]:text-destructive", className)}
            data-error={!!error}
            data-slot="form-label"
            htmlFor={formItemId}
            {...props}
        />
    );
}

// ─── FormControl ─────────────────────────────────────────────────────────────
// Replaces Radix's <Slot.Root>: clones the single child and merges the
// id / aria-describedby / aria-invalid props onto it.

function FormControl({ children }: { children: React.ReactNode }) {
    let { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    let ariaDescribedBy = !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`;

    let child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>;

    return React.cloneElement(child, {
        "data-slot": "form-control",
        id: formItemId,
        "aria-describedby": ariaDescribedBy,
        "aria-invalid": !!error,
    });
}

// ─── FormDescription ─────────────────────────────────────────────────────────

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
    let { formDescriptionId } = useFormField();

    return (
        <p
            className={cx("text-sm text-muted-foreground", className)}
            data-slot="form-description"
            id={formDescriptionId}
            {...props}
        />
    );
}

// ─── FormMessage ─────────────────────────────────────────────────────────────

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
    let { error, formMessageId } = useFormField();
    let body = error ? String(error?.message ?? "") : children;

    if (!body) {
        return null;
    }

    return (
        <p
            className={cx("text-sm text-destructive", className)}
            data-slot="form-message"
            id={formMessageId}
            {...props}
        >
            {body}
        </p>
    );
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
};
