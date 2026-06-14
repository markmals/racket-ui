import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// Dedicated Vitest config (no TanStack Router plugin) so tests don't trigger
// route-tree generation. Aliases mirror the app's `@/` -> repo root.
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(import.meta.dirname, "."),
        },
    },
    test: {
        environment: "jsdom",
        globals: false,
        setupFiles: ["./vitest.setup.ts"],
        include: ["tests/**/*.test.{ts,tsx}"],
    },
});
