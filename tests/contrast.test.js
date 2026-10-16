import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * WCAG contrast guard for the role tokens and accent presets in tokens.css.
 * Values are read from the stylesheet, so a token edit that drops below a
 * target fails here instead of in an app.
 */

const css = readFileSync(fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url)), 'utf8');

/** Custom properties declared in the first rule whose selector list starts with `selector`. */
function block(selector) {
	const start = css.indexOf(`${selector}`);
	if (start < 0) throw new Error(`no block ${selector}`);
	const open = css.indexOf('{', start);
	const body = css.slice(open + 1, css.indexOf('\n}', open));
	const vars = {};
	for (const [, name, value] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) vars[name] = value.trim();
	return vars;
}

const lightRoot = block('@theme');
const dark = block("[data-theme='dark'] {");
const green = block(":root,\n[data-accent='green']");
const violet = block("[data-accent='violet']");

/** Parse `oklch(L% C H)` or `white`. */
function oklch(value) {
	if (value === 'white') return [1, 0, 0];
	const m = value.match(/^oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)$/);
	if (!m) throw new Error(`not a plain oklch value: ${value}`);
	return [Number(m[1]) / 100, Number(m[2]), Number(m[3])];
}

/** Relative luminance via OKLab → linear sRGB (clamped to gamut). */
function luminance([L, C, h]) {
	const a = C * Math.cos((h * Math.PI) / 180);
	const b = C * Math.sin((h * Math.PI) / 180);
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const rgb = [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
	].map((v) => Math.min(1, Math.max(0, v)));
	return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function ratio(fg, bg) {
	const [hi, lo] = [luminance(oklch(fg)), luminance(oklch(bg))].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

const WHITE = 'white';

describe('dark theme role tokens', () => {
	const surfaces = ['--color-bg', '--color-bg-subtle', '--color-bg-elevated', '--color-bg-muted'];

	for (const fg of ['--color-fg', '--color-fg-muted', '--color-fg-subtle']) {
		test(`${fg} ≥ 4.5:1 on every surface`, () => {
			for (const bg of surfaces) expect(ratio(dark[fg], dark[bg])).toBeGreaterThanOrEqual(4.5);
		});
	}

	test('--color-border-strong ≥ 3:1 on bg and bg-elevated (control edges)', () => {
		expect(ratio(dark['--color-border-strong'], dark['--color-bg'])).toBeGreaterThanOrEqual(3);
		expect(ratio(dark['--color-border-strong'], dark['--color-bg-elevated'])).toBeGreaterThanOrEqual(3);
	});

	test('--color-border-floating ≥ 3:1 against bg and the surface it outlines (no shadows)', () => {
		expect(ratio(dark['--color-border-floating'], dark['--color-bg'])).toBeGreaterThanOrEqual(3);
		expect(ratio(dark['--color-border-floating'], dark['--color-bg-elevated'])).toBeGreaterThanOrEqual(3);
	});

	test('surfaces step up: bg < bg-subtle < bg-elevated < bg-muted', () => {
		const L = surfaces.map((s) => oklch(dark[s])[0]);
		for (let i = 1; i < L.length; i++) expect(L[i] - L[i - 1]).toBeGreaterThanOrEqual(0.03);
	});

	test('color-scheme is dark so native controls follow', () => {
		expect(css).toMatch(/\[data-theme='dark'\] \{\n\tcolor-scheme: dark;/);
	});
});

describe('light theme neutrals are unchanged', () => {
	const expected = {
		'--color-fg': 'oklch(20.4% 0 0)',
		'--color-fg-muted': 'oklch(43.9% 0 0)',
		'--color-fg-subtle': 'oklch(56.6% 0 0)',
		'--color-bg': 'white',
		'--color-bg-muted': 'oklch(96.7% 0 0)',
		'--color-bg-subtle': 'oklch(98.5% 0 0)',
		'--color-bg-elevated': 'oklch(98.5% 0 0)',
		'--color-bg-fill': 'oklch(94.5% 0 0)',
		'--color-bg-fill-strong': 'oklch(90.5% 0 0)',
		'--color-border': 'oklch(92.2% 0 0)',
		'--color-border-strong': 'oklch(86.9% 0 0)'
	};
	for (const [name, value] of Object.entries(expected)) {
		test(name, () => expect(lightRoot[name].replace(/\s*\/\*.*$/, '')).toBe(value));
	}
	test('floating edge (no shadows) is visible on white: ≥ 2.2:1', () => {
		expect(ratio(lightRoot['--color-border-floating'], 'white')).toBeGreaterThanOrEqual(2.2);
	});
});

for (const [name, preset] of [['green', green], ['violet', violet]]) {
	describe(`accent preset: ${name}`, () => {
		const lightBg = { bg: 'white', muted: lightRoot['--color-bg-muted'] };
		const darkBg = { bg: dark['--color-bg'], elevated: dark['--color-bg-elevated'], muted: dark['--color-bg-muted'] };

		test('declares 11 light steps, 11 dark steps and an ink', () => {
			expect(Object.keys(preset).filter((k) => k.startsWith('--ui-accent-light-'))).toHaveLength(11);
			expect(Object.keys(preset).filter((k) => k.startsWith('--ui-accent-dark-'))).toHaveLength(11);
			expect(preset['--ui-accent-ink']).toBeDefined();
		});

		test('light: white text on 600/700/800 fills ≥ 4.5:1', () => {
			for (const s of [600, 700, 800]) expect(ratio(WHITE, preset[`--ui-accent-light-${s}`])).toBeGreaterThanOrEqual(4.5);
		});

		test('light: 600 as text on bg and bg-muted ≥ 4.5:1, 500 ring ≥ 3:1', () => {
			expect(ratio(preset['--ui-accent-light-600'], lightBg.bg)).toBeGreaterThanOrEqual(4.5);
			expect(ratio(preset['--ui-accent-light-600'], lightBg.muted)).toBeGreaterThanOrEqual(4.5);
			expect(ratio(preset['--ui-accent-light-500'], lightBg.bg)).toBeGreaterThanOrEqual(3);
		});

		test('dark: ink on 600/700/800 fills ≥ 4.5:1', () => {
			for (const s of [600, 700, 800]) expect(ratio(preset['--ui-accent-ink'], preset[`--ui-accent-dark-${s}`])).toBeGreaterThanOrEqual(4.5);
		});

		test('dark: 400/500/600 as text on bg, bg-elevated and bg-muted ≥ 4.5:1', () => {
			for (const s of [400, 500, 600])
				for (const bg of Object.values(darkBg)) expect(ratio(preset[`--ui-accent-dark-${s}`], bg)).toBeGreaterThanOrEqual(4.5);
		});

		test('dark: badge (200 on 950) ≥ 4.5:1', () => {
			expect(ratio(preset['--ui-accent-dark-200'], preset['--ui-accent-dark-950'])).toBeGreaterThanOrEqual(4.5);
		});
	});
}

test('primary utilities point at the accent preset, not a fixed hue', () => {
	for (const s of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
		expect(lightRoot[`--color-primary-${s}`]).toBe(`var(--ui-accent-light-${s})`);
	}
});
