import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BarChart, Bar } from "recharts";
import { beforeAll, describe, expect, it } from "vitest";

// Embla carousel (and some other libs) require IntersectionObserver which jsdom lacks.
beforeAll(() => {
    if (!globalThis.IntersectionObserver) {
        globalThis.IntersectionObserver = class IntersectionObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof IntersectionObserver;
    }
});

import type { ChartConfig } from "@/components/ui/chart";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { ChartContainer } from "@/components/ui/chart";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import {
    SidebarProvider,
    Sidebar,
    SidebarTrigger,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

// ---------------------------------------------------------------------------
// NavigationMenu
// ---------------------------------------------------------------------------

describe("NavigationMenu", () => {
    function NavFixture() {
        return (
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink href="#">Introduction</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink href="#">Button</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        );
    }

    it("renders the nav element with data-slot", () => {
        render(<NavFixture />);
        let nav = document.querySelector("[data-slot='navigation-menu']");
        expect(nav).toBeInTheDocument();
        expect(nav!.tagName).toBe("NAV");
    });

    it("renders triggers as buttons with aria-expanded=false initially", () => {
        render(<NavFixture />);
        let trigger = screen.getByRole("button", { name: /getting started/i });
        expect(trigger).toBeInTheDocument();
        expect(trigger).toHaveAttribute("aria-expanded", "false");
        expect(trigger).toHaveAttribute("data-slot", "navigation-menu-trigger");
    });

    it("opens content when trigger is clicked and toggles aria-expanded", async () => {
        let user = userEvent.setup();
        render(<NavFixture />);

        let trigger = screen.getByRole("button", { name: /getting started/i });
        expect(trigger).toHaveAttribute("aria-expanded", "false");

        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "true");

        // Content should now be visible (not hidden)
        let content = document.querySelector(
            "[data-slot='navigation-menu-content'][data-state='open']",
        );
        expect(content).toBeInTheDocument();
        expect(screen.getByText("Introduction")).toBeInTheDocument();
    });

    it("closes when trigger is clicked a second time", async () => {
        let user = userEvent.setup();
        render(<NavFixture />);

        let trigger = screen.getByRole("button", { name: /getting started/i });
        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "true");

        await user.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("renders multiple triggers and only opens the clicked one", async () => {
        let user = userEvent.setup();
        render(<NavFixture />);

        let [gettingStarted, components] = screen.getAllByRole("button");
        await user.click(components);

        expect(components).toHaveAttribute("aria-expanded", "true");
        expect(gettingStarted).toHaveAttribute("aria-expanded", "false");
        expect(screen.getByText("Button")).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

describe("Sidebar", () => {
    function SidebarFixture({ defaultOpen = true }: { defaultOpen?: boolean }) {
        return (
            <SidebarProvider defaultOpen={defaultOpen}>
                <Sidebar collapsible="offcanvas">
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>Dashboard</SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>Settings</SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>
                <main>
                    <SidebarTrigger />
                </main>
            </SidebarProvider>
        );
    }

    it("renders sidebar-wrapper with data-slot", () => {
        render(<SidebarFixture />);
        expect(document.querySelector("[data-slot='sidebar-wrapper']")).toBeInTheDocument();
    });

    it("renders a SidebarTrigger button", () => {
        render(<SidebarFixture />);
        let trigger = screen.getByRole("button", { name: /toggle sidebar/i });
        expect(trigger).toBeInTheDocument();
        expect(trigger).toHaveAttribute("data-slot", "sidebar-trigger");
    });

    it("renders sidebar with data-slot and menu items", () => {
        render(<SidebarFixture />);
        // Sidebar renders on desktop (md:block), so the data-slot is in DOM
        expect(document.querySelector("[data-slot='sidebar']")).toBeInTheDocument();
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("starts expanded by default and reflects state on the sidebar element", () => {
        render(<SidebarFixture defaultOpen={true} />);
        let sidebar = document.querySelector("[data-slot='sidebar']");
        expect(sidebar).toHaveAttribute("data-state", "expanded");
    });

    it("starts collapsed when defaultOpen=false", () => {
        render(<SidebarFixture defaultOpen={false} />);
        let sidebar = document.querySelector("[data-slot='sidebar']");
        expect(sidebar).toHaveAttribute("data-state", "collapsed");
    });

    it("toggles sidebar state when SidebarTrigger is clicked", async () => {
        let user = userEvent.setup();
        render(<SidebarFixture defaultOpen={true} />);

        let trigger = screen.getByRole("button", { name: /toggle sidebar/i });
        let sidebar = document.querySelector("[data-slot='sidebar']");

        expect(sidebar).toHaveAttribute("data-state", "expanded");
        await user.click(trigger);
        expect(sidebar).toHaveAttribute("data-state", "collapsed");
        await user.click(trigger);
        expect(sidebar).toHaveAttribute("data-state", "expanded");
    });
});

// ---------------------------------------------------------------------------
// Carousel
// ---------------------------------------------------------------------------

describe("Carousel", () => {
    function CarouselFixture({ itemCount = 3 }: { itemCount?: number }) {
        return (
            <Carousel>
                <CarouselContent>
                    {Array.from({ length: itemCount }, (_, i) => (
                        <CarouselItem key={i}>Slide {i + 1}</CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        );
    }

    it("renders with data-slot and aria region", () => {
        render(<CarouselFixture />);
        let carousel = document.querySelector("[data-slot='carousel']");
        expect(carousel).toBeInTheDocument();
        expect(carousel).toHaveAttribute("role", "region");
        expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    });

    it("renders carousel content with data-slot", () => {
        render(<CarouselFixture />);
        expect(document.querySelector("[data-slot='carousel-content']")).toBeInTheDocument();
    });

    it("renders all slide items with the correct role", () => {
        render(<CarouselFixture itemCount={3} />);
        let slides = document.querySelectorAll("[data-slot='carousel-item']");
        expect(slides).toHaveLength(3);
        // Each slide has role="group" and aria-roledescription="slide"
        slides.forEach(slide => {
            expect(slide).toHaveAttribute("role", "group");
            expect(slide).toHaveAttribute("aria-roledescription", "slide");
        });
        expect(screen.getByText("Slide 1")).toBeInTheDocument();
        expect(screen.getByText("Slide 3")).toBeInTheDocument();
    });

    it("renders previous and next buttons", () => {
        render(<CarouselFixture />);
        let prev = screen.getByRole("button", { name: /previous slide/i });
        let next = screen.getByRole("button", { name: /next slide/i });
        expect(prev).toBeInTheDocument();
        expect(next).toBeInTheDocument();
        expect(prev).toHaveAttribute("data-slot", "carousel-previous");
        expect(next).toHaveAttribute("data-slot", "carousel-next");
    });

    it("previous button is disabled initially (no previous slide)", () => {
        render(<CarouselFixture />);
        let prev = screen.getByRole("button", { name: /previous slide/i });
        // canScrollPrev starts false so the button is isDisabled
        expect(prev).toBeDisabled();
    });
});

// ---------------------------------------------------------------------------
// Chart
// ---------------------------------------------------------------------------

let chartConfig: ChartConfig = {
    sales: { label: "Sales", color: "#2563eb" },
    returns: { label: "Returns", color: "#60a5fa" },
};

let chartData = [
    { month: "Jan", sales: 120, returns: 30 },
    { month: "Feb", sales: 200, returns: 45 },
    { month: "Mar", sales: 150, returns: 20 },
];

describe("ChartContainer", () => {
    it("renders with data-slot='chart'", () => {
        render(
            <ChartContainer config={chartConfig} style={{ width: 300, height: 200 }}>
                <BarChart data={chartData}>
                    <Bar dataKey="sales" />
                </BarChart>
            </ChartContainer>,
        );
        let chart = document.querySelector("[data-slot='chart']");
        expect(chart).toBeInTheDocument();
    });

    it("renders a data-chart attribute on the container", () => {
        render(
            <ChartContainer
                config={chartConfig}
                id="test-chart"
                style={{ width: 300, height: 200 }}
            >
                <BarChart data={chartData}>
                    <Bar dataKey="sales" />
                </BarChart>
            </ChartContainer>,
        );
        let chart = document.querySelector("[data-slot='chart']");
        expect(chart).toHaveAttribute("data-chart", "chart-test-chart");
    });

    it("injects a style element for chart CSS variables", () => {
        let { container } = render(
            <ChartContainer
                config={chartConfig}
                id="vars-chart"
                style={{ width: 300, height: 200 }}
            >
                <BarChart data={chartData}>
                    <Bar dataKey="sales" />
                </BarChart>
            </ChartContainer>,
        );
        // ChartStyle renders a <style> tag with CSS variable definitions. Scope the
        // lookup to the render output — React Aria leaks a global <style> into <head>
        // (not cleaned up between tests), which would otherwise be matched first.
        let styleEl = container.querySelector("style");
        expect(styleEl).toBeInTheDocument();
        expect(styleEl!.innerHTML).toContain("--color-sales");
        expect(styleEl!.innerHTML).toContain("--color-returns");
    });

    it("renders without crashing when given a minimal config", () => {
        let minimalConfig: ChartConfig = { value: { label: "Value" } };
        render(
            <ChartContainer config={minimalConfig} style={{ width: 300, height: 200 }}>
                <BarChart data={[{ name: "A", value: 10 }]}>
                    <Bar dataKey="value" />
                </BarChart>
            </ChartContainer>,
        );
        expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Resizable
// ---------------------------------------------------------------------------

describe("Resizable", () => {
    it("renders ResizablePanelGroup with data-slot", () => {
        render(
            <ResizablePanelGroup orientation="horizontal" style={{ height: 200 }}>
                <ResizablePanel defaultSize={50}>Left</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>Right</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(document.querySelector("[data-slot='resizable-panel-group']")).toBeInTheDocument();
    });

    it("renders panels with data-slot", () => {
        render(
            <ResizablePanelGroup orientation="horizontal" style={{ height: 200 }}>
                <ResizablePanel defaultSize={50}>Panel A</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>Panel B</ResizablePanel>
            </ResizablePanelGroup>,
        );
        let panels = document.querySelectorAll("[data-slot='resizable-panel']");
        expect(panels).toHaveLength(2);
        expect(screen.getByText("Panel A")).toBeInTheDocument();
        expect(screen.getByText("Panel B")).toBeInTheDocument();
    });

    it("renders the handle with data-slot and separator role", () => {
        render(
            <ResizablePanelGroup orientation="horizontal" style={{ height: 200 }}>
                <ResizablePanel defaultSize={50}>Left</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>Right</ResizablePanel>
            </ResizablePanelGroup>,
        );
        let handle = document.querySelector("[data-slot='resizable-handle']");
        expect(handle).toBeInTheDocument();
        // react-resizable-panels renders the separator with role="separator"
        expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("renders the optional grip icon when withHandle is set", () => {
        render(
            <ResizablePanelGroup orientation="horizontal" style={{ height: 200 }}>
                <ResizablePanel defaultSize={50}>Left</ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>Right</ResizablePanel>
            </ResizablePanelGroup>,
        );
        // The grip wrapper div is present inside the handle
        let handle = document.querySelector("[data-slot='resizable-handle']");
        expect(handle).toBeInTheDocument();
        // The grip icon container div should be a child of the handle
        let gripWrapper = handle!.querySelector("div");
        expect(gripWrapper).toBeInTheDocument();
    });

    it("renders a vertical layout group", () => {
        render(
            <ResizablePanelGroup orientation="vertical" style={{ height: 400 }}>
                <ResizablePanel defaultSize={50}>Top</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>Bottom</ResizablePanel>
            </ResizablePanelGroup>,
        );
        let group = document.querySelector("[data-slot='resizable-panel-group']");
        expect(group).toBeInTheDocument();
        expect(screen.getByText("Top")).toBeInTheDocument();
        expect(screen.getByText("Bottom")).toBeInTheDocument();
    });
});
