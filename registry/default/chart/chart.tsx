"use client";

// Classification: D — third-party package retained for parity (recharts).

import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";
import type { VerticalAlignmentType } from "recharts/types/component/DefaultLegendContent";
import type { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cx } from "@/lib/cva";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;

export type ChartConfig = Record<
    string,
    {
        label?: React.ReactNode;
        icon?: React.ComponentType;
    } & (
        | { color?: string; theme?: never }
        | { color?: never; theme: Record<keyof typeof THEMES, string> }
    )
>;

type ChartContextProps = {
    config: ChartConfig;
};

let ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
    let context = React.useContext(ChartContext);

    if (!context) {
        throw new Error("useChart must be used within a <ChartContainer />");
    }

    return context;
}

function ChartContainer({
    id,
    className,
    children,
    config,
    initialDimension = INITIAL_DIMENSION,
    ...props
}: React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
    initialDimension?: {
        width: number;
        height: number;
    };
}) {
    let uniqueId = React.useId();
    let chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                className={cx(
                    "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
                    className,
                )}
                data-chart={chartId}
                data-slot="chart"
                {...props}
            >
                <ChartStyle config={config} id={chartId} />
                <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>
                    {children}
                </RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
    let colorConfig = Object.entries(config).filter(
        ([, itemConfig]) => itemConfig.theme ?? itemConfig.color,
    );

    if (!colorConfig.length) {
        return null;
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: Object.entries(THEMES)
                    .map(
                        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
    .map(([key, itemConfig]) => {
        let color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color;
        return color ? `  --color-${key}: ${color};` : null;
    })
    .join("\n")}
}
`,
                    )
                    .join("\n"),
            }}
        />
    );
}

let ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipContentProps = React.ComponentProps<"div"> & {
    active?: boolean;
    payload?: ReadonlyArray<Payload<ValueType, NameType>>;
    label?: React.ReactNode;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    color?: string;
    labelFormatter?: (
        label: React.ReactNode,
        payload: ReadonlyArray<Payload<ValueType, NameType>>,
    ) => React.ReactNode;
    labelClassName?: string;
    formatter?: (
        value: ValueType | undefined,
        name: NameType | undefined,
        item: Payload<ValueType, NameType>,
        index: number,
        payload: ReadonlyArray<Payload<ValueType, NameType>>,
    ) => React.ReactNode;
};

function ChartTooltipContent({
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
}: ChartTooltipContentProps) {
    let { config } = useChart();

    let tooltipLabel = React.useMemo(() => {
        if (hideLabel || !payload?.length) {
            return null;
        }

        let [item] = payload;
        let key = String(labelKey ?? item?.dataKey ?? item?.name ?? "value");
        let itemConfig = getPayloadConfigFromPayload(config, item, key);
        let value =
            !labelKey && typeof label === "string"
                ? (config[label]?.label ?? label)
                : itemConfig?.label;

        if (labelFormatter) {
            return (
                <div className={cx("font-medium", labelClassName)}>
                    {labelFormatter(value, payload)}
                </div>
            );
        }

        if (!value) {
            return null;
        }

        return <div className={cx("font-medium", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
        return null;
    }

    let nestLabel = payload.length === 1 && indicator !== "dot";

    return (
        <div
            className={cx(
                "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
                className,
            )}
            data-slot="chart-tooltip-content"
        >
            {!nestLabel ? tooltipLabel : null}
            <div className="grid gap-1.5">
                {payload
                    .filter(item => item.type !== "none")
                    .map((item, index) => {
                        let key = String(nameKey ?? item.name ?? item.dataKey ?? "value");
                        let itemConfig = getPayloadConfigFromPayload(config, item, key);
                        let indicatorColor = color ?? item.payload?.fill ?? item.color;

                        return (
                            <div
                                className={cx(
                                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                                    indicator === "dot" && "items-center",
                                )}
                                key={index}
                            >
                                {formatter && item?.value !== undefined && item.name ? (
                                    formatter(item.value, item.name, item, index, payload)
                                ) : (
                                    <>
                                        {itemConfig?.icon ? (
                                            <itemConfig.icon />
                                        ) : (
                                            !hideIndicator && (
                                                <div
                                                    className={cx(
                                                        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                                                        {
                                                            "h-2.5 w-2.5": indicator === "dot",
                                                            "w-1": indicator === "line",
                                                            "w-0 border-[1.5px] border-dashed bg-transparent":
                                                                indicator === "dashed",
                                                            "my-0.5":
                                                                nestLabel && indicator === "dashed",
                                                        },
                                                    )}
                                                    style={
                                                        {
                                                            "--color-bg": indicatorColor,
                                                            "--color-border": indicatorColor,
                                                        } as React.CSSProperties
                                                    }
                                                />
                                            )
                                        )}
                                        <div
                                            className={cx(
                                                "flex flex-1 justify-between leading-none",
                                                nestLabel ? "items-end" : "items-center",
                                            )}
                                        >
                                            <div className="grid gap-1.5">
                                                {nestLabel ? tooltipLabel : null}
                                                <span className="text-muted-foreground">
                                                    {itemConfig?.label ?? item.name}
                                                </span>
                                            </div>
                                            {item.value != null && (
                                                <span className="font-mono font-medium text-foreground tabular-nums">
                                                    {typeof item.value === "number"
                                                        ? item.value.toLocaleString()
                                                        : String(item.value)}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

let ChartLegend = RechartsPrimitive.Legend;

type ChartLegendContentProps = React.ComponentProps<"div"> & {
    hideIcon?: boolean;
    nameKey?: string;
    payload?: ReadonlyArray<LegendPayload>;
    verticalAlign?: VerticalAlignmentType;
};

function ChartLegendContent({
    className,
    hideIcon = false,
    payload,
    verticalAlign = "bottom",
    nameKey,
}: ChartLegendContentProps) {
    let { config } = useChart();

    if (!payload?.length) {
        return null;
    }

    return (
        <div
            className={cx(
                "flex items-center justify-center gap-4",
                verticalAlign === "top" ? "pb-3" : "pt-3",
                className,
            )}
            data-slot="chart-legend-content"
        >
            {payload
                .filter(item => item.type !== "none")
                .map((item, index) => {
                    let key = String(nameKey ?? item.dataKey ?? "value");
                    let itemConfig = getPayloadConfigFromPayload(config, item, key);

                    return (
                        <div
                            className={cx(
                                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
                            )}
                            key={index}
                        >
                            {itemConfig?.icon && !hideIcon ? (
                                <itemConfig.icon />
                            ) : (
                                <div
                                    className="h-2 w-2 shrink-0 rounded-[2px]"
                                    style={{
                                        backgroundColor: item.color,
                                    }}
                                />
                            )}
                            {itemConfig?.label}
                        </div>
                    );
                })}
        </div>
    );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
    if (typeof payload !== "object" || payload === null) {
        return undefined;
    }

    let payloadPayload =
        "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
            ? payload.payload
            : undefined;

    let configLabelKey: string = key;

    if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
        configLabelKey = payload[key as keyof typeof payload] as string;
    } else if (
        payloadPayload &&
        key in payloadPayload &&
        typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
    ) {
        configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
    }

    return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
    useChart,
};
