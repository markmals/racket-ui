/**
 * Registry build + sync.
 *
 * Canonical source lives in `registry/default/<name>/`:
 *   - `<name>.tsx` / `<name>.ts` / `globals.css` — the file(s)
 *   - `registry-item.json` — the shadcn registry item descriptor
 *
 * This script:
 *   1. Assembles every `registry/default/* /registry-item.json` into the root
 *      `registry.json` consumed by the official `shadcn build` CLI.
 *   2. Syncs each file from its `path` to its `target` (e.g. `lib/cva.ts`,
 *      `components/ui/button.tsx`, `app/globals.css`) so the demo app and
 *      `tsc` resolve the `@/` aliases against a single source of truth.
 *   3. Runs `shadcn build` to emit the distribution artifacts in `public/r/`.
 *
 * Pass `--sync-only` to skip step 3.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SOURCE_DIR = join(ROOT, "registry", "default");
const REGISTRY_JSON = join(ROOT, "registry.json");

const REGISTRY_NAME = "racket-ui";
const REGISTRY_HOMEPAGE = "https://racket-ui.malstrom.me";

type RegistryFile = { path: string; type: string; target?: string };
type RegistryItem = {
    $schema?: string;
    name: string;
    type: string;
    files?: RegistryFile[];
    [key: string]: unknown;
};

function readItems(): RegistryItem[] {
    let items: RegistryItem[] = [];
    for (let entry of readdirSync(SOURCE_DIR, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        let itemPath = join(SOURCE_DIR, entry.name, "registry-item.json");
        if (!existsSync(itemPath)) continue;
        let item = JSON.parse(readFileSync(itemPath, "utf8")) as RegistryItem;
        delete item.$schema;
        items.push(item);
    }
    // Stable, dependency-friendly order: lib/base first, then alphabetical.
    let priority = (n: string) => (n === "cva" ? 0 : n === "base" ? 1 : 2);
    items.sort((a, b) => priority(a.name) - priority(b.name) || a.name.localeCompare(b.name));
    return items;
}

function writeRegistryJson(items: RegistryItem[]) {
    let registry = {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        name: REGISTRY_NAME,
        homepage: REGISTRY_HOMEPAGE,
        items,
    };
    writeFileSync(REGISTRY_JSON, JSON.stringify(registry, null, 2) + "\n");
    console.log(`✓ registry.json (${items.length} items)`);
}

function syncTargets(items: RegistryItem[]) {
    let count = 0;
    for (let item of items) {
        for (let file of item.files ?? []) {
            if (!file.target) continue;
            let from = join(ROOT, file.path);
            let to = join(ROOT, file.target);
            if (!existsSync(from)) {
                console.warn(`  ! missing source: ${file.path}`);
                continue;
            }
            mkdirSync(dirname(to), { recursive: true });
            cpSync(from, to);
            count++;
        }
    }
    console.log(`✓ synced ${count} files to target paths`);
}

function shadcnBuild() {
    console.log("→ shadcn build");
    execFileSync("pnpm", ["exec", "shadcn", "build", "registry.json", "--output", "public/r"], {
        cwd: ROOT,
        stdio: "inherit",
    });
}

let items = readItems();
writeRegistryJson(items);
syncTargets(items);
if (!process.argv.includes("--sync-only")) shadcnBuild();
