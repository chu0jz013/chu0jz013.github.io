# CLAUDE.md

Project-specific guidance for Claude Code working in this repo. Complements (does not replace) `~/.claude/CLAUDE.md`.

## What this is

A **macOS-style portfolio** for **Nam Hai (William) Kieu / `chu0jz013`** — DevOps & Cloud Engineer based in Hanoi.

- Deployed at <https://sre.quachuoitrenmay.com> (also `chu0jz013.github.io`).
- Forked / adapted from [Renovamen/playground-macos](https://github.com/Renovamen/playground-macos).
- Renders a fake macOS desktop in the browser: dock, top bar, launchpad, spotlight, and movable/resizable app windows.

## Tech stack

| | |
|---|---|
| Bundler | **Vite** (`vite.config.ts`) |
| Framework | **React 18** (functional + 1 class component) |
| Lang | **TypeScript** |
| Styling | **UnoCSS** (Tailwind-compatible utility classes via `unocss/vite`) — note `bg-c-white/20`, `i-bx:search`, etc. |
| State | **Zustand** (`src/stores/`) |
| Windows | **react-rnd** (draggable + resizable) |
| Animations | **framer-motion** |
| Markdown | `react-markdown` + `@milkdown/*` (Typora-like editor in `Bear.tsx`) |
| Icons | Iconify presets via UnoCSS — `i-{collection}:{name}` class names (e.g. `i-fa-solid:paw`, `i-bx:search`) |

## Scripts

```bash
npm run dev      # vite --host (LAN-accessible dev server)
npm run build    # vite build → dist/
npm run serve    # preview dist/ on localhost
npm run lint     # eslint .
```

There is **no test suite**. Verify changes by running `npm run dev` and clicking through the affected UI.

`npx tsc --noEmit` has **pre-existing unrelated errors** (notably `src/components/menus/ControlCenterMenu.tsx:17` re `rc-slider` types, plus node_modules type-resolution noise from React 18 + UnoCSS attributify). Filter with `npx tsc --noEmit 2>&1 | grep -E "^src/"` and ignore the known ControlCenterMenu line. **New errors in your edited files** are real.

## Auto-imports (important — read before adding `import`s)

`unplugin-auto-import` (configured in `vite.config.ts`) **automatically injects** these without any `import` statement:

- All React APIs: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, …
- Every default export from `src/hooks/` (e.g. `useWindowSize`, `useClickOutside`, `useInterval`)
- The Zustand store: `useStore` from `src/stores/index.ts`
- Every component under `src/components/**` by its file basename (e.g. `<Terminal />`, `<Bear />`, `<Safari />`, `<AppWindow />`)

**Practical consequence:** when you add a new component or hook, you do **not** need to import it elsewhere — just use the name. Conversely, do **not** add manual imports for these; the generated type declarations live in `src/auto-imports.d.ts`.

`React` itself is imported explicitly in TSX files that use `React.X` (e.g. `React.cloneElement`).

Path alias: `~/` → `src/` (configured in `vite.config.ts` + `tsconfig.json`).

## Directory map

```
src/
├── pages/
│   ├── Desktop.tsx        ← top-level layout: TopBar + Dock + Launchpad + Spotlight + window stack
│   └── Login.tsx          ← fake login screen (uses user.password to gate)
├── components/
│   ├── AppWindow.tsx      ← Rnd-wrapped window chrome (traffic lights, drag, resize)
│   ├── Launchpad.tsx      ← grid of launchpad icons (opens external URLs in new tab)
│   ├── Spotlight.tsx      ← search overlay (filters across apps + launchpadApps)
│   ├── dock/              ← Dock.tsx + DockItem.tsx (icon row + hover magnification)
│   ├── menus/             ← TopBar.tsx, AppleMenu, ControlCenter, Wifi, Battery, base.tsx
│   └── apps/              ← one file per app: Bear, FaceTime, OldPortfolio, Safari, Terminal, Typora, VSCode
├── configs/
│   ├── apps.tsx           ← AppsData[]: every dock/desktop app (id, icon, dimensions, JSX content)
│   ├── launchpad.ts       ← LaunchpadData[]: launchpad-only entries (external links)
│   ├── bear.tsx           ← Bear notes structure (markdown file references + links)
│   ├── terminal.tsx       ← static file-tree shown by `ls`/`cd`/`cat` (NOT command dispatch)
│   ├── websites.ts        ← Safari bookmarks
│   ├── music.ts, wallpapers.ts, user.ts
│   └── index.ts           ← re-exports; APPLIES `.filter(a => !a.disabled)` to apps + launchpadApps
├── stores/
│   ├── index.ts           ← zustand `useStore` (composed) + matchMedia listener for OS dark/light
│   └── slices/            ← dock.ts, system.ts (dark mode), user.ts
├── hooks/                 ← useWindowSize, useAudio, useBattery, useClickOutside, useInterval
├── types/configs/         ← .d.ts files mirroring each config (AppsData, BearData, LaunchpadData, …)
├── styles/                ← global CSS (component.css, layout.css, bear.css, typora.css, …)
├── utils/constants.ts     ← minMarginY/X, appBarHeight, WEBSITE_URL, RESUME_AS_CODE_URL, BANANAS_SELLS_URL
└── auto-imports.d.ts      ← generated; do not edit by hand
public/
├── img/icons/             ← app icons (PNG). launchpad/ subfolder has portfolio-themed variants
├── markdown/              ← Bear note content
├── old/                   ← static HTML of the previous portfolio (iframe'd by OldPortfolio.tsx)
└── music/, manifest.json, logo/
```

## Key conventions and gotchas

### Adding / hiding apps

- **Dock app**: add entry to `src/configs/apps.tsx` (`AppsData[]`). Required: `id`, `title`, `img`, `desktop`. Optional: `width`, `height`, `minWidth`, `minHeight`, `aspectRatio`, `x`, `y`, `content` (JSX), `link` (external), `show`, `disabled`.
- **Launchpad-only**: add to `src/configs/launchpad.ts` (`LaunchpadData[]`). Required: `id`, `title`, `img`, `link`. Optional: `disabled`.
- **Hide temporarily**: set `disabled: true` on the entry. The filter in `src/configs/index.ts` removes it from dock, launchpad, AND spotlight in one shot. **Do not** add per-component filters.
- **Default window size**: 640 × 400 if `width`/`height` not specified (see `AppWindow.tsx`).

### Window positioning (`src/components/AppWindow.tsx`)

- Windows live inside a 3×-viewport-wide bounded `Rnd` parent (Desktop.tsx); the math has `+ winWidth` and `winWidth * 2 - minMarginX` terms because of that boundary. Do not "simplify" those constants without understanding the bounds.
- Desktop opens with center + small random jitter (`±50px`) if no `x`/`y` in apps.tsx; explicit `x`/`y` override jitter.
- **Mobile (`winWidth < 640`)**: jitter is disabled, window is clamped to fit viewport minus dock + top bar + 8px margin. Always centered.
- Y position is clamped `≥ minMarginY` so windows never start above the top bar.

### Dock icon sizing on mobile

- `src/components/dock/DockItem.tsx` sets `style.width` from a framer-motion spring for hover-magnification on desktop. On mobile (`winWidth < 640`), it sets a static width = `dockSize / 16 rem` so PNGs with different intrinsic sizes don't render at wildly different sizes. **Both `<a>`-wrapped and non-link branches must stay in sync** — use `replace_all` carefully, both branches have identical style logic.

### Theme (dark/light)

- `src/stores/slices/system.ts` owns the `dark: boolean` state.
- Initial value: reads `prefers-color-scheme` via `window.matchMedia`.
- `src/stores/index.ts` attaches a `matchMedia` listener so the app reactively follows OS theme changes at runtime.
- Manual toggle via Control Center menu still works (overrides until OS changes again).
- The class `dark` is applied to `<html>`; consumers read `state.dark` from `useStore`.

### Terminal app (`src/components/apps/Terminal.tsx`)

- **Class component** (one of the only ones — for self-contained command history & dispatch).
- Commands are registered in `this.commands` (constructor) → method dispatch on Enter. Output uses `generateResultRow(id, JSX)` — every command produces JSX, not plain text.
- `src/configs/terminal.tsx` is the **fake filesystem tree** (`ls`/`cd`/`cat`), NOT a command registry.
- Auto-complete iterates `Object.keys(this.commands)` — register a command and Tab-complete works for free.
- `neofetch` uses canonical neofetch macOS palette (`set_colors 2 3 1 1 5 4` → green/yellow/red/red/magenta/blue) and tries to read `(performance as any).memory.usedJSHeapSize` for live Chrome heap; fallback `enough` on non-Chrome.

### Bear / Markdown notes

- Note structure in `src/configs/bear.tsx` (sections → notes with `file: "markdown/foo.md"`).
- Markdown files live in `public/markdown/` and are fetched at runtime by `Bear.tsx`.
- Section/note icons use Iconify class names (`i-octicon:file`, `i-fa-solid:paw`, `i-ri:gamepad-line`, …) — different system from PNG-based dock icons.

### Iframed external sites

- `Safari.tsx` iframes a URL. Used by `old-portfolio`, `resume-as-code`, `bananas-sells-things` entries in `apps.tsx`.
- `OldPortfolio.tsx` iframes `/old/index.html` (static HTML in `public/old/`).
- The "Old Portfolio" HTML has hand-edited placeholders `[FILL END DATE]` / `[FILL GRADUATION DATE]` that the user fills in. Grep `\[FILL` to find them.

## Common edit recipes

| Task | Files |
|---|---|
| Add a new Terminal command | `src/components/apps/Terminal.tsx` (register in `this.commands`, add method, add `<li>` to `help`) |
| Add a new app window | `src/components/apps/Foo.tsx` (auto-imported), entry in `src/configs/apps.tsx` |
| Hide an app temporarily | Set `disabled: true` on the entry in `apps.tsx` or `launchpad.ts` |
| Change Bear note content | `public/markdown/{filename}.md` |
| Change window default size | `width`/`height` on the entry in `apps.tsx` |
| Update dark/light behavior | `src/stores/slices/system.ts` + `src/stores/index.ts` |
| Old-portfolio static HTML | `public/old/index.html` |

## Things NOT to do

- Don't add manual `import React from "react"` unless using `React.X` API — auto-imports handle hooks/components.
- Don't add per-component filters for `disabled` apps — the central filter in `src/configs/index.ts` is the single source of truth.
- Don't "simplify" the `winWidth + ...` / `winWidth * 2 - minMarginX` constants in `AppWindow.tsx` — they exist because the Rnd bounds parent is 3× viewport wide.
- Don't delete `public/markdown/resume.md`'s link to `https://resumeascode.quachuoitrenmay.com/` — that's the canonical resume target (the old PDF was removed).
- Don't touch `src/auto-imports.d.ts` — regenerated each build by `unplugin-auto-import`.

## Build warning

`vite build` warns that `dist/assets/index-*.js` is >500 kB. This is pre-existing (KaTeX + Milkdown + react-syntax-highlighter are heavy). Code-splitting is a known TODO, not a regression.
