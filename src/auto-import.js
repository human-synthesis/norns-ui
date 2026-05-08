/**
 * Norns UI auto-import preset.
 *
 * Returns `{ components, helpers }` for `nornsAutoImport`'s options. Wire it
 * into your app's vite.config (or svelte.config) like:
 *
 *   import { nornsAutoImport } from '@human-synthesis/norns/auto-import';
 *   import { presetUI } from '@human-synthesis/norns-ui/auto-import';
 *
 *   const ui = presetUI();
 *
 *   // vite.config.js
 *   plugins: [
 *     nornsCivetPlugin(),
 *     nornsAutoImport({
 *       componentDirs: ['src/lib/components'],   // user folder wins
 *       components: ui.components,                // norns-ui as fallback
 *       helpers: ui.helpers
 *     }),
 *     sveltekit()
 *   ]
 *
 * Components are imported via bare specifiers so the consumer's
 * `node_modules/@human-synthesis/norns-ui/...` is the resolution target.
 * Helpers (functional APIs like `toast()`) are added incrementally as the
 * library grows.
 *
 * @typedef {Object} UIPreset
 * @property {Record<string, string>} components  name → bare-specifier import path
 * @property {Array<{ from: string, imports: string[] }>} helpers  name groups for nornsAutoImport
 *
 * @returns {UIPreset}
 */
export function presetUI() {
	return {
		components: {
			Btn: '@human-synthesis/norns-ui/components/Btn.n'
			// Phase 2+ adds: Input, Textarea, Select, Checkbox, Radio, Switch,
			// Field, Form, FieldGroup, Card, Dialog, Sheet, Popover, Dropdown,
			// Tooltip, Tabs, Accordion, Toast, Listbox, Combobox, Pagination,
			// Avatar, Badge, Spinner, Progress, Skeleton, Icon
		},
		helpers: [
			// Phase 3+: { from: '@human-synthesis/norns-ui', imports: ['toast'] }
		]
	};
}
