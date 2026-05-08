# `@human-synthesis/norns-ui`

UI library for the [Norns](https://github.com/human-synthesis/norns) ecosystem — Pug + Civet components on Tailwind v4.

**Status: Phase 3 (behavior tier).** Currently ships `Btn`, `Form`, `Field`, `FieldGroup`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, the in-house `ToastProvider` + `toast()` helper, and the Bits-UI-backed `Dialog`, `Sheet`, `Popover`, `Dropdown`, `Tooltip`, `Tabs`. Data tier (Combobox, Listbox, Pagination, Accordion) and polish tier (Avatar, Badge, Spinner, …) land in Phase 4–5.

> **Required: scope your preprocessors to project files.** Bits UI ships TypeScript-typed `<script lang="ts">` source, and the default Norns preprocess pipeline (svelte-preprocess + auto-import) corrupts those node_modules files. Wrap each preprocessor with a `node_modules` guard so they no-op on third-party `.svelte` files; vite-plugin-svelte handles them natively from there. See the **Setup** section below for the four-line `scopeToProject` helper.

## Stack

- [Svelte 5](https://svelte.dev) — components and runes
- [Pug](https://pugjs.org) — templates (in `.n` files)
- [Civet](https://civet.dev) — `<script>` language
- [Tailwind CSS v4](https://tailwindcss.com) — styling, **hard peer dep**
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) — class deduplication
- [Bits UI](https://bits-ui.com) — headless behavior backing `Dialog`/`Popover`/`Tabs`/etc.
- `@human-synthesis/norns` `^0.0.7` — peer (`nornsAutoImport` for the registration flow)

## Install

```sh
bun add -D @human-synthesis/norns-ui
```

## Setup

### 1. Wire `presetUI()` into `nornsAutoImport`

So `<Btn>`, `<Field>`, `<Input>`, etc. resolve in markup without explicit imports.

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

### 1b. Scope project preprocessors to skip `node_modules`

Wrap `nornsPreprocess()` outputs and `nornsAutoImport(...)` so their hooks no-op on third-party `.svelte` files. Bits UI's `lang="ts"` source compiles cleanly under vite-plugin-svelte's native TS handling, but breaks under our project-side svelte-preprocess + auto-import pipeline.

```js
// svelte.config.js
const scopeToProject = (p) => ({
	name: p.name,
	markup: p.markup ? (a) => (a.filename?.includes('/node_modules/') ? null : p.markup(a)) : undefined,
	script: p.script ? (a) => (a.filename?.includes('/node_modules/') ? null : p.script(a)) : undefined,
	style: p.style ? (a) => (a.filename?.includes('/node_modules/') ? null : p.style(a)) : undefined
});

export default nornsConfig({
	preprocess: [
		...nornsPreprocess().map(scopeToProject),
		scopeToProject(nornsAutoImport({ /* … */ }))
	]
});
```

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
section.space-y-4
	h1.text-3xl New note

	Form(method="POST" action="?/create")
		Field(label="Title" required error!="{form?.errors?.title}")
			Input(name="title" required)
		Field(label="Body" help="Optional — supports plain text only")
			Textarea(name="body" rows="4")
		Btn(type="submit" variant="primary") Create note
```

## Component catalog

### Phase 1 — atoms

CSS classes via `@layer components`. Use directly via Pug class shorthand:

- `.btn` + variants (`primary`, `secondary`, `ghost`, `danger`, `link`) + sizes (`sm`, `lg`)
- `.input` / `.textarea` / `.select` + `-err` modifier
- `.checkbox` / `.radio` / `.switch` + `-err` modifier
- `.field` / `.field-label` / `.field-required` / `.field-help` / `.field-error`
- `.field-group` / `.field-group-legend`
- `.form`
- `.ui-spinner`

### Phase 1 — Btn

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
- `disabled?: boolean`, `type?`, `onclick?`, `class?`, `children`, `leading`, `trailing`

### Phase 2 — forms tier

#### `<Field>`

Wraps a control with label + optional help/error text. Provides `id` and `hasError` to descendant controls via Svelte context — child Inputs auto-pick up the right `id` for `<label for=>` and switch to error styling.

```pug
Field(label="Email" required error!="{form?.errors?.email}" help="We'll never share it")
	Input(name="email" type="email" required)
```

Props: `label?`, `help?`, `error?`, `required?`, `id?`, `class?`, `children`.

#### `<Form>`, `<FieldGroup>`

Styled `<form>` (vertical stack via `.form`) and `<fieldset>` (`.field-group` with optional legend).

```pug
Form(action="?/save")
	FieldGroup(legend="Profile")
		Field(label="Name")
			Input(name="name" required)
		Field(label="Bio")
			Textarea(name="bio" rows="3")
	Btn(type="submit") Save
```

#### Form controls

All accept `class?` (merged via `cn`), pull `id` + `hasError` from a parent `<Field>` automatically, and surface `aria-invalid` + `aria-describedby` for accessibility:

| Component | Bind | Common props |
|---|---|---|
| `<Input>` | `bind:value` | `type`, `size`, `name`, `placeholder`, `required`, `disabled`, `readonly`, `autocomplete` |
| `<Textarea>` | `bind:value` | `name`, `placeholder`, `rows` (default 4), `required`, `disabled`, `readonly` |
| `<Select>` | `bind:value` | `name`, `required`, `disabled`. Children: `<option>` elements |
| `<Checkbox>` | `bind:checked` | `name`, `value`, `required`, `disabled` |
| `<Radio>` | `bind:group` | `name`, `value`, `required`, `disabled` |
| `<Switch>` | `bind:checked` | `name`, `value`, `required`, `disabled`. Renders as a styled toggle (`role="switch"`) |

Each has a hand-rolled `.d.ts` shim under `src/types/`.

### Phase 3 — behavior tier (Bits UI)

Headless behavior + accessibility from [Bits UI](https://bits-ui.com), wrapped with default Tailwind styling and a snippet-prop API designed for Pug.

#### `<Dialog>`

```pug
Dialog(bind:open!="{deleteOpen}" title="Delete note?" description="This cannot be undone.")
	+snippet('trigger')
		Btn(variant="danger" size="sm") Delete
	+snippet('actions')
		Btn(variant="ghost" onclick!="{() => deleteOpen = false}") Cancel
		Btn(variant="danger" onclick!="{confirm}") Delete
```

Props: `open` (bindable), `title`, `description`, `hideClose`, `trigger`, `actions`, `children`, `class`, `overlayClass`, `triggerClass`.

#### `<Sheet>`

Same API as `Dialog` plus `side?: 'top' | 'right' | 'bottom' | 'left'` (default `'right'`). Slides in from the chosen edge instead of centering.

#### `<Popover>` and `<Dropdown>`

```pug
Popover
	+snippet('trigger')
		Btn(variant="ghost" size="sm") Filters
	.space-y-2
		Field(label="Status")
			Select(name="status")
				option(value="all") All
				option(value="open") Open

Dropdown(items!="{[{label:'Edit', onSelect: edit}, {separator: true}, {label:'Delete', onSelect: del}]}")
	+snippet('trigger')
		Btn(variant="ghost") ⋯
```

#### `<Tooltip>`

```pug
Tooltip(content="Saved 2 minutes ago")
	+snippet('trigger')
		Btn(variant="ghost" size="sm") ⓘ
```

#### `<Tabs>`

```pug
+snippet('panelHuman')
	p Play against another person on this device.
+snippet('panelCpu')
	p Play against a simple CPU.

Tabs(bind:value!="{mode}" items!="{[
	{ value: 'human', label: 'Human', panel: panelHuman },
	{ value: 'cpu',   label: 'CPU',   panel: panelCpu }
]}")
```

#### `<ToastProvider>` + `toast()`

Mount once near the app root, then call `toast()` from anywhere:

```pug
// +layout.n
ToastProvider
| {@render children?.()}
```

```civet
import { toast } from '@human-synthesis/norns-ui/toast'

handleSave := =>
	await save()
	toast 'Saved!', { variant: 'success' }
```

Variants: `info` (default), `success`, `warning`, `error`. Default duration 4000ms; pass `duration: 0` for sticky.

## Theming

Tokens live in [`src/styles/tokens.css`](src/styles/tokens.css) as a Tailwind v4 `@theme` block — colors, radii, sizes. Override by re-declaring `@theme { ... }` in your own `app.css` after the library import. Tailwind v4 merges layered theme blocks.

Dark mode: toggle via `<html data-theme="dark">`. The library's tokens.css ships dark-theme overrides; Tailwind's existing dark-aware utilities continue to work.

## Class merging

Every component takes a `class` prop merged via `tailwind-merge` (the `cn` helper):

```svelte
<Btn variant="primary" class="w-full" />
<Input class="font-mono" />
```

`cn` is exported from `@human-synthesis/norns-ui/cn` if you want to swap in plain `clsx` for smaller bundle:

```js
import { cn } from '@human-synthesis/norns-ui/cn';
cn('btn', isActive && 'btn-active', extra);
```

## Override a component

Drop a same-name file in your `src/lib/components/` and `nornsAutoImport`'s first-match-wins resolves to your version silently. No fork needed.

```
src/lib/components/Btn.n         ← your override wins
node_modules/@human-synthesis/norns-ui/src/components/Btn.n   ← fallback
```

## License

MIT © Daniel Teodoroiu / [Human Synthesis](https://humansynthesis.ai). Built on top of [Svelte](https://github.com/sveltejs/svelte) © Svelte Contributors, MIT licensed.
