"use client";

// Classification: D — third-party package (@tanstack/react-form v1) retained for
// parity. Provides shadcn-styled, TanStack Form–compatible form primitives.
//
// TanStack Form v1 paradigm (differs from react-hook-form):
//   • No `control` prop. The form object returned by `useForm()` is self-contained.
//   • Fields are rendered via `<form.Field name="...">` (render-prop).
//   • Field errors live on `field.state.meta.errors` (an array of ValidationError).
//   • Re-exported `useForm` from @tanstack/react-form is the primary entry point.
//
// Usage:
//   const form = useForm({ defaultValues: { email: "" } })
//
//   <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
//     <form.Field name="email">
//       {(field) => (
//         <FormItem>
//           <FormLabel>Email</FormLabel>
//           {/* FormControl injects id + aria-* onto the child input. */}
//           <FormControl field={field}>
//             <Input value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value)}
//               onBlur={field.handleBlur} />
//           </FormControl>
//           <FormDescription>Your email address.</FormDescription>
//           <FormMessage field={field} />
//         </FormItem>
//       )}
//     </form.Field>
//   </form>

import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import {
    cloneElement,
    createContext,
    isValidElement,
    useContext,
    useId,
    type ComponentProps,
    type ComponentType,
    type ReactElement,
    type ReactNode,
} from "react";

import { Label } from "@/components/ui/label";
import { cx } from "@/lib/cva";

// ---------------------------------------------------------------------------
// Re-export useForm so consumers import from one place
// ---------------------------------------------------------------------------
export { useForm };

// ---------------------------------------------------------------------------
// getErrorMessage — a TanStack ValidationError is either a string or an issue
// object (`{ message: string }`). Normalize to a display string; anything else
// maps to undefined rather than a useless "[object Object]".
// ---------------------------------------------------------------------------
function getErrorMessage(error: unknown): string | undefined {
    if (typeof error === "string") return error;
    if (error != null && typeof error === "object" && "message" in error) {
        let { message } = error as { message: unknown };
        return typeof message === "string" ? message : undefined;
    }
    return undefined;
}

// ---------------------------------------------------------------------------
// FormItemContext — provides generated id down to sub-parts
// ---------------------------------------------------------------------------
interface FormItemContextValue {
    id: string;
}

let FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

// ---------------------------------------------------------------------------
// FieldContext — passes the TanStack FieldApi down from FormControl/FormMessage
// ---------------------------------------------------------------------------
interface FieldContextValue {
    field: AnyFieldApi | null;
}

let FieldContext = createContext<FieldContextValue>({ field: null });

// ---------------------------------------------------------------------------
// useFormField — bridge hook that exposes id fragments + field error state
// ---------------------------------------------------------------------------
function useFormField() {
    let itemContext = useContext(FormItemContext);
    let fieldContext = useContext(FieldContext);

    if (!itemContext.id) {
        throw new Error("useFormField must be used within <FormItem>");
    }

    let { id } = itemContext;
    let field = fieldContext.field;

    let errors: unknown[] = field?.state.meta.errors ?? [];
    let errorMessage = getErrorMessage(errors[0]);

    return {
        id,
        name: field?.name as string | undefined,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        error: errorMessage,
        errors,
    };
}

// ---------------------------------------------------------------------------
// Form — thin provider shell. Pass your <form> element as a child.
// This exists so the export surface mirrors shadcn; consumers use `useForm` to
// create the form instance and render the native <form> element themselves.
// ---------------------------------------------------------------------------
function Form({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

// ---------------------------------------------------------------------------
// FormItem — grid wrapper that seeds a unique id via context
// ---------------------------------------------------------------------------
function FormItem({ className, ...props }: ComponentProps<"div">) {
    let id = useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={cx("grid gap-2", className)} data-slot="form-item" {...props} />
        </FormItemContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// FormLabel — wires to the field input and styles red on error
// ---------------------------------------------------------------------------
interface FormLabelProps extends ComponentProps<typeof Label> {
    /** Optional: override the field id to use. Defaults to formItemId from context. */
    htmlFor?: string;
}

function FormLabel({ className, htmlFor, ...props }: FormLabelProps) {
    let { error, formItemId } = useFormField();

    return (
        <Label
            className={cx("data-[error=true]:text-destructive", className)}
            data-error={!!error}
            data-slot="form-label"
            htmlFor={htmlFor ?? formItemId}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// FormControl — clones the child input to wire id + aria-describedby +
// aria-invalid directly onto it (React Aria has no Slot, so we use
// cloneElement — the equivalent of shadcn's Radix Slot), and seeds the
// FieldContext so FormMessage can read errors. The child must be a single
// element (an input, Textarea, RAC field, etc.).
// ---------------------------------------------------------------------------
interface FormControlProps {
    /**
     * The TanStack FieldApi instance from the `form.Field` render prop.
     * Pass `field` here so FormMessage / useFormField can read errors.
     */
    field?: AnyFieldApi;
    children: ReactNode;
}

function FormControl({ field, children }: FormControlProps) {
    let { formDescriptionId, formMessageId, formItemId, error } = useFormField();

    let controlProps = {
        id: formItemId,
        "data-slot": "form-control",
        "aria-describedby": !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`,
        "aria-invalid": !!error || undefined,
    };

    return (
        <FieldContext.Provider value={{ field: field ?? null }}>
            {isValidElement(children)
                ? cloneElement(children as ReactElement<Record<string, unknown>>, controlProps)
                : children}
        </FieldContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// FormDescription — helper text below the input
// ---------------------------------------------------------------------------
function FormDescription({ className, ...props }: ComponentProps<"p">) {
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

// ---------------------------------------------------------------------------
// FormMessage — renders the active field error string
// ---------------------------------------------------------------------------
interface FormMessageProps extends ComponentProps<"p"> {
    /**
     * The TanStack FieldApi instance. Required when FormControl has not already
     * seeded the FieldContext (i.e. when FormMessage is used outside FormControl).
     */
    field?: AnyFieldApi;
}

function FormMessage({ className, children, field: fieldProp, ...props }: FormMessageProps) {
    let { formMessageId } = useFormField();
    let fieldContext = useContext(FieldContext);

    let field = fieldProp ?? fieldContext.field;
    let errorMessage = getErrorMessage(field?.state.meta.errors?.[0]);

    let body = errorMessage ?? children;

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

// ---------------------------------------------------------------------------
// FormField — thin wrapper over TanStack's render-prop Field component.
// Consumers pass `form.Field` as the `Field` prop, or use `form.Field` directly.
// This exists purely for API parity with shadcn's named export surface.
// ---------------------------------------------------------------------------
interface FormFieldProps<TField extends AnyFieldApi = AnyFieldApi> {
    /** The render-prop Field component from TanStack (e.g. `form.Field`). */
    Field: ComponentType<{
        name: string;
        children: (field: TField) => ReactNode;
        [key: string]: unknown;
    }>;
    name: string;
    children: (field: TField) => ReactNode;
    [key: string]: unknown;
}

function FormField<TField extends AnyFieldApi = AnyFieldApi>({
    Field,
    name,
    children,
    ...rest
}: FormFieldProps<TField>) {
    return (
        <Field name={name} {...rest}>
            {children}
        </Field>
    );
}

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
