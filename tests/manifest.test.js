import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'bun:test';

import { buildManifest } from '../scripts/build-manifest.mjs';
import { contracts, snippetSlots } from '../src/contracts.js';

const root = join(import.meta.dir, '..');
const checkedIn = JSON.parse(readFileSync(join(root, 'src/palette-manifest.json'), 'utf-8'));
const built = buildManifest();

describe('palette manifest (U-08)', () => {
	test('checked-in manifest matches a fresh build (no drift)', () => {
		expect(checkedIn).toEqual(built);
	});

	test('covers every component and motion file', () => {
		const files = readdirSync(join(root, 'src/components')).filter((f) => f.endsWith('.n'));
		expect(built.counts.components).toBe(files.length);
		expect(built.components.map((c) => c.name)).toEqual(files.map((f) => f.slice(0, -2)).sort());
		expect(built.counts.motion).toBe(5);
	});

	test('every component has a category, import path and parsed props', () => {
		for (const c of [...built.components, ...built.motion]) {
			expect(c.category, c.name).toBeTruthy();
			expect(c.import, c.name).toContain(`/${c.name}.n`);
			expect(Array.isArray(c.props), c.name).toBe(true);
			expect(c.props.length, c.name).toBeGreaterThan(0);
		}
	});

	test('bindability flags follow contracts and snippet slots', () => {
		for (const c of built.components) {
			const expected = [];
			if (contracts[c.name]) expected.push('spec-bindable');
			if (snippetSlots[c.name]) expected.push('snippet-extensible');
			if (expected.length === 0) expected.push('custom-only');
			expect(c.bindability, c.name).toEqual(expected);
		}
	});

	test('every spec-bindable component carries bindings and a canonical example', () => {
		const bindable = built.components.filter((c) => c.bindability.includes('spec-bindable'));
		expect(bindable.length).toBe(Object.keys(contracts).length);
		for (const c of bindable) {
			expect(c.bindings, c.name).toBeDefined();
			expect(c.example, c.name).toBeDefined();
			const [primaryKey] = Object.keys(c.example);
			expect(primaryKey[0].toUpperCase() + primaryKey.slice(1), c.name).toBe(c.name);
		}
	});

	test('binding kinds are derived from the contract schemas', () => {
		const table = built.components.find((c) => c.name === 'Table');
		expect(table.bindings.data).toBe('query');
		expect(table.bindings.cell).toBe('snippet');
		expect(table.bindings.columns).toBe('literal');
		expect(table.snippetSlots).toEqual({ cell: ['row', 'column', 'value'], empty: [] });
		const kanban = built.components.find((c) => c.name === 'Kanban');
		expect(kanban.bindings.onMove).toBe('action');
		const tree = built.components.find((c) => c.name === 'Tree');
		expect(tree.bindings).toEqual({ data: 'query', class: 'literal' });
	});

	test('example entries validate against their own contracts (normalized)', () => {
		const v = require('valibot');
		for (const c of built.components) {
			if (!c.example) continue;
			const [primaryKey, ...rest] = Object.keys(c.example);
			const primary = c.example[primaryKey];
			const props = {};
			if (typeof primary === 'string' && /^\w+\.(Query|Action)\.\w+$/.test(primary)) {
				props[primary.includes('.Action.') ? 'action' : 'data'] = primary;
			} else if (primary && typeof primary === 'object') {
				// realtime bindings normalize the way checkBindings does (K-27)
				if (typeof primary.stream === 'string') props.streamSource = primary.stream;
				if (typeof primary.room === 'string') props.roomChannel = primary.room;
			}
			for (const key of rest) props[key] = c.example[key];
			expect(v.safeParse(contracts[c.name], props).success, c.name).toBe(true);
		}
	});

	test('props keep docs and requiredness from the d.ts source', () => {
		const table = built.components.find((c) => c.name === 'Table');
		const data = table.props.find((p) => p.name === 'data');
		expect(data.doc).toContain('Query result');
		expect(data.required).toBe(false);
	});

	test('tokens come from the @theme block with the dark remap alongside', () => {
		expect(built.counts.tokens).toBeGreaterThan(90);
		expect(built.tokens.vars['--color-primary-500']).toContain('oklch');
		expect(Object.keys(built.tokens.dark).length).toBeGreaterThan(10);
		expect(built.tokens.source).toBe('@human-synthesis/norns-ui/styles/tokens');
	});

	test('behaviors list the public exports', () => {
		const index = readFileSync(join(root, 'src/lib/behaviors/index.js'), 'utf-8');
		for (const b of built.behaviors) {
			expect(index, b.name).toContain(b.name);
			expect(b.import).toBe('@human-synthesis/norns-ui/behaviors');
		}
		// completeness: every behavior module is represented in the manifest
		const files = readdirSync(join(root, 'src/lib/behaviors')).filter((f) =>
			f.endsWith('.svelte.js')
		);
		for (const f of files) {
			const stem = f.replace('.svelte.js', '').toLowerCase();
			expect(
				built.behaviors.some((b) => b.name.toLowerCase().includes(stem) || stem.includes(b.name.toLowerCase())),
				f
			).toBe(true);
		}
	});

	// v6 U-13 — the report's finding 14: the manifest under-reported form-atom
	// props (Select really does take name/id/required/disabled), and while ui://
	// is down it is the only machine-readable palette. Pin the form-participation
	// surface so it cannot silently regress.
	test('form atoms declare their form-participation props', () => {
		const FORM_PROPS = {
			Select: ['name', 'id', 'required', 'disabled'],
			Input: ['name', 'id', 'required', 'disabled', 'readonly', 'ariaLabel'],
			Textarea: ['name', 'id', 'required', 'disabled', 'readonly'],
			Checkbox: ['name', 'id', 'required', 'disabled', 'value'],
			Radio: ['name', 'id', 'required', 'disabled', 'value'],
			Switch: ['name', 'id', 'required', 'disabled', 'value'],
			TagsInput: ['name', 'id', 'ariaLabel']
		};
		for (const [name, expected] of Object.entries(FORM_PROPS)) {
			const entry = built.components.find((c) => c.name === name);
			const props = entry.props.map((p) => p.name);
			for (const p of expected) expect(props, `${name}.${p}`).toContain(p);
		}
	});

	// U-14 — session-v2 finding 01: DataTable's binding said `data` but its
	// only prop was `rows`, so every generated table silently rendered empty.
	// The invariant: a binding key the generator will emit as a prop must BE a
	// prop of the component, for every spec-bindable component.
	test('every query/action binding key is a real prop of its component', () => {
		for (const entry of built.components) {
			const props = new Set((entry.props ?? []).map((p) => p.name));
			for (const [key, kind] of Object.entries(entry.bindings ?? {})) {
				if (kind !== 'query' && kind !== 'action') continue;
				expect(props.has(key), `${entry.name}.${key} (${kind}) is bound but not a prop`).toBe(true);
			}
		}
	});
});
