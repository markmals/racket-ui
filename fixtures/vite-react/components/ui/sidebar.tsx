import { IconLayoutSidebar } from "@tabler/icons-react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ComponentProps,
    type CSSProperties,
    type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    type TooltipContentProps,
} from "@/components/ui/tooltip";
import { cva, cx, type VariantProps } from "@/lib/cva";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// ---------------------------------------------------------------------------
// useIsMobile — inlined matchMedia hook
// ---------------------------------------------------------------------------

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
    let [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < MOBILE_BREAKPOINT;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        let mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        let onChange = () => setIsMobile(mql.matches);
        mql.addEventListener("change", onChange);
        setIsMobile(mql.matches);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type SidebarContextProps = {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};

let SidebarContext = createContext<SidebarContextProps | null>(null);

function useSidebar() {
    let context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.");
    }
    return context;
}

// ---------------------------------------------------------------------------
// SidebarProvider
// ---------------------------------------------------------------------------

interface SidebarProviderProps extends ComponentProps<"div"> {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}: SidebarProviderProps) {
    let isMobile = useIsMobile();
    let [openMobile, setOpenMobile] = useState(false);

    // Internal state — controlled externally via openProp / setOpenProp when provided.
    let [_open, _setOpen] = useState(defaultOpen);
    let open = openProp ?? _open;

