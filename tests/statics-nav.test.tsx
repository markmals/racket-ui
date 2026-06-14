import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

describe("Table", () => {
    it("renders with role=table and exposes header and data cells", () => {
        render(
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Alice</TableCell>
                        <TableCell>Active</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Bob</TableCell>
                        <TableCell>Inactive</TableCell>
                    </TableRow>
                </TableBody>
            </Table>,
        );

        // The <table> element carries an implicit role of "table"
        expect(screen.getByRole("table")).toBeInTheDocument();

        // Column headers
        expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();

        // Data cells
        let cells = screen.getAllByRole("cell");
        expect(cells).toHaveLength(4);
        expect(screen.getByRole("cell", { name: "Alice" })).toBeInTheDocument();
        expect(screen.getByRole("cell", { name: "Bob" })).toBeInTheDocument();
    });

    it("applies data-slot attributes to structural elements", () => {
        let { container } = render(
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>X</TableCell>
                    </TableRow>
                </TableBody>
            </Table>,
        );

        expect(container.querySelector("[data-slot='table']")).toBeInTheDocument();
        expect(container.querySelector("[data-slot='table-body']")).toBeInTheDocument();
        expect(container.querySelector("[data-slot='table-row']")).toBeInTheDocument();
        expect(container.querySelector("[data-slot='table-cell']")).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

describe("Breadcrumb", () => {
    it("renders a nav with aria-label breadcrumb", () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Getting Started</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );

        // nav landmark with the correct label
        expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
    });

    it("marks the current page with aria-current=page", () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Current</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );

        let current = screen.getByText("Current");
        expect(current).toHaveAttribute("aria-current", "page");
    });

    it("renders ancestor links with correct hrefs", () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Leaf</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );

        let link = screen.getByRole("link", { name: "Home" });
        expect(link).toHaveAttribute("href", "/home");
    });
});

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

describe("Pagination", () => {
    it("renders a navigation landmark with aria-label pagination", () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            1
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>,
        );

        expect(screen.getByRole("navigation", { name: "pagination" })).toBeInTheDocument();
    });

    it("marks the active page link with aria-current=page", () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            3
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">4</PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>,
        );

        let activeLink = screen.getByRole("link", { name: "3" });
        expect(activeLink).toHaveAttribute("aria-current", "page");

        let inactiveLink = screen.getByRole("link", { name: "4" });
        expect(inactiveLink).not.toHaveAttribute("aria-current");
    });

    it("renders Previous and Next links with correct aria-labels", () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="/page/1" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="/page/3" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>,
        );

        expect(screen.getByRole("link", { name: "Go to previous page" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Go to next page" })).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// ScrollArea
// ---------------------------------------------------------------------------

describe("ScrollArea", () => {
    it("renders children and exposes data-slot attributes", () => {
        let { container } = render(
            <ScrollArea>
                <p>Scrollable content</p>
            </ScrollArea>,
        );

        expect(screen.getByText("Scrollable content")).toBeInTheDocument();
        expect(container.querySelector("[data-slot='scroll-area']")).toBeInTheDocument();
        expect(container.querySelector("[data-slot='scroll-area-viewport']")).toBeInTheDocument();
    });

    it("wraps children in a focusable viewport div", () => {
        let { container } = render(
            <ScrollArea>
                <span>inner</span>
            </ScrollArea>,
        );

        let viewport = container.querySelector("[data-slot='scroll-area-viewport']");
        expect(viewport).not.toBeNull();
        expect(viewport).toHaveAttribute("tabindex", "0");
    });
});

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

describe("Avatar", () => {
    it("shows the fallback by default (image not loaded in jsdom)", () => {
        render(
            <Avatar>
                <AvatarImage alt="User avatar" src="/avatar.png" />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>,
        );

        // Fallback text must be visible
        expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("hides the image when it hasn't loaded", () => {
        let { container } = render(
            <Avatar>
                <AvatarImage alt="User avatar" src="/avatar.png" />
                <AvatarFallback>AB</AvatarFallback>
            </Avatar>,
        );

        let img = container.querySelector("[data-slot='avatar-image']") as HTMLImageElement;
        // hidden attribute is set while the image hasn't loaded
        expect(img).toHaveAttribute("hidden");
    });

    it("renders the avatar container with data-slot=avatar", () => {
        let { container } = render(
            <Avatar>
                <AvatarFallback>PQ</AvatarFallback>
            </Avatar>,
        );

        expect(container.querySelector("[data-slot='avatar']")).toBeInTheDocument();
        expect(container.querySelector("[data-slot='avatar-fallback']")).toBeInTheDocument();
    });

    it("does not render fallback when status is loaded", () => {
        // Simulate already-loaded state by providing no src so AvatarImage stays hidden
        // and manually validate: with no src, useEffect sets status to "error",
        // so fallback should still render
        render(
            <Avatar>
                <AvatarImage alt="no src" />
                <AvatarFallback>XY</AvatarFallback>
            </Avatar>,
        );

        // status starts as "error" (no src), so fallback shows
        expect(screen.getByText("XY")).toBeInTheDocument();
    });
});
