# norns-ui — agent guide

Pug + Civet component library on Tailwind v4 for the Norns stack. No build step: consumers compile the `.n` sources through their own Norns pipeline.

## Library rules (mandatory)

The library is built to render once and then cost nothing. `tests/rules.test.js` enforces every rule below on `atoms.css`, `tokens.css` and every component; `bun test` fails on a violation.

1. **No hover styling.** `:hover` only where hovering *does* something (opening a nav menu; Tooltip opens on mouseenter and on focus). No background, colour, lift or underline on hover. Pressed (`:active`), selected (`aria-selected`, `data-pressed`, `data-active`) and keyboard focus states are actions, and stay.
2. **No motion.** No `transition`, no entrance or exit animation, no animated scrolling. Every state change is instant. The only animations are loading indicators (`.ui-spinner`, `.ui-spin`, `.skeleton`, indeterminate `.progress`), and they animate only `background-color` or a `rotate`, never size or layout. They stop under `prefers-reduced-motion`.
3. **No transforms.** No `transform`, `translate`, `scale`, `rotate` (indicator spin excepted). Centre and position with layout (`inset` + `margin: auto`, flex). Show direction by swapping the icon, not rotating it.
4. **Fully opaque.** No `opacity` below 1 and no translucent colours. Tints are opaque `color-mix(…, var(--color-bg))`. Disabled states use `--color-fg-disabled` / `--color-bg-muted`. Hidden things use `visibility: hidden` or are not rendered.
5. **No effects.** No `box-shadow`, `text-shadow`, `filter`, `backdrop-filter`, blur, blend modes or gradients. Depth is a border (`--color-border-floating` for anything floating) plus a surface step.
6. **Modals** are native `<dialog>` with `showModal()` and a transparent `::backdrop`: the window sits in the centre (Sheet: at its edge), the page behind stays fully visible and inert.
7. **Focus** is `outline: var(--ui-focus-outline)` with `outline-offset: var(--ui-focus-offset)`, never a shadow.
8. **Size** is rem everywhere (borders excepted). `<html data-size="compact|large">` rescales the whole library with one font-size change. No `px` font sizes.
9. **No background tracking.** Document listeners (`clickOutside`, `escape`) exist only while their overlay is open. Floating positioning follows scroll and window resize while open, nothing else: no ResizeObserver, IntersectionObserver or per-frame polling. No component listens to mouse movement; Tooltip's mouseenter is the only pointer listener.
10. **Effect components** (shiny, ripple, gradient text, sparkles, …) do not belong here; they live in a separate effects package.

## Layout

```
src/
  components/*.n        one file per component (Pug template + Civet <script>)
  types/*.d.ts          hand-rolled prop shims, one per component — the public API surface
  lib/behaviors/        headless Svelte 5 actions (portal, clickOutside, escape, focusTrap, scrollLock, floating, rovingTabindex)
  lib/cn.js, variants.js, toast.svelte.js
  styles/tokens.css     Tailwind v4 @theme tokens;  styles/atoms.css  @layer components
  auto-import.js        presetUI() — the name → import-path map consumers feed to nornsAutoImport
  index.js              explicit-import barrel
COMPONENTS.md           generated prop reference (bun run docs:components)
```

## Adding or changing a component — checklist

1. `src/components/<Name>.n` — follow the neighbours: `{ … } := $props()` (`.=` when a prop is `$bindable`), `cn(...)` for class merging, `+snippet` for slot APIs, `| {@render children?.()}`.
2. `src/types/<Name>.d.ts` — mirror every prop. `bun run check:shims:strict` fails CI on a missing shim or a prop the shim does not mention.
3. Register in `presetUI()` (`src/auto-import.js`) **and** the barrel (`src/index.js`).
4. `bun run docs:components` — regenerates `COMPONENTS.md` from the shims. Add a README example only for non-obvious usage.
5. Atom CSS goes in `src/styles/atoms.css` under `@layer components`; tokens in `tokens.css`. Reference role tokens (`--color-fg`, `--color-bg-muted`, `--ui-focus-outline`, …), never raw palette values, so dark mode keeps working. Every rule in "Library rules" above applies. Text on a `primary` fill uses `--color-fg-on-primary` (never `white`: it is dark ink in dark theme). Floating surfaces (menus, listboxes, popovers) reuse `.dropdown-content` / `.popover-content` so they pick up `--color-border-floating`. `bun test` includes `tests/contrast.test.js`; keep it green when touching tokens.
6. Overlays use `@floating-ui/dom` through `lib/behaviors/floating.svelte.js` plus the other behaviors; do not add a headless-UI dependency.

## Verification

```sh
bun test                      # rules, contrast, cn(), presetUI()
bun run check:shims:strict    # shim drift
bun run docs:components       # COMPONENTS.md up to date
```

Then smoke the component in a consumer: `cd ../norns-demo && bun run check && bun run dev` and open `/examples/ui` (the showcase page renders every component). `norns check` in the consumer compiles the library's `.n` files too, so a Pug or Civet mistake here shows up there with a file:line.

## Civet / Pug pitfalls (same as the apps)

- `isnt` → use `!==`. `x := $state` that is later reassigned → use `.=`. No `async *method()` shorthand. No bare `name: Type` let-with-type lines.
- Leading `{` on a Pug line needs `| ` first. Use `{expr}` / `attr!="{expr}"`, never `#{expr}`. `+each('items as item')`, not `of`.
- Fractional and variant classes in shorthand (`.gap-2.5`, `.hover:bg-x`) are rewritten automatically; anything stranger goes in `class=""`.

## Publishing

Version bumps in `package.json` are fine; `bun publish` and `git push` only on an explicit go-ahead.
