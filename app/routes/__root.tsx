import { IconBrandGithub, IconMoon, IconSun } from "@tabler/icons-react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
    let [dark, setDark] = useState(true);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 px-6 py-3 backdrop-blur">
                <Link className="flex items-baseline gap-2" to="/">
                    <span className="text-lg font-semibold tracking-tight">racket-ui</span>
                    <span className="text-xs text-muted-foreground">shadcn/ui · React Aria</span>
                </Link>
                <div className="flex items-center gap-1">
                    <Button
                        aria-label="Toggle theme"
                        onPress={() => setDark(d => !d)}
                        size="icon"
                        variant="ghost"
                    >
                        {dark ? <IconSun /> : <IconMoon />}
                    </Button>
                    <Button
                        aria-label="GitHub"
                        onPress={() =>
                            window.open("https://github.com/markmals/racket-ui", "_blank")
                        }
                        size="icon"
                        variant="ghost"
                    >
                        <IconBrandGithub />
                    </Button>
                </div>
            </header>
            <main className="mx-auto w-full max-w-5xl px-6 py-10">
                <Outlet />
            </main>
            <Toaster />
        </div>
    );
}
