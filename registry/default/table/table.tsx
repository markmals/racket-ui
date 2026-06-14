// Classification: A — static component.

import type { ComponentProps } from "react";

import { cx } from "@/lib/cva";

function Table({ className, ...props }: ComponentProps<"table">) {
    return (
        <div className="relative w-full overflow-x-auto" data-slot="table-container">
            <table
                className={cx("w-full caption-bottom text-sm", className)}
                data-slot="table"
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
    return (
        <thead className={cx("[&_tr]:border-b", className)} data-slot="table-header" {...props} />
    );
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
    return (
        <tbody
            className={cx("[&_tr:last-child]:border-0", className)}
            data-slot="table-body"
            {...props}
        />
    );
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
    return (
        <tfoot
            className={cx("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
            data-slot="table-footer"
            {...props}
        />
    );
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
    return (
        <tr
            className={cx(
                "border-b transition-colors hover:bg-muted/50 has-data-[expanded]:bg-muted/50 data-[selected]:bg-muted",
                className,
            )}
            data-slot="table-row"
            {...props}
        />
    );
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
    return (
        <th
            className={cx(
                "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className,
            )}
            data-slot="table-head"
            {...props}
        />
    );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
    return (
        <td
            className={cx(
                "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className,
            )}
            data-slot="table-cell"
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
    return (
        <caption
            className={cx("mt-4 text-sm text-muted-foreground", className)}
            data-slot="table-caption"
            {...props}
        />
    );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
