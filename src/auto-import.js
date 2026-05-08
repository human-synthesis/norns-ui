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
 *   plugins: [
 *     nornsCivetPlugin(),
 *     nornsAutoImport({
 *       componentDirs: ['src/lib/components'],   // user folder wins
 *       components: ui.components                 // norns-ui as fallback
 *     }),
 *     sveltekit()
 *   ]
 *
 * Components are imported via bare specifiers so the consumer's
 * `node_modules/@human-synthesis/norns-ui/...` is the resolution target.
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
			// Phase 1
			Btn: '@human-synthesis/norns-ui/components/Btn.n',

			// Phase 2 — forms tier
			Field: '@human-synthesis/norns-ui/components/Field.n',
			FieldGroup: '@human-synthesis/norns-ui/components/FieldGroup.n',
			Form: '@human-synthesis/norns-ui/components/Form.n',
			Input: '@human-synthesis/norns-ui/components/Input.n',
			Textarea: '@human-synthesis/norns-ui/components/Textarea.n',
			Select: '@human-synthesis/norns-ui/components/Select.n',
			Checkbox: '@human-synthesis/norns-ui/components/Checkbox.n',
			Radio: '@human-synthesis/norns-ui/components/Radio.n',
			Switch: '@human-synthesis/norns-ui/components/Switch.n'

			// Phase 3+ adds: Card, Dialog, Sheet, Popover, Dropdown, Tooltip,
			// Tabs, Accordion, Toast + ToastProvider, Listbox, Combobox,
			// Pagination, Avatar, Badge, Spinner, Progress, Skeleton, Icon
		},
		helpers: [
			// Phase 3+: { from: '@human-synthesis/norns-ui', imports: ['toast'] }
		]
	};
}
