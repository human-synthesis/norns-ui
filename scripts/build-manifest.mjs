#!/usr/bin/env bun
/**
 * Palette manifest builder (U-08 / D23). Derives `src/palette-manifest.json`
 * from what already exists — `types/*.d.ts` (props + docs), `contracts.js`
 * (spec bindability + binding kinds + snippet slots), `styles/tokens.css`
 * (design tokens) and the behaviors index — so the manifest cannot drift
 * from component reality without a test failing. Categories and canonical
 * example entries are the only authored seasoning, and the builder throws
 * when a component is missing from either map.
 *
 * Run: `bun scripts/build-manifest.mjs` (or `bun run build:manifest`).
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	ACTION_ADDRESS,
	QUERY_ADDRESS,
	ROOM_ADDRESS,
	SNIPPET_ADDRESS,
	STREAM_ADDRESS,
	contracts,
	snippetSlots
} from '../src/contracts.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ------------------------------------------------------------------ */
/* Authored seasoning                                                  */
/* ------------------------------------------------------------------ */

const CATEGORIES = {
	// data
	Calendar: 'data',
	Chart: 'data',
	DataTable: 'data',
	Kanban: 'data',
	Pagination: 'data',
	Table: 'data',
	Timeline: 'data',
	Tree: 'data',
	// realtime (D22 bindings — streamSource / roomChannel)
	ChatThread: 'realtime',
	Feed: 'realtime',
	LiveLog: 'realtime',
	PresenceAvatars: 'realtime',
	StreamText: 'realtime',
	// form
	Autocomplete: 'form',
	Checkbox: 'form',
	ColorPicker: 'form',
	DatePicker: 'form',
	DateRangePicker: 'form',
	Field: 'form',
	FieldGroup: 'form',
	Form: 'form',
	Input: 'form',
	Listbox: 'form',
	MultiSelect: 'form',
	NumberInput: 'form',
	OtpField: 'form',
	Radio: 'form',
	Select: 'form',
	Switch: 'form',
	TagsInput: 'form',
	Textarea: 'form',
	TimePicker: 'form',
	ToggleButton: 'form',
	ToggleButtonGroup: 'form',
	Uploader: 'form',
	// action
	Btn: 'action',
	ButtonGroup: 'action',
	CopyButton: 'action',
	RippleButton: 'action',
	ShinyButton: 'action',
	ThemeToggler: 'action',
	// navigation
	Breadcrumbs: 'navigation',
	ContextMenu: 'navigation',
	Dropdown: 'navigation',
	Header: 'navigation',
	HierarchicalMenu: 'navigation',
	MegaMenu: 'navigation',
	Stepper: 'navigation',
	Tabs: 'navigation',
	Toolbar: 'navigation',
	// overlay
	Dialog: 'overlay',
	Popover: 'overlay',
	Sheet: 'overlay',
	Tooltip: 'overlay',
	Window: 'overlay',
	// feedback
	Badge: 'feedback',
	Banner: 'feedback',
	Chip: 'feedback',
	Progress: 'feedback',
	ProgressCircular: 'feedback',
	Skeleton: 'feedback',
	Spinner: 'feedback',
	ToastProvider: 'feedback',
	// layout
	Accordion: 'layout',
	Card: 'layout',
	Carousel: 'layout',
	Collapsible: 'layout',
	HeroBanner: 'layout',
	ScrollArea: 'layout',
	Separator: 'layout',
	Surface: 'layout',
	// media
	Audio: 'media',
	Avatar: 'media',
	AvatarGroup: 'media',
	Icon: 'media',
	Image: 'media',
	Video: 'media',
	// typography
	GradientText: 'typography'
};

/**
 * One canonical page `components:` entry per spec-bindable component. The
 * first key is the component slot: a Query/Action address when the
 * component binds one, `null` for purely-literal components (both the
 * binding checker and the pages emitter skip a null primary).
 */
