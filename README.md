# `@human-synthesis/norns-ui`

UI library for the [Norns](https://github.com/human-synthesis/norns) ecosystem — Pug + Civet components on Tailwind v4.

**Status: Phase 1 (foundation).** Currently ships `Btn` and the atom CSS layer. Forms tier (Input, Field, Form, …) lands in Phase 2; Bits-UI-backed behavior tier (Dialog, Popover, Tabs, Toast, …) in Phase 3.

## Stack

- [Svelte 5](https://svelte.dev) — components and runes
- [Pug](https://pugjs.org) — templates (in `.n` files)
- [Civet](https://civet.dev) — `<script>` language
- [Tailwind CSS v4](https://tailwindcss.com) — styling, **hard peer dep**
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) — class deduplication
- `@human-synthesis/norns` `^0.0.7` — peer (`nornsAutoImport` for the registration flow)

## Install

```sh
bun add -D @human-synthesis/norns-ui
```

## Setup

### 1. Wire `presetUI()` into `nornsAutoImport`

So `<Btn>`, `<Card>`, `<Field>` resolve in markup without explicit imports.

```js
// vite.config.js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { nornsAutoImport } from '@human-synthesis/norns/auto-import';
import { nornsCivetPlugin } from '@human-synthesis/norns/vite';
import { presetUI } from '@human-synthesis/norns-ui/auto-import';

const ui = presetUI();

export default defineConfig({
	plugins: [
		nornsCivetPlugin(),
		nornsAutoImport({
			componentDirs: ['src/lib/components'],
			components: ui.components
		}),
		tailwindcss(),
		sveltekit()
	]
});
```

Same shape goes in `svelte.config.js`'s `preprocess` array.

`componentDirs` resolves first — your `src/lib/components/Btn.n` silently shadows the library's `Btn` whenever you want to override.

### 2. Import the styles

```css
/* app.css */
@import 'tailwindcss';
@import '@human-synthesis/norns-ui/styles';

/* override tokens here if you want a different brand color */
@theme {
	--color-primary-500: oklch(60% 0.2 200);
}
```

### 3. Use components in Pug

```pug
section.space-y-3
	h1.text-3xl Notes
	form(method="POST" action="?/create")
		input.input(name="title" required)
		Btn(type="submit" variant="primary") Create note
```

## What ships

### Atoms (CSS-only — Tailwind `@layer components`)

Use directly via Pug class shorthand:

- `.btn` + variants: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-link`
- `.btn` + sizes: `.btn-sm`, `.btn-lg` (default md is built into `.btn`)
- `.ui-spinner` — small inline spinner

More atoms (`.input`, `.card`, `.badge`, `.field-*`) land in Phase 2.

### Components

#### `<Btn>` ([source](src/components/Btn.n))

Wrapped `<button>` with class merging, variant/size props, loading state, and snippet-prop API for icons.

```pug
Btn(variant="primary") Save
Btn(variant="secondary" size="sm") Cancel
Btn(loading!="{saving}" type="submit") Save
Btn(variant="danger" onclick!="{remove}")
	+snippet('leading')
		// icon goes here
	| Delete
```

Props (see [`src/types/Btn.d.ts`](src/types/Btn.d.ts)):
- `variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'` (default `'primary'`)
- `size?: 'sm' | 'md' | 'lg'` (default `'md'`)
- `loading?: boolean` — replaces leading icon with `.ui-spinner`, sets `disabled` and `aria-busy`
- `disabled?: boolean`
- `type?: 'button' | 'submit' | 'reset'` (default `'button'`)
- `onclick?: (event) => void`
- `class?: string` — merged via [`tailwind-merge`](https://github.com/dcastil/tailwind-merge)
- `children` — default snippet (the button label)
- `leading`, `trailing` — snippet slots for icons

## Theming

Tokens live in [`src/styles/tokens.css`](src/styles/tokens.css) as a Tailwind v4 `@theme` block — colors, radii, sizes. Override by re-declaring `@theme { ... }` in your own `app.css` after the library import. Tailwind v4 merges layered theme blocks.

Dark mode: toggle via `<html data-theme="dark">`. The library's tokens.css ships dark-theme overrides; Tailwind's existing dark-aware utilities continue to work.

## Class merging

Every component takes a `class` prop merged via `tailwind-merge` (the `cn` helper):

```svelte
<Btn variant="primary" class="w-full" /> <!-- both classes survive; later wins on conflicts -->
```

`cn` is exported from `@human-synthesis/norns-ui/cn` if you want to swap in plain `clsx` for smaller bundle:

```js
import { cn } from '@human-synthesis/norns-ui/cn';
cn('btn', isActive && 'btn-active', extra)
```

## Override a component

Drop a same-name file in your `src/lib/components/` and `nornsAutoImport`'s first-match-wins resolves to your version silently. No fork needed.

```
src/lib/components/Btn.n         ← your override wins
node_modules/@human-synthesis/norns-ui/src/components/Btn.n   ← fallback
```

## License

MIT © Daniel Teodoroiu / [Human Synthesis](https://humansynthesis.ai). Built on top of [Svelte](https://github.com/sveltejs/svelte) © Svelte Contributors, MIT licensed.
