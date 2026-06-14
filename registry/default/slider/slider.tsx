"use client";

// Classification: A — direct React Aria Components replacement (RAC Slider).
// Compat note: use RAC props — `minValue`/`maxValue`/`isDisabled`
// (not shadcn's `min`/`max`/`disabled`). See COMPATIBILITY.md.

import {
    Slider as AriaSlider,
    SliderOutput as AriaSliderOutput,
    type SliderProps as AriaSliderProps,
    SliderThumb as AriaSliderThumb,
    SliderTrack as AriaSliderTrack,
    composeRenderProps,
} from "react-aria-components";

import { cva } from "@/lib/cva";

let sliderVariants = cva({
    base: [
        "relative flex w-full touch-none items-center select-none",
        "data-[disabled]:opacity-50",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
    ],
});

let sliderTrackVariants = cva({
    base: [
        // No overflow-hidden: the thumb is rendered inside the track, so clipping
        // would crop it to the track height. The range is rounded instead.
        "relative grow rounded-full bg-muted",
        "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
    ],
});

let sliderRangeVariants = cva({
    base: [
        "absolute rounded-full bg-primary",
        "data-[orientation=horizontal]:h-full",
        "data-[orientation=vertical]:w-full",
    ],
});

let sliderThumbVariants = cva({
    base: [
        "block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow]",
        "data-[focus-visible]:ring-4 data-[focus-visible]:outline-hidden data-[hovered]:ring-4",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    ],
});

export interface SliderProps<T extends number | number[] = number | number[]> extends Omit<
    AriaSliderProps<T>,
    "children"
> {}

function Slider<T extends number | number[] = number | number[]>({
    className,
    defaultValue,
    maxValue = 100,
    minValue = 0,
    value,
    ...props
}: SliderProps<T>) {
    let sliderDefaultValue =
        value === undefined && defaultValue === undefined
            ? ([minValue, maxValue] as T)
            : defaultValue;

    return (
        <AriaSlider
            className={composeRenderProps(className, className => sliderVariants({ className }))}
            data-slot="slider"
            defaultValue={sliderDefaultValue}
            maxValue={maxValue}
            minValue={minValue}
            value={value}
            {...props}
        >
            <AriaSliderOutput className="sr-only" data-slot="slider-output" />
            <AriaSliderTrack className={sliderTrackVariants()} data-slot="slider-track">
                {({ orientation, state }) => {
                    let start =
                        state.values.length > 1
                            ? state.getThumbPercent(0) * 100
                            : state.getValuePercent(state.getThumbMinValue(0)) * 100;
                    let end =
                        state.values.length > 0
                            ? state.getThumbPercent(state.values.length - 1) * 100
                            : 0;
                    let startPercent = Math.min(start, end);
                    let endPercent = Math.max(start, end);
                    let sizePercent = Math.max(0, endPercent - startPercent);
                    let rangeStyle =
                        orientation === "vertical"
                            ? {
                                  bottom: `${startPercent}%`,
                                  height: `${sizePercent}%`,
                              }
                            : {
                                  insetInlineStart: `${startPercent}%`,
                                  width: `${sizePercent}%`,
                              };

                    return (
                        <>
                            <span
                                className={sliderRangeVariants()}
                                data-orientation={orientation}
                                data-slot="slider-range"
                                style={rangeStyle}
                            />
                            {state.values.map((_, index) => (
                                <AriaSliderThumb
                                    className={sliderThumbVariants()}
                                    data-slot="slider-thumb"
                                    index={index}
                                    key={index}
                                />
                            ))}
                        </>
                    );
                }}
            </AriaSliderTrack>
        </AriaSlider>
    );
}

export { Slider };