    let setOpen = useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            let openState = typeof value === "function" ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        },
        [setOpenProp, open],
    );

    let toggleSidebar = useCallback(
        () => (isMobile ? setOpenMobile(o => !o) : setOpen(o => !o)),
        [isMobile, setOpen],
    );

    // Keyboard shortcut: Ctrl/Cmd+B
    useEffect(() => {
        let handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    let state: "expanded" | "collapsed" = open ? "expanded" : "collapsed";

    let contextValue = useMemo<SidebarContextProps>(
        () => ({
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <TooltipProvider>
                <div
                    className={cx(
                        "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
                        className,
                    )}
                    data-slot="sidebar-wrapper"
                    style={
                        {
                            "--sidebar-width": SIDEBAR_WIDTH,
                            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                            ...style,
                        } as CSSProperties
                    }
                    {...props}
                >
                    {children}
                </div>
            </TooltipProvider>
        </SidebarContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

interface SidebarProps extends ComponentProps<"div"> {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
}

function Sidebar({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
}: SidebarProps) {
    let { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
        return (
            <div
                className={cx(
                    "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
                    className,
                )}
                data-slot="sidebar"
                {...props}
            >
                {children}
            </div>
        );
    }

    if (isMobile) {
        // Omit DOM props that conflict with SheetContentProps (role, etc.)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let { role: _role, ...sheetProps } = props;
        return (
            <Sheet onOpenChange={setOpenMobile} open={openMobile}>
                <SheetContent
                    className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
                    data-mobile="true"
                    data-sidebar="sidebar"
                    data-slot="sidebar"
                    side={side}
                    style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as CSSProperties}
                    {...(sheetProps as Record<string, unknown>)}
                >
                    <SheetHeader className="sr-only">
                        <SheetTitle>Sidebar</SheetTitle>
                        <SheetDescription>Displays the mobile sidebar.</SheetDescription>
                    </SheetHeader>
                    <div className="flex h-full w-full flex-col">{children}</div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <div
            className="group peer hidden text-sidebar-foreground md:block"
            data-collapsible={state === "collapsed" ? collapsible : ""}
            data-side={side}
            data-slot="sidebar"
            data-state={state}
            data-variant={variant}
        >
            {/* Gap element that reserves space on desktop */}
            <div
                className={cx(
                    "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
                    "group-data-[collapsible=offcanvas]:w-0",
                    "group-data-[side=right]:rotate-180",
                    variant === "floating" || variant === "inset"
                        ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
                        : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
                )}
                data-slot="sidebar-gap"
            />
            <div
                className={cx(
                    "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
                    side === "left"
                        ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
                        : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                    variant === "floating" || variant === "inset"
                        ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
                        : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
                    className,
                )}
                data-slot="sidebar-container"
                {...props}
            >
                <div
                    className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
                    data-sidebar="sidebar"
                    data-slot="sidebar-inner"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// SidebarTrigger
// ---------------------------------------------------------------------------

function SidebarTrigger({ className, onPress, ...props }: ComponentProps<typeof Button>) {
    let { toggleSidebar } = useSidebar();

    return (
        <Button
            className={cx("size-7", className)}
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            onPress={e => {
                onPress?.(e);
                toggleSidebar();
            }}
            size="icon"
            variant="ghost"
            {...props}
        >
            <IconLayoutSidebar aria-hidden="true" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}

// ---------------------------------------------------------------------------
// SidebarRail
// ---------------------------------------------------------------------------

function SidebarRail({ className, ...props }: ComponentProps<"button">) {
    let { toggleSidebar } = useSidebar();

    return (
        <button
            aria-label="Toggle Sidebar"
            className={cx(
                "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex",
                "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
                "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
                "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
                "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
                "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
                className,
            )}
            data-sidebar="rail"
            data-slot="sidebar-rail"
            onClick={toggleSidebar}
            tabIndex={-1}
            title="Toggle Sidebar"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// SidebarInset
// ---------------------------------------------------------------------------

function SidebarInset({ className, ...props }: ComponentProps<"main">) {
    return (
        <main
            className={cx(
                "relative flex w-full flex-1 flex-col bg-background",
                "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
                className,
            )}
            data-slot="sidebar-inset"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// SidebarInput
// ---------------------------------------------------------------------------

function SidebarInput({ className, ...props }: ComponentProps<"input">) {
    return (
        <Input
            className={cx("h-8 w-full bg-background shadow-none", className)}
            data-sidebar="input"
            data-slot="sidebar-input"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// SidebarHeader / SidebarFooter / SidebarSeparator / SidebarContent
// ---------------------------------------------------------------------------

function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("flex flex-col gap-2 p-2", className)}
            data-sidebar="header"
            data-slot="sidebar-header"
            {...props}
        />
    );
}

function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("flex flex-col gap-2 p-2", className)}
            data-sidebar="footer"
            data-slot="sidebar-footer"
            {...props}
        />
    );
}

function SidebarSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
    return (
        <Separator
            className={cx("mx-2 w-auto bg-sidebar-border", className)}
            data-sidebar="separator"
            data-slot="sidebar-separator"
            {...props}
        />
    );
}

function SidebarContent({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
                className,
            )}
            data-sidebar="content"
            data-slot="sidebar-content"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// SidebarGroup / SidebarGroupLabel / SidebarGroupAction / SidebarGroupContent
// ---------------------------------------------------------------------------

function SidebarGroup({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("relative flex w-full min-w-0 flex-col p-2", className)}
            data-sidebar="group"
            data-slot="sidebar-group"
            {...props}
        />
    );
}

function SidebarGroupLabel({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
                "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
                className,
            )}
            data-sidebar="group-label"
            data-slot="sidebar-group-label"
            {...props}
        />
    );
}

function SidebarGroupAction({ className, ...props }: ComponentProps<"button">) {
    return (
        <button
            className={cx(
                "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
                "after:absolute after:-inset-2 md:after:hidden",
                "group-data-[collapsible=icon]:hidden",
                className,
            )}
            data-sidebar="group-action"
            data-slot="sidebar-group-action"
            {...props}
        />
    );
}

function SidebarGroupContent({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("w-full text-sm", className)}
            data-sidebar="group-content"
            data-slot="sidebar-group-content"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// SidebarMenu / SidebarMenuItem
// ---------------------------------------------------------------------------

function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
    return (
        <ul
            className={cx("flex w-full min-w-0 flex-col gap-1", className)}
            data-sidebar="menu"
            data-slot="sidebar-menu"
            {...props}
        />
    );
}

function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
    return (
        <li
            className={cx("group/menu-item relative", className)}
            data-sidebar="menu-item"
            data-slot="sidebar-menu-item"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// SidebarMenuButton
// ---------------------------------------------------------------------------

let sidebarMenuButtonVariants = cva({
    base: "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
    variants: {
        variant: {
            default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            outline:
                "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
        },
        size: {
            default: "h-8 text-sm",
            sm: "h-7 text-xs",
            lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

interface SidebarMenuButtonProps
    extends ComponentProps<"button">, VariantProps<typeof sidebarMenuButtonVariants> {
    isActive?: boolean;
    tooltip?: string | (Omit<TooltipContentProps, "children"> & { children?: ReactNode });
}

function SidebarMenuButton({
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
}: SidebarMenuButtonProps) {
    let { isMobile, state } = useSidebar();

    let button = (
        <button
            className={cx(sidebarMenuButtonVariants({ variant, size }), className)}
            data-active={isActive}
            data-sidebar="menu-button"
            data-size={size}
            data-slot="sidebar-menu-button"
            {...props}
        />
    );

    if (!tooltip) {
        return button;
    }

    let tooltipProps: TooltipContentProps =
        typeof tooltip === "string" ? { children: tooltip } : tooltip;

    return (
        <Tooltip>
            <TooltipTrigger>{button}</TooltipTrigger>
            <TooltipContent
                placement="right"
                {...tooltipProps}
                className={cx(
                    state !== "collapsed" || isMobile ? "hidden" : undefined,
                    typeof tooltip !== "string" ? tooltipProps.className : undefined,
                )}
            />
        </Tooltip>
    );
}

// ---------------------------------------------------------------------------
// SidebarMenuAction / SidebarMenuBadge
// ---------------------------------------------------------------------------

interface SidebarMenuActionProps extends ComponentProps<"button"> {
    showOnHover?: boolean;
}

function SidebarMenuAction({ className, showOnHover = false, ...props }: SidebarMenuActionProps) {
    return (
        <button
            className={cx(
                "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
                "after:absolute after:-inset-2 md:after:hidden",
                "peer-data-[size=sm]/menu-button:top-1",
                "peer-data-[size=default]/menu-button:top-1.5",
                "peer-data-[size=lg]/menu-button:top-2.5",
                "group-data-[collapsible=icon]:hidden",
                showOnHover &&
                    "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0",
                className,
            )}
            data-sidebar="menu-action"
            data-slot="sidebar-menu-action"
            {...props}
        />
    );
}

function SidebarMenuBadge({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx(
                "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none",
                "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
                "peer-data-[size=sm]/menu-button:top-1",
                "peer-data-[size=default]/menu-button:top-1.5",
                "peer-data-[size=lg]/menu-button:top-2.5",
                "group-data-[collapsible=icon]:hidden",
                className,
            )}
            data-sidebar="menu-badge"
            data-slot="sidebar-menu-badge"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// SidebarMenuSkeleton
// ---------------------------------------------------------------------------

interface SidebarMenuSkeletonProps extends ComponentProps<"div"> {
    showIcon?: boolean;
}

function SidebarMenuSkeleton({ className, showIcon = false, ...props }: SidebarMenuSkeletonProps) {
    // Random width between 50–90%.
    let width = useRef(`${Math.floor(Math.random() * 40) + 50}%`).current;

    return (
        <div
            className={cx("flex h-8 items-center gap-2 rounded-md px-2", className)}
            data-sidebar="menu-skeleton"
            data-slot="sidebar-menu-skeleton"
            {...props}
        >
            {showIcon && (
                <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
            )}
            <Skeleton
                className="h-4 max-w-(--skeleton-width) flex-1"
                data-sidebar="menu-skeleton-text"
                style={{ "--skeleton-width": width } as CSSProperties}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// SidebarMenuSub / SidebarMenuSubItem / SidebarMenuSubButton
// ---------------------------------------------------------------------------

function SidebarMenuSub({ className, ...props }: ComponentProps<"ul">) {
    return (
        <ul
            className={cx(
                "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
                "group-data-[collapsible=icon]:hidden",
                className,
            )}
            data-sidebar="menu-sub"
            data-slot="sidebar-menu-sub"
            {...props}
        />
    );
}

function SidebarMenuSubItem({ className, ...props }: ComponentProps<"li">) {
    return (
        <li
            className={cx("group/menu-sub-item relative", className)}
            data-sidebar="menu-sub-item"
            data-slot="sidebar-menu-sub-item"
            {...props}
        />
    );
}

interface SidebarMenuSubButtonProps extends ComponentProps<"a"> {
    size?: "sm" | "md";
    isActive?: boolean;
}

function SidebarMenuSubButton({
    size = "md",
    isActive = false,
    className,
    ...props
}: SidebarMenuSubButtonProps) {
    return (
        <a
            className={cx(
                "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
                "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                "group-data-[collapsible=icon]:hidden",
                className,
            )}
            data-active={isActive}
            data-sidebar="menu-sub-button"
            data-size={size}
            data-slot="sidebar-menu-sub-button"
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
};
