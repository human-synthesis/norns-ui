import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { presetUI } from '../src/auto-import.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(`${ROOT}/package.json`, 'utf8'));

/**
 * Resolve a public export path like `@human-synthesis/norns-ui/components/Btn.n`
 * to a filesystem path using the package.json exports map.
 */
function resolveExport(spec) {
	const rel = spec.replace('@human-synthesis/norns-ui/', '');
	for (const [pattern, target] of Object.entries(pkg.exports)) {
		if (pattern === '.' || pattern === './package.json') continue;
		const patternPrefix = pattern.replace(/^\.\//, '').replace(/\/\*$/, '/');
		if (pattern.endsWith('/*') && rel.startsWith(patternPrefix)) {
			const tail = rel.slice(patternPrefix.length);
			return `${ROOT}/${target.replace(/^\.\//, '').replace(/\/\*$/, '/')}${tail}`;
		}
		if (rel === pattern.replace(/^\.\//, '')) {
			return `${ROOT}/${target.replace(/^\.\//, '')}`;
		}
	}
	return null;
}

describe('presetUI', () => {
	const preset = presetUI();

	test('returns components + helpers', () => {
		expect(typeof preset.components).toBe('object');
		expect(Array.isArray(preset.helpers)).toBe(true);
	});

	test('every mapped component points to a real .n file via the exports map', () => {
		const missing = [];
		for (const [name, spec] of Object.entries(preset.components)) {
			const resolved = resolveExport(spec);
			if (!resolved || !existsSync(resolved)) {
				missing.push(`${name} -> ${spec} (resolved: ${resolved})`);
			}
		}
		expect(missing).toEqual([]);
	});

	test('Btn is mapped (sanity)', () => {
		expect(preset.components.Btn).toBe('@human-synthesis/norns-ui/components/Btn.n');
	});

	test('helpers expose the toast subpath', () => {
		const toastHelper = preset.helpers.find((h) => h.from?.endsWith('/toast'));
		expect(toastHelper).toBeDefined();
		expect(toastHelper.imports).toContain('toast');
	});
});
