// Classification: A — static component.

import type { ComponentProps } from "react";

import { IconChevronRight, IconDots } from "@tabler/icons-react";

import { cx } from "@/lib/cva";

function Breadcrumb({ ...props }: ComponentProps<"nav">) {
    return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
    return (
        <ol
            className={cx(
                "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
                className,
            )}
            data-slot="breadcrumb-list"
            {...props}
        />
    );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
    return (
        <li
            className={cx("inline-flex items-center gap-1.5", className)}
            data-slot="breadcrumb-item"
            {...props}
        />
    );
}

function BreadcrumbLink({ className, ...props }: ComponentProps<"a">) {
    return (
        <a
            className={cx("transition-colors hover:text-foreground", className)}
            data-slot="breadcrumb-link"
            {...props}
        />
    );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            aria-current="page"
            aria-disabled="true"
            className={cx("font-normal text-foreground", className)}
            data-slot="breadcrumb-page"
            role="link"
            {...props}
        />
    );
}

function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<"li">) {
    return (
        <li
            aria-hidden="true"
            className={cx("[&>svg]:size-3.5", className)}
            data-slot="breadcrumb-separator"
            role="presentation"
            {...props}
        >
            {children ?? <IconChevronRight />}
        </li>
    );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            aria-hidden="true"
            className={cx("flex size-9 items-center justify-center", className)}
            data-slot="breadcrumb-ellipsis"
            role="presentation"
            {...props}
        >
            <IconDots className="size-4" />
            <span className="sr-only">More</span>
        </span>
    );
}

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
};
