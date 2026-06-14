import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        tanstackRouter({
            target: "react",
            routesDirectory: "./app/routes",
            generatedRouteTree: "./app/routeTree.gen.ts",
            autoCodeSplitting: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": resolve(import.meta.dirname, "."),
        },
    },
});
