"use client";

// Classification: A — local component (no React Aria primitive needed).

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ComponentProps,
    type Dispatch,
    type SetStateAction,
} from "react";

import { cx } from "@/lib/cva";

type ImageLoadingStatus = "loading" | "loaded" | "error";

interface AvatarContextValue {
    imageLoadingStatus: ImageLoadingStatus;
    setImageLoadingStatus: Dispatch<SetStateAction<ImageLoadingStatus>>;
}

let AvatarContext = createContext<AvatarContextValue | null>(null);

function Avatar({ className, ...props }: ComponentProps<"span">) {
    let [imageLoadingStatus, setImageLoadingStatus] = useState<ImageLoadingStatus>("error");

    return (
        <AvatarContext.Provider value={{ imageLoadingStatus, setImageLoadingStatus }}>
            <span
                className={cx(
                    "relative flex size-8 shrink-0 overflow-hidden rounded-full",
                    className,
                )}
                data-slot="avatar"
                {...props}
            />
        </AvatarContext.Provider>
    );
}

function AvatarImage({ className, onError, onLoad, src, srcSet, ...props }: ComponentProps<"img">) {
    let context = useContext(AvatarContext);
    let imageLoadingStatus = context?.imageLoadingStatus;
    let setImageLoadingStatus = context?.setImageLoadingStatus;

    useEffect(() => {
        setImageLoadingStatus?.(src || srcSet ? "loading" : "error");
    }, [setImageLoadingStatus, src, srcSet]);

    return (
        <img
            className={cx("aspect-square size-full", className)}
            data-slot="avatar-image"
            hidden={imageLoadingStatus ? imageLoadingStatus !== "loaded" : undefined}
            onError={event => {
                setImageLoadingStatus?.("error");
                onError?.(event);
            }}
            onLoad={event => {
                setImageLoadingStatus?.("loaded");
                onLoad?.(event);
            }}
            src={src}
            srcSet={srcSet}
            {...props}
        />
    );
}

function AvatarFallback({ className, ...props }: ComponentProps<"span">) {
    let context = useContext(AvatarContext);

    if (context?.imageLoadingStatus === "loaded") {
        return null;
    }

    return (
        <span
            className={cx(
                "flex size-full items-center justify-center rounded-full bg-muted",
                className,
            )}
            data-slot="avatar-fallback"
            {...props}
        />
    );
}

export { Avatar, AvatarImage, AvatarFallback };
