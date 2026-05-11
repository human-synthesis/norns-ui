# `@human-synthesis/norns-ui`

**UI library for the Norns ecosystem.** Pug + Civet components on Tailwind v4, with custom headless behaviors built on `@floating-ui/dom` and Iconify behind the icon system.

## Stack

- [Svelte 5](https://svelte.dev) — components and runes
- [Pug](https://pugjs.org) — templates (in `.n` files)
- [Civet](https://civet.dev) — `<script>` language
- [Tailwind CSS v4](https://tailwindcss.com) — styling, **hard peer dep**
- [@floating-ui/dom](https://floating-ui.com) — overlay positioning (Popover, Dropdown, Tooltip, ContextMenu, pickers)
- Custom in-tree headless behaviors (focus-trap, scroll-lock, click-outside, escape, portal, roving-tabindex) — exported at `@human-synthesis/norns-ui/behaviors`
- [Iconify](https://iconify.design) — icons; ships with [Lucide](https://lucide.dev) preset
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) — class deduplication
- [`@human-synthesis/norns`](https://github.com/human-synthesis/norns) — peer (`nornsAutoImport`)

## Install

```sh
bun add -D @human-synthesis/norns-ui
```

## Setup

`vite.config.js`:

```js
import { nornsAutoImport } from '@human-synthesis/norns/auto-import';
import { presetUI } from '@human-synthesis/norns-ui/auto-import';

const ui = presetUI();

export default {
  plugins: [
    nornsCivetPlugin(),
    nornsAutoImport({
      componentDirs: ['src/lib/components'],
      components: ui.components
    }),
    tailwindcss(),
    sveltekit()
  ]
};
```

`app.css`:

```css
@import 'tailwindcss';
@import '@human-synthesis/norns-ui/styles';
```

## Dark mode

Toggle via `<html data-theme="dark">` — every component swaps. Persist the choice with a small inline script in `app.html` to avoid FOUC:

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('theme');
      if (t === 'dark' || (t === null && matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.dataset.theme = 'dark';
      }
    } catch (_) {}
  })();
</script>
```

## Icons

The library ships [`@iconify/svelte`](https://iconify.design/docs/icon-components/svelte/) with the [Lucide](https://lucide.dev) collection bundled. Register the collection once in your app entry so icons render in SSR and the client:

```js
// src/routes/+layout.svelte (or wherever fits)
import { addCollection } from '@iconify/svelte';
import lucide from '@iconify-json/lucide/icons.json';
addCollection(lucide);
```

Then use `<Icon>` anywhere:

```pug
Icon(name="lucide:check" size="size-5")
Btn(icon="lucide:save") Save
```

To mix in another icon set, install its JSON package (e.g. `@iconify-json/heroicons`) and `addCollection(...)` it the same way.

## Usage

```pug
Form(action="?/save" form!="{form}")
  Field(label="Title" name="title" required)
    Input(name="title" placeholder="title…" required)
  Btn(type="submit" variant="primary" icon="lucide:save") Save
```

`<Field name="title">` reads its error from the parent `<Form>`'s context map; no per-page boilerplate.

## What's in here

- **Atoms** (CSS-only `@layer components`): `.btn`, `.input`, `.field`, `.form`, `.checkbox`, `.radio`, `.switch`, `.card`, `.surface-elevated`, `.btn-icon`, `.banner`, `.badge`, `.chip`, `.avatar`, `.skeleton`, `.progress`, `.norns-header`, `.hero`, `.stepper`, `.breadcrumbs`, `.pagination`, `.accordion`, `.carousel`, plus variants/sizes.
- **Forms**: `Btn`, `Form`, `Field`, `FieldGroup`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`.
- **Behavior** (custom on `@floating-ui/dom`): `Dialog`, `Sheet`, `Popover`, `Dropdown`, `Tooltip`, `Tabs`, `Accordion`, `ContextMenu`, `Collapsible`.
- **Display**: `Card`, `Surface`, `Banner`, `Badge`, `Chip`, `Avatar`, `Skeleton`, `Progress`, `ProgressCircular`, `Icon`.
- **Composite**: `Header`, `HeroBanner`, `Stepper`, `Breadcrumbs`, `Pagination`, `Carousel`.
- **Toast**: `ToastProvider` + `toast()` / `notify()` / `dismiss()` from `@human-synthesis/norns-ui/toast`.

Hand-rolled `.d.ts` shims live under `src/types/`. Override any component by dropping `src/lib/components/<Name>.n` in your project — `nornsAutoImport`'s first-match-wins shadows the library silently.

## Behaviors

A small set of headless behaviors is exposed at `@human-synthesis/norns-ui/behaviors` for use in your own components:

```js
import {
  portal, clickOutside, escape, focusTrap,
  scrollLock, useFloating, rovingTabindex
} from '@human-synthesis/norns-ui/behaviors';
```

These are Svelte 5 actions (`use:portal`, `use:clickOutside={handler}`, etc.) and a small `useFloating()` factory that wraps `@floating-ui/dom`. They're what every overlay component in this library is built on, so reaching for them in your own code keeps interactions consistent.

## Migrating from 0.0.5 → 0.0.6

bits-ui has been removed; overlays are now built on `@floating-ui/dom` plus the in-tree behaviors module. Most APIs are unchanged. The breaking changes:

- `<Drawer>` is gone. Use `<Sheet side="left">` (it now defaults to `'right'`; pass the side you want).
- `<RichTooltip>` is gone. Use `<Tooltip rich>`.
- `<PreviewCard>` is gone. Use `<Tooltip>` with the trigger as a link, e.g. `<Tooltip rich content="...">{#snippet trigger()}<a href=...>{/snippet}</Tooltip>`.
- `<ContextMenu>` no longer renders nested submenus. The `children` field on items is accepted but ignored.
- The `svelte.config.js` `scopeToProject` workaround is no longer needed (it existed only to keep svelte-preprocess from corrupting bits-ui's TypeScript source). Remove it from your config.

## Theming

Tokens are in [`src/styles/tokens.css`](src/styles/tokens.css) as a Tailwind v4 `@theme` block. The library exposes:

- **Color scales** (50–950) for `primary`, `success`, `warning`, `danger`, `info` — all in `oklch` for perceptual uniformity. Use as `bg-primary-500`, `text-danger-700`, etc.
- **Role tokens** that atoms reference (and that you should reach for in your own components): `--color-fg`, `--color-fg-muted`, `--color-fg-subtle`, `--color-bg`, `--color-bg-muted`, `--color-bg-subtle`, `--color-bg-elevated`, `--color-border`, `--color-border-strong`, `--color-ring`. These swap automatically on dark mode.
- **Feedback tokens**: `--color-{success,warning,danger,info}-{bg,fg,border}` for tinted surfaces.
- **Typography tokens**: `--font-sans`, `--font-mono`.
- **Sizing**: `--ui-radius-{sm,,lg,full}`, `--ui-h-{sm,md,lg}` (full button heights), `--ui-icon-btn-{sm,md,lg}` (square icon-button sizes).
- **Motion**: `--ui-motion-{fast,med,slow}` durations + `--ui-motion-ease`. All component transitions reference these.
- **Elevation**: `--ui-elev-{1,2,3}` (subtle / floating / modal). Dark mode swaps to deeper shadows.
- **Focus**: `--ui-focus-ring` — the single canonical focus indicator. Apply as `box-shadow: var(--ui-focus-ring)` on `:focus-visible`.

Override by re-declaring `@theme { … }` in your `app.css` after the library import.

## License

MIT © Daniel Teodoroiu / [Human Synthesis](https://humansynthesis.ai). Built on top of [Svelte](https://github.com/sveltejs/svelte) © Svelte Contributors, MIT licensed.
