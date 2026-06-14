"use client";

// Classification: C — local implementation. Radix NavigationMenu has no React
// Aria equivalent. We faithfully recreate the shadcn export surface
// (NavigationMenu, NavigationMenuList, NavigationMenuItem,
// NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
// NavigationMenuIndicator, NavigationMenuViewport, navigationMenuTriggerStyle)
// using plain React state + hover/focus event handlers. Accessible roles
// (nav, ul, li, button, a) are preserved. Open/closed state drives
// data-[state=open] on trigger and content so shadcn's class strings continue
// to work; we also map to data-[open] for our own cva patterns.

import { IconChevronDown } from "@tabler/icons-react";
import * as React from "react";

import { cva, cx, type VariantProps } from "@/lib/cva";

// ---------------------------------------------------------------------------
// Context — tracks which NavigationMenuItem is open
// ---------------------------------------------------------------------------

interface NavigationMenuContextValue {
    openItem: string | null;
    setOpenItem: (id: string | null) => void;
    viewport: boolean;
}

let NavigationMenuContext = React.createContext<NavigationMenuContextValue>({
    openItem: null,
    setOpenItem: () => undefined,
    viewport: true,
});

// ---------------------------------------------------------------------------
// NavigationMenu (root)
// ---------------------------------------------------------------------------

export interface NavigationMenuProps extends React.ComponentProps<"nav"> {
    viewport?: boolean;
}