const EXAMPLES = {
	Table: { table: 'crm.Query.listDeals', columns: 'name,amount,status', pageSize: 10 },
	DataTable: { dataTable: 'crm.Query.listDeals', columns: 'name,amount' },
	Kanban: { kanban: 'deals.Query.pipeline', onMove: 'deals.Action.win', title: 'title' },
	Chart: { chart: 'deals.Query.amounts', type: 'bar', x: 'title', y: 'amount' },
	Form: { form: 'crm.Action.createDeal', method: 'POST' },
	Field: { field: null, label: 'Email', name: 'email' },
	Input: { input: null, name: 'email', type: 'email', placeholder: 'you@example.com' },
	Select: { select: null, name: 'stage' },
	Btn: { btn: null, variant: 'primary', type: 'submit' },
	Card: { card: null, padded: true },
	Badge: { badge: null, variant: 'success' },
	Banner: { banner: null, variant: 'info' },
	Pagination: { pagination: null, total: 120, pageSize: 20 },
	Checkbox: { checkbox: null, name: 'done', checked: true },
	Switch: { switch: null, name: 'active' },
	Textarea: { textarea: null, name: 'notes', rows: 4 },
	DatePicker: { datePicker: null, name: 'due', placeholder: 'Pick a date' },
	Uploader: { uploader: null, accept: 'image/*', multiple: true },
	Timeline: { timeline: 'crm.Query.history' },
	Tree: { tree: 'crm.Query.folders' },
	Calendar: { calendar: null, value: '2026-01-15' },
	StreamText: { streamText: { stream: 'games.Endpoint.chat' } },
	ChatThread: { chatThread: { room: 'games.Worker.matchRoom', sends: ['chat'], receives: ['chat'] } },
	Feed: { feed: { stream: 'ops.Endpoint.events' } },
	PresenceAvatars: { presenceAvatars: { room: 'games.Worker.matchRoom' }, max: 5 },
	LiveLog: { liveLog: { stream: 'ops.Endpoint.logs' }, maxLines: 200 }
};

const BEHAVIORS = [
	{ name: 'portal', description: 'Render the node into document.body so overlays escape stacking contexts.' },
	{ name: 'clickOutside', description: 'Invoke a callback when a pointer event lands outside the node.' },
	{ name: 'escape', description: 'Invoke a callback on Escape keydown while the node is mounted.' },
	{ name: 'focusTrap', description: 'Keep Tab focus cycling inside the node (dialogs, sheets).' },
	{ name: 'scrollLock', description: 'Lock body scroll while mounted (reference-counted acquire/release).' },
	{ name: 'useFloating', description: 'Anchor-position a floating element against a reference (@floating-ui).' },
	{ name: 'positionAt', description: 'One-shot floating position calculation for a coordinate anchor.' },
	{ name: 'rovingTabindex', description: 'Arrow-key roving focus for composite widgets (menus, listboxes).' },
	{ name: 'optimisticOverlay', description: 'Client-side id → value overlay that shadows server truth until reload (instant drag-drop, toggles).' }
];

/* ------------------------------------------------------------------ */
/* Derivation                                                          */
/* ------------------------------------------------------------------ */

/** Extract `{ name, type, required, doc? }` props from a `<Name>Props` d.ts. */
function parseProps(text, name) {
	const start = text.indexOf(`export type ${name}Props =`);
	if (start === -1) return [];
	const end = text.indexOf('\n};', start);
	if (end === -1) return [];
	const body = text.slice(start, end);
	// intersection types (`Omit<...> & { ... }`) — parse the literal part
	const open = body.indexOf('{');
	const lines = body.slice(open + 1).split('\n');
	const props = [];
	let doc = null;
	let pending = null;
	for (const raw of lines) {
		const line = raw.trim();
		if (pending) {
			pending.type += ` ${line.replace(/;$/, '')}`;
			if (line.endsWith(';')) {
				props.push(pending);
				pending = null;
			}
			continue;
		}
		const docLine = line.match(/^\/\*\*\s*(.*?)\s*(\*\/)?$/);
		if (docLine) {
			doc = docLine[1].replace(/\s*\*\/$/, '');
			continue;
		}
		if (line.startsWith('*')) continue;
		const prop = line.match(/^(\w+)(\?)?:\s*(.*)$/);
		if (!prop) continue;
		const entry = { name: prop[1], type: prop[3].replace(/;$/, ''), required: !prop[2] };
		if (doc) entry.doc = doc;
		doc = null;
		if (!prop[3].endsWith(';')) pending = entry;
		else props.push(entry);
	}
	return props;
}

