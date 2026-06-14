"use client";

// Classification: A — direct React Aria Components replacement (RAC ColorPicker,
// ColorArea, ColorSlider, ColorField, ColorSwatch, ColorSwatchPicker).
// No shadcn equivalent exists; API is native React Aria with racket-ui styling conventions.

import {
    ColorArea as AriaColorArea,
    type ColorAreaProps as AriaColorAreaProps,
    ColorField as AriaColorField,
    type ColorFieldProps as AriaColorFieldProps,
    ColorPicker as AriaColorPicker,
    type ColorPickerProps as AriaColorPickerProps,
    ColorSlider as AriaColorSlider,
    type ColorSliderProps as AriaColorSliderProps,
    ColorSwatch as AriaColorSwatch,
    type ColorSwatchProps as AriaColorSwatchProps,
    ColorSwatchPicker as AriaColorSwatchPicker,
    type ColorSwatchPickerProps as AriaColorSwatchPickerProps,
    ColorSwatchPickerItem as AriaColorSwatchPickerItem,
    type ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
    ColorThumb as AriaColorThumb,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    type DialogTriggerProps as AriaDialogTriggerProps,
    Input as AriaInput,
    Label as AriaLabel,
    Popover as AriaPopover,
    SliderTrack as AriaSliderTrack,
    composeRenderProps,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import { cx } from "@/lib/cva";

// ---------------------------------------------------------------------------
// ColorPicker (root state provider + trigger popover)
// ---------------------------------------------------------------------------

export interface ColorPickerProps
    extends Omit<AriaColorPickerProps, "children">, Omit<AriaDialogTriggerProps, "children"> {
    /** Label shown above the trigger, if any. */
    label?: string;
    /** Whether the popover is open (controlled). */
    open?: boolean;
}

function ColorPicker({
    label,
    open,
    defaultValue = "#000000",
    value,
    onChange,
    onOpenChange,
    ...props
}: ColorPickerProps) {
    return (
        <AriaColorPicker defaultValue={defaultValue} onChange={onChange} value={value}>
            {({ color }) => (
                <AriaDialogTrigger isOpen={open} onOpenChange={onOpenChange} {...props}>
                    <Button
                        className="gap-2 px-3"
                        data-slot="color-picker-trigger"
                        variant="outline"
                    >
                        <AriaColorSwatch
                            className="size-4 rounded-sm border border-border shadow-xs"
                            color={color}
                            data-slot="color-picker-swatch"
                            style={{ background: color.toString("css") }}
                        />
                        <span className="font-mono text-xs">{color.toString("hex")}</span>
                    </Button>
                    <AriaPopover
                        className={cx(
                            "z-50 w-64 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none",
                            "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
                            "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
                            "data-[placement=bottom]:slide-in-from-top-2 data-[placement=top]:slide-in-from-bottom-2",
                        )}
                        data-slot="color-picker-popover"
                        offset={4}
                        placement="bottom start"
                    >
                        <AriaDialog className="flex flex-col gap-3 outline-none">
                            {label && <span className="text-sm font-medium">{label}</span>}
                            {/* 2D saturation/brightness square */}
                            <ColorArea
                                className="h-40 w-full"
                                colorSpace="hsb"
                                data-slot="color-picker-area"
                                xChannel="saturation"
                                yChannel="brightness"
                            >
                                <ColorThumb />
                            </ColorArea>

                            {/* Hue slider */}
                            <ColorSlider
                                channel="hue"
                                colorSpace="hsb"
                                data-slot="color-picker-hue-slider"
                            />

                            {/* Hex input */}
                            <ColorField aria-label="Hex color" data-slot="color-picker-field" />
                        </AriaDialog>
                    </AriaPopover>
                </AriaDialogTrigger>
            )}
        </AriaColorPicker>
    );
}

// ---------------------------------------------------------------------------
// ColorArea — 2D saturation/brightness gradient square
// ---------------------------------------------------------------------------

export interface ColorAreaProps extends AriaColorAreaProps {}

function ColorArea({ className, children, ...props }: ColorAreaProps) {
    return (
        <AriaColorArea
            className={composeRenderProps(className, className =>
                cx(
                    "relative h-40 w-full rounded-md",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    className,
                ),
            )}
            data-slot="color-area"
            {...props}
        >
            {children ?? <ColorThumb />}
        </AriaColorArea>
    );
}

// ---------------------------------------------------------------------------
// ColorThumb — draggable thumb used inside ColorArea and ColorSlider
// ---------------------------------------------------------------------------

function ColorThumb({ className, ...props }: React.ComponentProps<typeof AriaColorThumb>) {
    return (
        <AriaColorThumb
            className={composeRenderProps(className, className =>
                cx(
                    "size-4 rounded-full border-2 border-white shadow ring-0 transition-[box-shadow]",
                    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/50 data-[focus-visible]:ring-offset-0",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    className,
                ),
            )}
            data-slot="color-thumb"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ColorSlider — single-channel slider (e.g. hue, alpha)
// ---------------------------------------------------------------------------

export interface ColorSliderProps extends AriaColorSliderProps {}

function ColorSlider({ className, ...props }: ColorSliderProps) {
    return (
        <AriaColorSlider
            className={composeRenderProps(className, className =>
                cx("flex flex-col gap-1", "data-[disabled]:opacity-50", className),
            )}
            data-slot="color-slider"
            {...props}
        >
            <AriaSliderTrack
                className="relative h-3 w-full rounded-full"
                data-slot="color-slider-track"
                // React Aria computes the channel gradient (e.g. the hue spectrum) and
                // exposes it via defaultStyle.background — apply it or the track is blank.
                style={({ defaultStyle }) => ({ background: defaultStyle.background })}
            >
                <ColorThumb className="top-1/2 -translate-y-1/2" />
            </AriaSliderTrack>
        </AriaColorSlider>
    );
}

// ---------------------------------------------------------------------------
// ColorField — hex / channel text input
// ---------------------------------------------------------------------------

export interface ColorFieldProps extends AriaColorFieldProps {}

function ColorField({ className, ...props }: ColorFieldProps) {
    return (
        <AriaColorField
            className={composeRenderProps(className, className =>
                cx("flex flex-col gap-1", className),
            )}
            data-slot="color-field"
            {...props}
        >
            <AriaLabel className="sr-only">Hex color</AriaLabel>
            <AriaInput
                className={cx(
                    "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none",
                    "placeholder:text-muted-foreground",
                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 dark:data-[invalid]:ring-destructive/40",
                    "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                )}
                data-slot="color-field-input"
            />
        </AriaColorField>
    );
}

// ---------------------------------------------------------------------------
// ColorSwatch — static color preview swatch
// ---------------------------------------------------------------------------

export interface ColorSwatchProps extends AriaColorSwatchProps {}

function ColorSwatch({ className, style, color, ...props }: ColorSwatchProps) {
    return (
        <AriaColorSwatch
            className={composeRenderProps(className, className =>
                cx("size-6 rounded-sm border border-border shadow-xs", className),
            )}
            color={color}
            data-slot="color-swatch"
            style={style}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ColorSwatchPicker — grid of selectable color swatches
// ---------------------------------------------------------------------------

export interface ColorSwatchPickerProps extends AriaColorSwatchPickerProps {}

function ColorSwatchPicker({ className, children, ...props }: ColorSwatchPickerProps) {
    return (
        <AriaColorSwatchPicker
            className={composeRenderProps(className, className =>
                cx("flex flex-wrap gap-1", className),
            )}
            data-slot="color-swatch-picker"
            {...props}
        >
            {children}
        </AriaColorSwatchPicker>
    );
}

// ---------------------------------------------------------------------------
// ColorSwatchPickerItem — individual selectable swatch inside ColorSwatchPicker
// ---------------------------------------------------------------------------

export interface ColorSwatchPickerItemProps extends AriaColorSwatchPickerItemProps {}

function ColorSwatchPickerItem({ className, color, ...props }: ColorSwatchPickerItemProps) {
    return (
        <AriaColorSwatchPickerItem
            className={composeRenderProps(className, className =>
                cx(
                    "size-6 cursor-pointer rounded-sm border border-transparent transition-[box-shadow] outline-none",
                    "data-[selected]:ring-2 data-[selected]:ring-ring data-[selected]:ring-offset-1",
                    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-1",
                    "data-[hovered]:scale-110",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    className,
                ),
            )}
            color={color}
            data-slot="color-swatch-picker-item"
            {...props}
        >
            <AriaColorSwatch className="size-full rounded-[inherit]" />
        </AriaColorSwatchPickerItem>
    );
}

export {
    ColorPicker,
    ColorArea,
    ColorThumb,
    ColorSlider,
    ColorField,
    ColorSwatch,
    ColorSwatchPicker,
    ColorSwatchPickerItem,
};