function NavigationMenu({ className, children, viewport = true, ...props }: NavigationMenuProps) {
    let [openItem, setOpenItem] = React.useState<string | null>(null);

    return (
        <NavigationMenuContext.Provider value={{ openItem, setOpenItem, viewport }}>
            <nav
                className={cx(
                    "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
                    className,
                )}
                data-slot="navigation-menu"
                data-viewport={viewport}
                {...props}
            >
                {children}
            </nav>
        </NavigationMenuContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// NavigationMenuList
// ---------------------------------------------------------------------------

function NavigationMenuList({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            className={cx(
                "group flex flex-1 list-none items-center justify-center gap-1",
                className,
            )}
            data-slot="navigation-menu-list"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// NavigationMenuItemContext — provides an id so trigger + content can sync
// ---------------------------------------------------------------------------

interface NavigationMenuItemContextValue {
    id: string;
    isOpen: boolean;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
}

let NavigationMenuItemContext = React.createContext<NavigationMenuItemContextValue>({
    id: "",
    isOpen: false,
    triggerRef: { current: null },
});

// ---------------------------------------------------------------------------
// NavigationMenuItem
// ---------------------------------------------------------------------------

function NavigationMenuItem({ className, ...props }: React.ComponentProps<"li">) {
    let { openItem } = React.useContext(NavigationMenuContext);
    let id = React.useId();
    let isOpen = openItem === id;
    let triggerRef = React.useRef<HTMLButtonElement | null>(null);

    return (
        <NavigationMenuItemContext.Provider value={{ id, isOpen, triggerRef }}>
            <li className={cx("relative", className)} data-slot="navigation-menu-item" {...props} />
        </NavigationMenuItemContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// navigationMenuTriggerStyle cva
// ---------------------------------------------------------------------------

let navigationMenuTriggerStyle = cva({
    base: [
        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none",
        "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
        "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
        "data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-ring/50 data-[focus-visible]:outline-1",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground data-[state=open]:data-[focused]:bg-accent data-[state=open]:data-[hovered]:bg-accent",
    ],
});

// ---------------------------------------------------------------------------
// NavigationMenuTrigger
// ---------------------------------------------------------------------------

export interface NavigationMenuTriggerProps
    extends React.ComponentProps<"button">, VariantProps<typeof navigationMenuTriggerStyle> {}

function NavigationMenuTrigger({ className, children, ...props }: NavigationMenuTriggerProps) {
    let { setOpenItem } = React.useContext(NavigationMenuContext);
    let { id, isOpen, triggerRef } = React.useContext(NavigationMenuItemContext);
    let [isHovered, setIsHovered] = React.useState(false);
    let [isFocused, setIsFocused] = React.useState(false);
    let [isFocusVisible, setIsFocusVisible] = React.useState(false);

    function handleClick() {
        setOpenItem(isOpen ? null : id);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
        if (e.key === "Escape") {
            setOpenItem(null);
            triggerRef.current?.focus();
        }
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpenItem(isOpen ? null : id);
        }
    }

    return (
        <button
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className={cx(navigationMenuTriggerStyle(), "group", className)}
            data-focus-visible={isFocusVisible || undefined}
            data-focused={isFocused || undefined}
            data-hovered={isHovered || undefined}
            data-slot="navigation-menu-trigger"
            data-state={isOpen ? "open" : "closed"}
            onBlur={() => {
                setIsFocused(false);
                setIsFocusVisible(false);
                // close when focus leaves the whole nav
                requestAnimationFrame(() => {
                    if (!document.activeElement?.closest("[data-slot='navigation-menu']")) {
                        setOpenItem(null);
                    }
                });
            }}
            onClick={handleClick}
            onFocus={e => {
                setIsFocused(true);
                // detect keyboard focus via relatedTarget — if the previous element
                // was not another navigation element we assume keyboard navigation
                if (
                    !e.relatedTarget ||
                    !(e.relatedTarget as Element).closest("[data-slot='navigation-menu']")
                ) {
                    setIsFocusVisible(true);
                } else {
                    setIsFocusVisible(false);
                }
            }}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            ref={triggerRef}
            type="button"
            {...props}
        >
            {children}{" "}
            <IconChevronDown
                aria-hidden="true"
                className={cx(
                    "relative top-[1px] ml-1 size-3 transition duration-300",
                    isOpen && "rotate-180",
                )}
            />
        </button>
    );
}

// ---------------------------------------------------------------------------
// NavigationMenuContent
// ---------------------------------------------------------------------------

function NavigationMenuContent({ className, ...props }: React.ComponentProps<"div">) {
    let { isOpen } = React.useContext(NavigationMenuItemContext);

    // Render the content as a positioned popover directly under its item (the
    // <li> is `relative`). This avoids the shared-viewport portal indirection,
    // which is impractical without Radix's teleport machinery.
    return (
        <div
            className={cx(
                "absolute top-full left-0 z-50 mt-1.5 w-max rounded-md border bg-popover p-2 text-popover-foreground shadow-md",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                "**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
                !isOpen && "hidden",
                className,
            )}
            data-slot="navigation-menu-content"
            data-state={isOpen ? "open" : "closed"}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// NavigationMenuViewport
// ---------------------------------------------------------------------------

// Kept for API parity with shadcn. Content is rendered in-place as a positioned
// popover (see NavigationMenuContent), so no shared viewport portal is needed.
function NavigationMenuViewport(_props: React.ComponentProps<"div">) {
    return null;
}

// ---------------------------------------------------------------------------
// NavigationMenuLink
// ---------------------------------------------------------------------------

function NavigationMenuLink({ className, ...props }: React.ComponentProps<"a">) {
    return (
        <a
            className={cx(
                "flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground",
                "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
                "data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground data-[active=true]:hover:bg-accent data-[active=true]:focus:bg-accent",
                "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                className,
            )}
            data-slot="navigation-menu-link"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// NavigationMenuIndicator
// ---------------------------------------------------------------------------

function NavigationMenuIndicator({ className, ...props }: React.ComponentProps<"div">) {
    let { openItem } = React.useContext(NavigationMenuContext);
    let isVisible = openItem !== null;

    return (
        <div
            className={cx(
                "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
                "data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
                className,
            )}
            data-slot="navigation-menu-indicator"
            data-state={isVisible ? "visible" : "hidden"}
            {...props}
        >
            <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
};
