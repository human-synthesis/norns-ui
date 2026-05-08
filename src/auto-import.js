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
 *       componentDirs: ['src/lib/components'],
 *       components: ui.components,
 *       helpers: [...DEFAULT_HELPERS, ...ui.helpers]
 *     }),
 *     sveltekit()
 *   ]
 *
 * @typedef {Object} UIPreset
 * @property {Record<string, string>} components
 * @property {Array<{ from: string, imports: string[] }>} helpers
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
			Switch: '@human-synthesis/norns-ui/components/Switch.n',

			// Phase 3 — behavior tier (Bits UI)
			Dialog: '@human-synthesis/norns-ui/components/Dialog.n',
			Sheet: '@human-synthesis/norns-ui/components/Sheet.n',
			Popover: '@human-synthesis/norns-ui/components/Popover.n',
			Dropdown: '@human-synthesis/norns-ui/components/Dropdown.n',
			Tooltip: '@human-synthesis/norns-ui/components/Tooltip.n',
			Tabs: '@human-synthesis/norns-ui/components/Tabs.n',
			ToastProvider: '@human-synthesis/norns-ui/components/ToastProvider.n'

			// Phase 4+ adds: Accordion, Listbox, Combobox, Pagination,
			// Avatar, Badge, Spinner, Progress, Skeleton, Icon, Card
		},
		helpers: [
			{
				from: '@human-synthesis/norns-ui/toast',
				imports: ['toast', 'notify', 'dismiss']
			}
		]
	};
}
