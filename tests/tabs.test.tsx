import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Fixture() {
    return (
        <Tabs defaultValue="a">
            <TabsList aria-label="Sections">
                <TabsTrigger value="a">A</TabsTrigger>
                <TabsTrigger value="b">B</TabsTrigger>
            </TabsList>
            <TabsContent value="a">Panel A</TabsContent>
            <TabsContent value="b">Panel B</TabsContent>
        </Tabs>
    );
}

describe("Tabs", () => {
    it("shows the default panel and switches with arrow keys", async () => {
        let user = userEvent.setup();
        render(<Fixture />);

        expect(screen.getByText("Panel A")).toBeInTheDocument();
        expect(screen.queryByText("Panel B")).not.toBeInTheDocument();

        let tabA = screen.getByRole("tab", { name: "A" });
        tabA.focus();
        await user.keyboard("{ArrowRight}");

        expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Panel B")).toBeInTheDocument();
        expect(screen.queryByText("Panel A")).not.toBeInTheDocument();
    });
});
