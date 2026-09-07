# norns-ui — agent guide

Pug + Civet component library on Tailwind v4 for the Norns stack. No build step: consumers compile the `.n` sources through their own Norns pipeline.

## Layout

```
src/
  components/*.n        one file per component (Pug template + Civet <script>)
  motion/*.n            motion-driven components; opt-in import from `@human-synthesis/norns-ui/motion`
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
5. Atom CSS goes in `src/styles/atoms.css` under `@layer components`; tokens in `tokens.css`. Reference role tokens (`--color-fg`, `--color-bg-muted`, `--ui-focus-ring`, …), never raw palette values, so dark mode keeps working.
6. Overlays use `@floating-ui/dom` through `lib/behaviors/floating.svelte.js` plus the other behaviors; do not add a headless-UI dependency.

## Verification

```sh
bun test                      # cn(), presetUI()
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
