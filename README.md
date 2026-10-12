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

## Rendering rules

norns-ui draws each state once and then does no further work: no hover styling, no transitions or entrance animations, no transforms, no shadows, blur, gradients or translucency. Modals are native `<dialog>` elements over a transparent backdrop. Only loading indicators animate, by colour or rotation. The full list, enforced by `tests/rules.test.js`, is in [CLAUDE.md](./CLAUDE.md#library-rules-mandatory).

## Size

Every size in the library is in `rem`, so one attribute on `<html>` rescales everything:

```html
<html data-size="compact">  <!-- 87.5% -->
<html data-size="large">    <!-- 112.5% -->
```

It is a single root font-size change, resolved once when styles compute. It scales your own `rem`-based styles too.

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

`data-theme="dark"` also sets `color-scheme: dark`, so native `<select>` popups, scrollbars and date inputs follow.

### Accent colour

`primary` is the accent. It defaults to **green** in both themes; `data-accent="violet"` restores the earlier violet. Set it on `<html>` or on any subtree:

```html
<html data-theme="dark" data-accent="violet">
```

Each preset ships a light scale, a dark scale and an ink colour. In dark theme the mid steps are lifted to 70–80% lightness, so `bg-primary-600`, `text-primary-500` and selected borders stay readable on the dark background. Text on a primary fill uses `--color-fg-on-primary`: white in light theme, the preset's dark ink in dark theme. Use that token instead of `white` when you put text on `bg-primary-*`.

To add your own accent, declare the 23 preset variables under your own attribute value:

```css
[data-accent='ocean'] {
  --ui-accent-light-50: oklch(97.7% 0.013 236);
  /* … --ui-accent-light-100 … 950 */
  /* … --ui-accent-dark-50 … 950 */
  --ui-accent-ink: oklch(20% 0.03 236);
}
```

Don't override `--color-primary-*` with literal values. They are an indirection to the preset, and a literal value would stop the dark-theme switch. `tests/contrast.test.js` shows the contrast checks every preset should pass.

### Contrast targets (dark theme)

| Token | Use | Target |
|---|---|---|
| `--color-fg-muted`, `--color-fg-subtle` | readable text: secondary copy, placeholders, captions | ≥ 4.5:1 on every surface |
| `--color-border-strong` | control edges: inputs, checkboxes, radios | ≥ 3:1 on bg and bg-elevated |
| `--color-border` | decorative dividers and card edges | ~1.8:1 by design |
| `--color-border-floating` | open menus, listboxes, popovers, dialogs, sheets, rich tooltips | ≥ 3:1 on bg and on its own surface (dark); the only separation, since there are no shadows |

Surfaces step up as bg < bg-subtle < bg-elevated < bg-muted, so selected and keyboard-active states (`bg-muted`) show inside cards and open menus. `tests/contrast.test.js` enforces all of the above, plus the light-theme neutrals.

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

### API mode

Give `Form` a `submit` function and it posts through your API client instead of a form action. A rejection carrying `issues` (a norns `route()` 400, surfaced as `ApiError.body.issues`) feeds the same errors map, so the Fields light up either way:

```pug
Form(submit!="{(values) => api.post('/api/notes', values)}" onsuccess!="{onCreated}" bind:submitting!="{busy}" resetOnSuccess!="{true}")
  Field(label="Title" name="title" required)
    Input(name="title")
  Btn(type="submit" variant="primary" loading!="{busy}") Create
```

### Server-driven lists

`useList()` (`@human-synthesis/norns-ui/list`) owns page / sort / search state and re-runs your loader with a query string a norns `listQuery()` route understands. Bind it to `DataTable` and `Pagination`; the server orders and slices, the page never holds more than one page:

```pug
Input(type="search" bind:value!="{list.q}")
DataTable(columns!="{columns}" rows!="{list.rows}" bind:sortKey!="{list.sort}" bind:sortDir!="{list.dir}" loading!="{list.loading}")
Pagination(bind:page!="{list.page}" total!="{list.total}" pageSize!="{list.pageSize}")

<script>
  import { useList } from '@human-synthesis/norns-ui/list'
  list := useList (qs) => api.get(`/api/notes?${qs}`), { sort: 'updated_at', dir: 'desc', debounce: 150 }
</script>
```

`Autocomplete` and `MultiSelect` accept a `source` function (debounced, out-of-order responses dropped) in place of `items`, so pickers over large sets fetch options as you type.

## What's in here

- **Atoms** (CSS-only `@layer components`): `.btn`, `.input`, `.field`, `.form`, `.checkbox`, `.radio`, `.switch`, `.card`, `.surface-elevated`, `.btn-icon`, `.banner`, `.badge`, `.chip`, `.avatar`, `.skeleton`, `.progress`, `.norns-header`, `.hero`, `.stepper`, `.breadcrumbs`, `.pagination`, `.accordion`, `.carousel`, plus variants/sizes.
- **Forms**: `Btn`, `Form`, `Field`, `FieldGroup`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`.
- **Behavior** (custom on `@floating-ui/dom`): `Dialog`, `Sheet`, `Popover`, `Dropdown`, `Tooltip`, `Tabs`, `Accordion`, `ContextMenu`, `Collapsible`.
- **Display**: `Card`, `Window`, `Surface`, `Banner`, `Badge`, `Chip`, `Avatar`, `AvatarGroup`, `Skeleton`, `Progress`, `ProgressCircular`, `Icon`, `Image`, `Audio`, `Video`, `Timeline`.
- **Composite**: `Header`, `HeroBanner`, `Stepper`, `Breadcrumbs`, `Pagination`, `Carousel`, `Tree`, `Toolbar`, `Separator`, `ButtonGroup`, `ToggleButton`, `ToggleButtonGroup`, `HierarchicalMenu`, `MegaMenu`.
- **Inputs**: `NumberInput`, `OtpField`, `TagsInput`, `Autocomplete`, `MultiSelect`, `ColorPicker`, `Uploader`, `DatePicker`, `DateRangePicker`, `TimePicker`, `Calendar`, `DataTable`, `ScrollArea`, `CopyButton`, `ThemeToggler`.
- **Toast**: `ToastProvider` + `toast()` / `notify()` / `dismiss()` from `@human-synthesis/norns-ui/toast`.
- **Lists**: `useList()` from `@human-synthesis/norns-ui/list` — server-driven paging / sorting / search state for `DataTable` + `Pagination`.

The full prop reference for every component is **[COMPONENTS.md](./COMPONENTS.md)**, generated from the `.d.ts` shims under `src/types/` (`bun run docs:components`). Live usage of every component: `norns-demo/src/routes/examples/ui/+page.n`. Override any component by dropping `src/lib/components/<Name>.n` in your project — `nornsAutoImport`'s first-match-wins shadows the library silently.

## Behaviors

A small set of headless behaviors is exposed at `@human-synthesis/norns-ui/behaviors` for use in your own components:

```js
import {
  portal, clickOutside, escape, focusTrap,
  scrollLock, useFloating, rovingTabindex
} from '@human-synthesis/norns-ui/behaviors';
```

These are Svelte 5 actions (`use:portal`, `use:clickOutside={handler}`, etc.) and a small `useFloating()` factory that wraps `@floating-ui/dom`. They're what every overlay component in this library is built on, so reaching for them in your own code keeps interactions consistent.

## Migrating to 0.1.0

- **Removed:** `ShinyButton`, `RippleButton`, `GradientText` and the whole `@human-synthesis/norns-ui/motion` subpath (`AnimatedNumber`, `GradientBackground`, `LiquidButton`, `Reveal`, `Sparkles`), plus the `motion` dependency. They move to a separate effects package. Use `Btn` and plain text meanwhile.
- **Removed props:** `HeroBanner gradient`, `Surface tone="glass"`, `Dialog`/`Sheet` `overlayClass` (there is no overlay).
- **Dialog / Sheet** render a native `<dialog>`: no dimmed or blurred backdrop, no portal. With `dismissable={false}`, Escape no longer closes them (it used to, despite the docs).
- **Tokens:** `--ui-elev-*` are `none` and `--ui-motion-*` are `0s`, so app CSS that uses them keeps working with no effect. Use `outline: var(--ui-focus-outline)` instead of `box-shadow: var(--ui-focus-ring)` (still defined, deprecated). New: `--color-fg-disabled`, `--ui-focus-outline`, `--ui-focus-offset`, `data-size`.
- **Behaviour:** no hover highlights anywhere. Carousel renders only the active slide and no longer pauses on hover (it pauses while focused). Calendar range selection no longer previews on hover. Chevrons swap icons instead of rotating. `.surface-glass` is now an opaque surface.
- **Floating edge:** `--color-border-floating` is stronger in both themes, since menus no longer have a shadow.

## Migrating from 0.0.5 → 0.0.6

bits-ui has been removed; overlays are now built on `@floating-ui/dom` plus the in-tree behaviors module. Most APIs are unchanged. The breaking changes:

- `<Drawer>` is gone. Use `<Sheet side="left">` (it now defaults to `'right'`; pass the side you want).
- `<RichTooltip>` is gone. Use `<Tooltip rich>`.
- `<PreviewCard>` is gone. Use `<Tooltip>` with the trigger as a link, e.g. `<Tooltip rich content="...">{#snippet trigger()}<a href=...>{/snippet}</Tooltip>`.
- `<ContextMenu>` no longer renders nested submenus. The `children` field on items is accepted but ignored.
- The `svelte.config.js` `scopeToProject` workaround is no longer needed (it existed only to keep svelte-preprocess from corrupting bits-ui's TypeScript source). Remove it from your config.

## Theming

Tokens are in [`src/styles/tokens.css`](src/styles/tokens.css) as a Tailwind v4 `@theme` block. The library exposes:

- **Color scales** (50–950) for `primary`, `success`, `warning`, `danger`, `info` — all in `oklch` for perceptual uniformity. Use as `bg-primary-500`, `text-danger-700`, etc. `primary` follows the accent preset (see [Accent colour](#accent-colour)).
- **Role tokens** that atoms reference (and that you should reach for in your own components): `--color-fg`, `--color-fg-muted`, `--color-fg-subtle`, `--color-fg-on-primary`, `--color-bg`, `--color-bg-muted`, `--color-bg-subtle`, `--color-bg-elevated`, `--color-border`, `--color-border-strong`, `--color-border-floating`, `--color-ring`. These swap automatically on dark mode.
- **Feedback tokens**: `--color-{success,warning,danger,info}-{bg,fg,border}` for tinted surfaces.
- **Typography tokens**: `--font-sans`, `--font-mono`.
- **Sizing**: `--ui-radius-{sm,,lg,full}`, `--ui-h-{sm,md,lg}` (full button heights), `--ui-icon-btn-{sm,md,lg}` (square icon-button sizes).
- **Motion**: none. `--ui-motion-{fast,med,slow}` are `0s` for compatibility.
- **Elevation**: none. `--ui-elev-*` are kept as `none` for compatibility; depth comes from `--color-border-floating` and the surface steps.
- **Focus**: `--ui-focus-outline` + `--ui-focus-offset` — the single focus indicator. Apply as `outline: var(--ui-focus-outline); outline-offset: var(--ui-focus-offset)` on `:focus-visible`.
- **Size**: `data-size` on `<html>` (see [Size](#size)).

Override by re-declaring `@theme { … }` in your `app.css` after the library import.

## License

MIT © Daniel Teodoroiu / [Human Synthesis](https://humansynthesis.ai). Built on top of [Svelte](https://github.com/sveltejs/svelte) © Svelte Contributors, MIT licensed.