/** 'query' | 'action' | 'snippet' | 'literal' for one contract entry. */
function bindingKind(schema) {
	const inner = schema.type === 'optional' ? schema.wrapped : schema;
	const requirement = inner.pipe?.find((item) => item.type === 'regex')?.requirement;
	if (requirement) {
		const source = String(requirement);
		if (source === String(QUERY_ADDRESS)) return 'query';
		if (source === String(ACTION_ADDRESS)) return 'action';
		if (source === String(SNIPPET_ADDRESS)) return 'snippet';
		if (source === String(STREAM_ADDRESS)) return 'stream';
		if (source === String(ROOM_ADDRESS)) return 'room';
	}
	return 'literal';
}

/** { vars, dark } parsed from tokens.css. */
function parseTokens(text) {
	const grab = (chunk) => {
		const vars = {};
		for (const m of chunk.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)) vars[m[1]] = m[2].trim();
		return vars;
	};
	// anchor on the actual blocks — the doc comment mentions both selectors
	const themeStart = text.indexOf('@theme {');
	const darkStart = text.search(/\[data-theme='dark'\]\s*\{/);
	return {
		vars: grab(text.slice(themeStart, darkStart === -1 ? undefined : darkStart)),
		dark: darkStart === -1 ? {} : grab(text.slice(darkStart))
	};
}

function componentEntry(name, dir, subpath) {
	const typeFile = join(root, 'src/types', `${name}.d.ts`);
	let props = [];
	try {
		props = parseProps(readFileSync(typeFile, 'utf-8'), name);
	} catch {
		// no type file — props stay unknown
	}
	const category = subpath === 'motion' ? 'motion' : CATEGORIES[name];
	if (!category) throw new Error(`build-manifest: no category for component ${name}`);
	const contract = contracts[name];
	const slots = snippetSlots[name];
	const bindability = [];
	if (contract) bindability.push('spec-bindable');
	if (slots) bindability.push('snippet-extensible');
	if (bindability.length === 0) bindability.push('custom-only');

	const entry = {
		name,
		category,
		import: `@human-synthesis/norns-ui/${subpath}/${name}.n`,
		bindability,
		props
	};
	if (contract) {
		const bindings = {};
		for (const [prop, schema] of Object.entries(contract.entries)) {
			bindings[prop] = bindingKind(schema);
		}
		entry.bindings = bindings;
		const example = EXAMPLES[name];
		if (!example) throw new Error(`build-manifest: no example entry for spec-bindable ${name}`);
		entry.example = example;
	}
	if (slots) entry.snippetSlots = slots;
	return entry;
}

export function buildManifest() {
	const list = (dir) =>
		readdirSync(join(root, 'src', dir))
			.filter((f) => f.endsWith('.n'))
			.map((f) => f.replace(/\.n$/, ''))
			.sort();

	const componentNames = list('components');
	const motionNames = list('motion');
	for (const name of Object.keys(CATEGORIES)) {
		if (!componentNames.includes(name)) {
			throw new Error(`build-manifest: category map lists unknown component ${name}`);
		}
	}
	for (const name of Object.keys(EXAMPLES)) {
		if (!contracts[name]) throw new Error(`build-manifest: example for uncontracted ${name}`);
	}

	const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
	const tokens = parseTokens(readFileSync(join(root, 'src/styles/tokens.css'), 'utf-8'));

	const components = componentNames.map((n) => componentEntry(n, 'components', 'components'));
	const motion = motionNames.map((n) => componentEntry(n, 'motion', 'motion'));
	const behaviors = BEHAVIORS.map((b) => ({
		...b,
		import: '@human-synthesis/norns-ui/behaviors'
	}));

	return {
		library: pkg.name,
		version: pkg.version,
		counts: {
			components: components.length,
			motion: motion.length,
			behaviors: behaviors.length,
			tokens: Object.keys(tokens.vars).length
		},
		components,
		motion,
		behaviors,
		tokens: {
			source: '@human-synthesis/norns-ui/styles/tokens',
			vars: tokens.vars,
			dark: tokens.dark
		}
	};
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
	const out = join(root, 'src/palette-manifest.json');
	writeFileSync(out, JSON.stringify(buildManifest(), null, '\t') + '\n');
	console.log(`wrote ${out}`);
}
