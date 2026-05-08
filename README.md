# `@human-synthesis/norns-ui`

**UI library for the Norns ecosystem.** Pug + Civet components on Tailwind v4, with Bits UI behind the behavior tier.

## Stack

- [Svelte 5](https://svelte.dev) — components and runes
- [Pug](https://pugjs.org) — templates (in `.n` files)
- [Civet](https://civet.dev) — `<script>` language
- [Tailwind CSS v4](https://tailwindcss.com) — styling, **hard peer dep**
- [Bits UI](https://bits-ui.com) — headless behavior (Dialog, Popover, Tabs, …)
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

## Usage

```pug
Form(action="?/save" form!="{form}")
  Field(label="Title" name="title" required)
    Input(name="title" placeholder="title…" required)
  Btn(type="submit" variant="primary") Save
```

`<Field name="title">` reads its error from the parent `<Form>`'s context map; no per-page boilerplate.

## What's in here

- **Atoms** (CSS-only, `@layer components`): `.btn`, `.input`, `.field`, `.form`, `.checkbox`, `.radio`, `.switch`, plus error/size modifiers.
- **Forms** (Phase 2): `Btn`, `Form`, `Field`, `FieldGroup`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`.
- **Behavior** (Phase 3, Bits UI): `Dialog`, `Sheet`, `Popover`, `Dropdown`, `Tooltip`, `Tabs`.
- **Toast**: `ToastProvider` + `toast()` / `notify()` / `dismiss()` from `@human-synthesis/norns-ui/toast`.

Hand-rolled `.d.ts` shims live under `src/types/`. Override any component by dropping `src/lib/components/<Name>.n` in your project — `nornsAutoImport`'s first-match-wins shadows the library silently.

## Theming

Tokens are in [`src/styles/tokens.css`](src/styles/tokens.css) as a Tailwind v4 `@theme` block. Override by re-declaring `@theme { … }` in your own `app.css` after the library import. Dark mode toggles via `<html data-theme="dark">`.

## License

MIT © Daniel Teodoroiu / [Human Synthesis](https://humansynthesis.ai). Built on top of [Svelte](https://github.com/sveltejs/svelte) © Svelte Contributors, MIT licensed.
