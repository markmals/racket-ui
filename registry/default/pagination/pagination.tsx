// Classification: A — static component.

import type { ComponentProps } from "react";

import { IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-react";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cx } from "@/lib/cva";

function Pagination({ className, ...props }: ComponentProps<"nav">) {
    return (
        <nav
            aria-label="pagination"
            className={cx("mx-auto flex w-full justify-center", className)}
            data-slot="pagination"
            role="navigation"
            {...props}
        />
    );
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
    return (
        <ul
            className={cx("flex flex-row items-center gap-1", className)}
            data-slot="pagination-content"
            {...props}
        />
    );
}

function PaginationItem({ ...props }: ComponentProps<"li">) {
    return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ButtonProps, "size"> &
    ComponentProps<"a">;

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
    return (
        <a
            aria-current={isActive ? "page" : undefined}
            className={buttonVariants({
                variant: isActive ? "outline" : "ghost",
                size,
                className,
            })}
            data-active={isActive}
            data-slot="pagination-link"
            {...props}
        />
    );
}

function PaginationPrevious({ className, ...props }: ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            className={cx("gap-1 px-2.5 sm:pl-2.5", className)}
            size="default"
            {...props}
        >
            <IconChevronLeft aria-hidden="true" />
            <span className="hidden sm:block">Previous</span>
        </PaginationLink>
    );
}

function PaginationNext({ className, ...props }: ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            className={cx("gap-1 px-2.5 sm:pr-2.5", className)}
            size="default"
            {...props}
        >
            <span className="hidden sm:block">Next</span>
            <IconChevronRight aria-hidden="true" />
        </PaginationLink>
    );
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            aria-hidden="true"
            className={cx("flex size-9 items-center justify-center", className)}
            data-slot="pagination-ellipsis"
            {...props}
        >
            <IconDots className="size-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
};
