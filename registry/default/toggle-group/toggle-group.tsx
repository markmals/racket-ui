"use client";

// Classification: A — direct React Aria Components replacement (RAC
// ToggleButtonGroup + ToggleButton). Compat note: ToggleGroupItem accepts
// `value` as a shadcn-style alias for React Aria's `id`.

import { createContext, useContext, type CSSProperties } from "react";
import {
    ToggleButton as AriaToggleButton,
    ToggleButtonGroup as AriaToggleButtonGroup,
    type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
    type ToggleButtonProps as AriaToggleButtonProps,
    composeRenderProps,
} from "react-aria-components";

import { toggleVariants } from "@/components/ui/toggle";
import { cx, type VariantProps } from "@/lib/cva";

let ToggleGroupContext = createContext<
    VariantProps<typeof toggleVariants> & {
        spacing?: number;
    }
>({
    size: "default",
    variant: "default",
    spacing: 0,
});

export interface ToggleGroupProps
    extends AriaToggleButtonGroupProps, VariantProps<typeof toggleVariants> {
    spacing?: number;
}

function ToggleGroup({
    className,
    variant,
    size,
    spacing = 0,
    style,
    children,
    ...props
}: ToggleGroupProps) {
    return (
        <AriaToggleButtonGroup
            className={composeRenderProps(className, className =>
                cx(
                    "group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs",
                    className,
                ),
            )}
            data-size={size}
            data-slot="toggle-group"
            data-spacing={spacing}
            data-variant={variant}
            style={composeRenderProps(
                style,
                style =>
                    ({
                        ...style,
                        "--gap": spacing,
                    }) as CSSProperties,
            )}
            {...props}
        >
            {composeRenderProps(children, children => (
                <ToggleGroupContext.Provider value={{ variant, size, spacing }}>
                    {children}
                </ToggleGroupContext.Provider>
            ))}
        </AriaToggleButtonGroup>
    );
}

export interface ToggleGroupItemProps
    extends Omit<AriaToggleButtonProps, "id">, VariantProps<typeof toggleVariants> {
    id?: AriaToggleButtonProps["id"];
    value?: AriaToggleButtonProps["id"];
}

function ToggleGroupItem({ className, variant, size, id, value, ...props }: ToggleGroupItemProps) {
    let context = useContext(ToggleGroupContext);
    let itemVariant = context.variant || variant;
    let itemSize = context.size || size;

    return (
        <AriaToggleButton
            className={composeRenderProps(className, className =>
                cx(
                    toggleVariants({
                        variant: itemVariant,
                        size: itemSize,
                    }),
                    "w-auto min-w-0 shrink-0 px-3 data-[focus-visible]:z-10 data-[focused]:z-10",
                    "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l",
                    className,
                ),
            )}
            data-size={itemSize}
            data-slot="toggle-group-item"
            data-spacing={context.spacing}
            data-variant={itemVariant}
            id={id ?? value}
            {...props}
        />
    );
}

export { ToggleGroup, ToggleGroupItem };
