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
	const c = (name) => `@human-synthesis/norns-ui/components/${name}.n`;
	return {
		components: {
			// Phase 1
			Btn: c('Btn'),

			// Phase 2 — forms tier
			Field: c('Field'),
			FieldGroup: c('FieldGroup'),
			Form: c('Form'),
			Input: c('Input'),
			Textarea: c('Textarea'),
			Select: c('Select'),
			Checkbox: c('Checkbox'),
			Radio: c('Radio'),
			Switch: c('Switch'),

			// Phase 3 — behavior tier (Bits UI)
			Dialog: c('Dialog'),
			Sheet: c('Sheet'),
			Popover: c('Popover'),
			Dropdown: c('Dropdown'),
			Tooltip: c('Tooltip'),
			Tabs: c('Tabs'),
			ToastProvider: c('ToastProvider'),

			// 0.0.4 — display layer
			Icon: c('Icon'),
			Card: c('Card'),
			Surface: c('Surface'),
			Banner: c('Banner'),
			Badge: c('Badge'),
			Chip: c('Chip'),
			Avatar: c('Avatar'),
			Skeleton: c('Skeleton'),
			Progress: c('Progress'),
			ProgressCircular: c('ProgressCircular'),

			// 0.0.4 — composite layer
			Header: c('Header'),
			Drawer: c('Drawer'),
			HeroBanner: c('HeroBanner'),
			Stepper: c('Stepper'),
			Breadcrumbs: c('Breadcrumbs'),
			Pagination: c('Pagination'),
			Accordion: c('Accordion'),
			Carousel: c('Carousel'),
			Tree: c('Tree'),

			// 0.0.4 — wave A: small/standalone
			Separator: c('Separator'),
			Toolbar: c('Toolbar'),
			ButtonGroup: c('ButtonGroup'),
			ToggleButton: c('ToggleButton'),
			ToggleButtonGroup: c('ToggleButtonGroup'),
			Collapsible: c('Collapsible'),
			NumberInput: c('NumberInput'),
			OtpField: c('OtpField'),
			TagsInput: c('TagsInput'),
			Image: c('Image'),
			Audio: c('Audio'),
			Video: c('Video'),
			Timeline: c('Timeline'),

			// 0.0.4 — wave B: medium / Bits-UI-backed
			Autocomplete: c('Autocomplete'),
			MultiSelect: c('MultiSelect'),
			ContextMenu: c('ContextMenu'),
			RichTooltip: c('RichTooltip'),
			PreviewCard: c('PreviewCard'),
			ScrollArea: c('ScrollArea'),
			ColorPicker: c('ColorPicker'),
			Uploader: c('Uploader'),
			HierarchicalMenu: c('HierarchicalMenu'),
			MegaMenu: c('MegaMenu'),

			// 0.0.4 — wave C: pickers + table
			DatePicker: c('DatePicker'),
			DateRangePicker: c('DateRangePicker'),
			TimePicker: c('TimePicker'),
			Calendar: c('Calendar'),
			DataTable: c('DataTable'),

			// 0.0.5 — CSS-only motion components
			AvatarGroup: c('AvatarGroup'),
			GradientText: c('GradientText'),
			CopyButton: c('CopyButton'),
			ThemeToggler: c('ThemeToggler'),
			ShinyButton: c('ShinyButton'),
			RippleButton: c('RippleButton')
			// Motion-driven components live in `@human-synthesis/norns-ui/motion`
			// and are NOT registered here (opt-in import only).
		},
		helpers: [
			{
				from: '@human-synthesis/norns-ui/toast',
				imports: ['toast', 'notify', 'dismiss']
			}
		]
	};
}
