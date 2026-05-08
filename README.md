# `@human-synthesis/norns-ui`

**UI library for the Norns ecosystem.** Pug + Civet components on Tailwind v4, with Bits UI behind the behavior tier and Iconify behind the icon system.

## Stack

- [Svelte 5](https://svelte.dev) — components and runes
- [Pug](https://pugjs.org) — templates (in `.n` files)
- [Civet](https://civet.dev) — `<script>` language
- [Tailwind CSS v4](https://tailwindcss.com) — styling, **hard peer dep**
- [Bits UI](https://bits-ui.com) — headless behavior (Dialog, Popover, Tabs, Accordion, …)
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

`svelte.config.js` — wrap our preprocessors so they no-op on `node_modules`. Without this, svelte-preprocess corrupts Bits UI's `<script lang="ts">` source:

```js
const scopeToProject = (p) => ({
  name: p.name,
  markup: p.markup ? (a) => (a.filename?.includes('/node_modules/') ? null : p.markup(a)) : undefined,
  script: p.script ? (a) => (a.filename?.includes('/node_modules/') ? null : p.script(a)) : undefined,
  style:  p.style  ? (a) => (a.filename?.includes('/node_modules/') ? null : p.style(a))  : undefined
});

preprocess: [
  ...nornsPreprocess().map(scopeToProject),
  scopeToProject(nornsAutoImport({ /* … */ }))
]
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

- **Atoms** (CSS-only `@layer components`): `.btn`, `.input`, `.field`, `.form`, `.checkbox`, `.radio`, `.switch`, `.card`, `.banner`, `.badge`, `.chip`, `.avatar`, `.skeleton`, `.progress`, `.norns-header`, `.hero`, `.stepper`, `.breadcrumbs`, `.pagination`, `.accordion`, `.carousel`, plus variants/sizes.
- **Forms**: `Btn`, `Form`, `Field`, `FieldGroup`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`.
- **Behavior** (Bits UI): `Dialog`, `Sheet`, `Popover`, `Dropdown`, `Tooltip`, `Tabs`, `Accordion`, `Drawer`.
- **Display**: `Card`, `Surface`, `Banner`, `Badge`, `Chip`, `Avatar`, `Skeleton`, `Progress`, `ProgressCircular`, `Icon`.
- **Composite**: `Header`, `HeroBanner`, `Stepper`, `Breadcrumbs`, `Pagination`, `Carousel`.
- **Toast**: `ToastProvider` + `toast()` / `notify()` / `dismiss()` from `@human-synthesis/norns-ui/toast`.

Hand-rolled `.d.ts` shims live under `src/types/`. Override any component by dropping `src/lib/components/<Name>.n` in your project — `nornsAutoImport`'s first-match-wins shadows the library silently.

## Theming

Tokens are in [`src/styles/tokens.css`](src/styles/tokens.css) as a Tailwind v4 `@theme` block. The library exposes:

- **Color scales** (50–950) for `primary`, `success`, `warning`, `danger`, `info` — all in `oklch` for perceptual uniformity. Use as `bg-primary-500`, `text-danger-700`, etc.
- **Role tokens** that atoms reference (and that you should reach for in your own components): `--color-fg`, `--color-fg-muted`, `--color-fg-subtle`, `--color-bg`, `--color-bg-muted`, `--color-bg-subtle`, `--color-bg-elevated`, `--color-border`, `--color-border-strong`, `--color-ring`. These swap automatically on dark mode.
- **Feedback tokens**: `--color-{success,warning,danger,info}-{bg,fg,border}` for tinted surfaces.
- **Typography tokens**: `--font-sans`, `--font-mono`.

Override by re-declaring `@theme { … }` in your `app.css` after the library import.

## License

MIT © Daniel Teodoroiu / [Human Synthesis](https://humansynthesis.ai). Built on top of [Svelte](https://github.com/sveltejs/svelte) © Svelte Contributors, MIT licensed.
