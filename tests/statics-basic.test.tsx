import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemSeparator,
    ItemTitle,
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
describe("Badge", () => {
    it("renders with data-slot=badge and default variant", () => {
        render(<Badge>New</Badge>);
        let el = screen.getByText("New");
        expect(el).toBeInTheDocument();
        expect(el).toHaveAttribute("data-slot", "badge");
    });

    it("applies the destructive variant via data-variant", () => {
        render(<Badge variant="destructive">Error</Badge>);
        let el = screen.getByText("Error");
        expect(el).toHaveAttribute("data-slot", "badge");
        expect(el).toHaveAttribute("data-variant", "destructive");
    });

    it("applies the secondary variant", () => {
        render(<Badge variant="secondary">Beta</Badge>);
        expect(screen.getByText("Beta")).toHaveAttribute("data-variant", "secondary");
    });

    it("applies the outline variant", () => {
        render(<Badge variant="outline">Draft</Badge>);
        expect(screen.getByText("Draft")).toHaveAttribute("data-variant", "outline");
    });
});

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
describe("Card", () => {
    it("renders the card shell with data-slot=card", () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                    <CardDescription>Description</CardDescription>
                </CardHeader>
                <CardContent>Body content</CardContent>
                <CardFooter>Footer</CardFooter>
            </Card>,
        );
        let card = screen.getByText("Body content").closest("[data-slot=card]");
        expect(card).toBeInTheDocument();
        expect(card).toHaveAttribute("data-slot", "card");
    });

    it("renders CardTitle with data-slot=card-title", () => {
        render(
            <Card>
                <CardTitle>My Title</CardTitle>
            </Card>,
        );
        let title = screen.getByText("My Title");
        expect(title).toHaveAttribute("data-slot", "card-title");
    });

    it("renders CardContent with data-slot=card-content", () => {
        render(
            <Card>
                <CardContent>Content here</CardContent>
            </Card>,
        );
        let content = screen.getByText("Content here");
        expect(content).toHaveAttribute("data-slot", "card-content");
    });
});

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------
describe("Separator", () => {
    it("renders with role=separator and data-slot=separator (horizontal)", () => {
        render(<Separator />);
        let sep = screen.getByRole("separator");
        expect(sep).toBeInTheDocument();
        expect(sep).toHaveAttribute("data-slot", "separator");
    });

    it("renders with vertical orientation", () => {
        render(<Separator orientation="vertical" />);
        let sep = screen.getByRole("separator");
        expect(sep).toHaveAttribute("aria-orientation", "vertical");
    });
});

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
describe("Skeleton", () => {
    it("renders with data-slot=skeleton", () => {
        let { container } = render(<Skeleton />);
        let el = container.querySelector("[data-slot=skeleton]");
        expect(el).toBeInTheDocument();
    });

    it("passes children through", () => {
        render(<Skeleton>Loading placeholder</Skeleton>);
        expect(screen.getByText("Loading placeholder")).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
describe("Spinner", () => {
    it("has role=status and aria-label=Loading", () => {
        render(<Spinner />);
        let el = screen.getByRole("status");
        expect(el).toBeInTheDocument();
        expect(el).toHaveAttribute("aria-label", "Loading");
    });
});

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------
describe("Alert", () => {
    it("renders with role=alert and data-slot=alert", () => {
        render(
            <Alert>
                <AlertTitle>Heads up</AlertTitle>
                <AlertDescription>Something happened.</AlertDescription>
            </Alert>,
        );
        let alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveAttribute("data-slot", "alert");
    });

    it("renders AlertTitle and AlertDescription with correct data-slots", () => {
        render(
            <Alert>
                <AlertTitle>Title text</AlertTitle>
                <AlertDescription>Desc text</AlertDescription>
            </Alert>,
        );
        expect(screen.getByText("Title text")).toHaveAttribute("data-slot", "alert-title");
        expect(screen.getByText("Desc text")).toHaveAttribute("data-slot", "alert-description");
    });

    it("renders destructive variant", () => {
        render(<Alert variant="destructive">Danger!</Alert>);
        let alert = screen.getByRole("alert");
        expect(alert).toHaveAttribute("data-slot", "alert");
        // cva applies destructive class — confirm the element is there
        expect(alert).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// AspectRatio
// ---------------------------------------------------------------------------
describe("AspectRatio", () => {
    it("renders with data-slot=aspect-ratio and default ratio", () => {
        let { container } = render(<AspectRatio>content</AspectRatio>);
        let el = container.querySelector("[data-slot=aspect-ratio]");
        expect(el).toBeInTheDocument();
        // jsdom normalises the integer 1 to "1 / 1"
        expect((el as HTMLElement).style.aspectRatio).toMatch(/^1(\s*\/\s*1)?$/);
    });

    it("applies custom ratio via inline style", () => {
        let { container } = render(<AspectRatio ratio="16 / 9">video</AspectRatio>);
        let el = container.querySelector("[data-slot=aspect-ratio]") as HTMLElement;
        expect(el).toBeInTheDocument();
        expect(el.style.aspectRatio).toBe("16 / 9");
    });
});

// ---------------------------------------------------------------------------
// Kbd
// ---------------------------------------------------------------------------
describe("Kbd", () => {
    it("renders with data-slot=kbd", () => {
        render(<Kbd>⌘</Kbd>);
        let el = screen.getByText("⌘");
        expect(el).toBeInTheDocument();
        expect(el).toHaveAttribute("data-slot", "kbd");
    });

    it("renders as a kbd element", () => {
        render(<Kbd>K</Kbd>);
        let el = screen.getByText("K");
        expect(el.tagName.toLowerCase()).toBe("kbd");
    });

    it("KbdGroup renders with data-slot=kbd-group and groups children", () => {
        render(
            <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
            </KbdGroup>,
        );
        let group = screen.getAllByText("⌘")[0].closest("[data-slot=kbd-group]");
        expect(group).toBeInTheDocument();
        expect(group).toHaveAttribute("data-slot", "kbd-group");
    });
});

// ---------------------------------------------------------------------------
// Empty
// ---------------------------------------------------------------------------
describe("Empty", () => {
    it("renders the empty shell with data-slot=empty", () => {
        let { container } = render(
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>No results</EmptyTitle>
                    <EmptyDescription>Try a different search.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <EmptyMedia />
                </EmptyContent>
            </Empty>,
        );
        let el = container.querySelector("[data-slot=empty]");
        expect(el).toBeInTheDocument();
    });

    it("EmptyTitle carries data-slot=empty-title", () => {
        render(
            <Empty>
                <EmptyTitle>Nothing here</EmptyTitle>
            </Empty>,
        );
        expect(screen.getByText("Nothing here")).toHaveAttribute("data-slot", "empty-title");
    });

    it("EmptyDescription carries data-slot=empty-description", () => {
        render(
            <Empty>
                <EmptyDescription>Add something to get started.</EmptyDescription>
            </Empty>,
        );
        expect(screen.getByText("Add something to get started.")).toHaveAttribute(
            "data-slot",
            "empty-description",
        );
    });

    it("EmptyMedia renders with icon variant", () => {
        let { container } = render(
            <Empty>
                <EmptyMedia variant="icon">icon</EmptyMedia>
            </Empty>,
        );
        let el = container.querySelector("[data-slot=empty-icon]");
        expect(el).toBeInTheDocument();
        expect(el).toHaveAttribute("data-variant", "icon");
    });
});

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------
describe("Item", () => {
    it("renders with data-slot=item and default variant/size", () => {
        render(<Item>Row content</Item>);
        let el = screen.getByText("Row content");
        expect(el).toHaveAttribute("data-slot", "item");
        expect(el).toHaveAttribute("data-variant", "default");
        expect(el).toHaveAttribute("data-size", "default");
    });

    it("applies the outline variant", () => {
        render(<Item variant="outline">Outlined</Item>);
        expect(screen.getByText("Outlined")).toHaveAttribute("data-variant", "outline");
    });

    it("applies the sm size", () => {
        render(<Item size="sm">Small</Item>);
        expect(screen.getByText("Small")).toHaveAttribute("data-size", "sm");
    });

    it("ItemGroup renders with role=list", () => {
        render(
            <ItemGroup>
                <Item>Alpha</Item>
                <Item>Beta</Item>
            </ItemGroup>,
        );
        expect(screen.getByRole("list")).toHaveAttribute("data-slot", "item-group");
    });

    it("ItemSeparator renders with role=separator", () => {
        render(<ItemSeparator />);
        let sep = screen.getByRole("separator");
        expect(sep).toHaveAttribute("data-slot", "item-separator");
    });

    it("ItemTitle and ItemContent carry their data-slots", () => {
        render(
            <Item>
                <ItemContent>
                    <ItemTitle>Row title</ItemTitle>
                    <ItemDescription>Row description</ItemDescription>
                </ItemContent>
            </Item>,
        );
        expect(screen.getByText("Row title")).toHaveAttribute("data-slot", "item-title");
        expect(screen.getByText("Row description")).toHaveAttribute(
            "data-slot",
            "item-description",
        );
    });
});
