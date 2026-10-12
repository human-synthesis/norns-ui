import { describe, expect, test } from 'bun:test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * The norns-ui rendering rules (see CLAUDE.md, "Library rules"). Every rule
 * here is mandatory; this test is what keeps them true.
 *
 *   1. No hover styling. `:hover` only where it triggers behaviour.
 *   2. No transitions. Animations only on loading indicators, and only
 *      colour or rotation.
 *   3. No transforms outside those indicator keyframes.
 *   4. Fully opaque: no opacity, no translucent colours.
 *   5. No shadows, blur, backdrop-filter, filter, blend modes or gradients.
 *   6. Focus is an outline, never a shadow.
 *   7. Sizes in rem (borders excepted), so `data-size` scales everything.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(`${ROOT}/${p}`, 'utf8');
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Flatten a stylesheet into { sel, body } rules (one level of nesting is enough here). */
function rules(css) {
	const out = [];
	const re = /([^{}]+)\{([^{}]*)\}/g;
	let m;
	while ((m = re.exec(stripComments(css)))) out.push({ sel: m[1].trim().replace(/\s+/g, ' '), body: m[2] });
	return out;
}

const atoms = read('src/styles/atoms.css');
const atomRules = rules(atoms);

/** Indicator animations: the only place motion is allowed. */
const INDICATOR_KEYFRAMES = ['norns-spin', 'norns-pulse', 'norns-progress-pulse'];
const keyframeBlocks = [...stripComments(atoms).matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?\}\s*)\}/g)];

/** Selectors whose :hover drives behaviour (opening a menu), not decoration. */
const FUNCTIONAL_HOVER = ['.nav-menu-item:hover > .nav-menu-content'];

describe('atoms.css', () => {
	test('no decorative :hover', () => {
		const offenders = atomRules
			.filter((r) => r.sel.includes(':hover'))
			.flatMap((r) => r.sel.split(',').map((s) => s.trim()))
			.filter((s) => s.includes(':hover') && !FUNCTIONAL_HOVER.includes(s));
		expect(offenders).toEqual([]);
	});

	test('no transitions anywhere', () => {
		expect(atomRules.filter((r) => /(^|[\s;])transition(-[a-z]+)?\s*:/.test(r.body)).map((r) => r.sel)).toEqual([]);
		expect(stripComments(atoms)).not.toMatch(/@apply[^;]*\btransition/);
	});

	test('animations only on indicators, keyframes only colour or rotation', () => {
		const names = keyframeBlocks.map((k) => k[1]);
		expect(names.filter((n) => !INDICATOR_KEYFRAMES.includes(n))).toEqual([]);
		for (const [, name, body] of keyframeBlocks) {
			const props = [...body.matchAll(/([a-z-]+)\s*:/g)].map((p) => p[1]);
			const allowed = name === 'norns-spin' ? ['transform'] : ['background-color'];
			expect({ name, props: props.filter((p) => !allowed.includes(p)) }).toEqual({ name, props: [] });
		}
		const animated = atomRules.filter((r) => /animation(-name)?\s*:/.test(r.body));
		for (const r of animated) {
			const used = r.body.match(/animation(?:-name)?\s*:\s*([\w-]+)/)[1];
			expect({ sel: r.sel, used: INDICATOR_KEYFRAMES.includes(used) || used === 'none' }).toEqual({ sel: r.sel, used: true });
		}
	});

	test('no transforms, translate, scale or rotate outside indicator keyframes', () => {
		const offenders = atomRules
			.filter((r) => !/^(from|to|\d+%)/.test(r.sel))
			.filter((r) => /(^|[\s;])(transform|translate|scale|rotate)\s*:/.test(r.body) || /@apply[^;]*\b-?(translate|scale|rotate)-/.test(r.body))
			.map((r) => r.sel);
		expect(offenders).toEqual([]);
	});

	test('fully opaque: no opacity, no translucent colours', () => {
		const opacity = atomRules.filter((r) => /(^|[\s;])opacity\s*:/.test(r.body) || /@apply[^;]*\bopacity-/.test(r.body));
		expect(opacity.map((r) => r.sel)).toEqual([]);
		const translucent = atomRules.filter((r) => /color-mix\([^;]*transparent|\/\s*0?\.\d+\s*\)|\/\s*\d+%\s*\)/.test(r.body));
		expect(translucent.map((r) => r.sel)).toEqual([]);
	});

	test('no shadows, blur, backdrop, filter, blend modes or gradients', () => {
		const offenders = atomRules
			.filter((r) => /box-shadow\s*:(?!\s*none)|text-shadow|drop-shadow|backdrop|filter\s*:|mix-blend-mode|gradient\(|--ui-elev/.test(r.body) || /@apply[^;]*\b(shadow|blur|backdrop-|bg-gradient)/.test(r.body))
			.map((r) => r.sel);
		expect(offenders).toEqual([]);
	});

	test('no px font sizes (rem only, so data-size scales text)', () => {
		expect(stripComments(atoms)).not.toMatch(/text-\[\d+px\]|font-size:\s*\d+px/);
	});

	test('no universal-selector rules (no per-element style matching)', () => {
		expect(atomRules.filter((r) => /(^|,\s*)\*(\s|,|$|::)/.test(r.sel)).map((r) => r.sel)).toEqual([]);
	});
});

describe('tokens.css', () => {
	const tokens = read('src/styles/tokens.css');
	test('elevation and motion tokens are inert', () => {
		for (const [, name, value] of stripComments(tokens).matchAll(/(--ui-elev-[\w-]+|--ui-motion-(?:fast|med|slow)):\s*([^;]+);/g)) {
			expect({ name, value: value.trim() }).toEqual({ name, value: name.startsWith('--ui-elev') ? 'none' : '0s' });
		}
	});
	test('data-size scales the root font size', () => {
		for (const size of ['compact', 'large']) expect(tokens).toMatch(new RegExp(`html\\[data-size='${size}'\\]\\s*\\{\\s*font-size:\\s*[\\d.]+%`));
	});
});

describe('components', () => {
	const dirs = ['src/components'];
	const files = dirs.flatMap((d) => readdirSync(`${ROOT}/${d}`).filter((f) => f.endsWith('.n')).map((f) => `${d}/${f}`));
	const BANNED = /\b(hover:|group-hover:|transition(-[a-z]+)?\b|duration-\d|animate-[a-z]|shadow(-[a-z0-9]+)?\b|opacity-\d|backdrop-|blur(-[a-z]+)?\b|scale-\d|-?translate-[xy]|rotate-\d|bg-gradient|linear-gradient|radial-gradient)/;

	test('no effect utilities or inline effects in any component', () => {
		const offenders = [];
		for (const f of files) {
			read(f).split('\n').forEach((line, i) => {
				if (/^\s*(\/\/|#)/.test(line)) return;
				// `onblur` / `transition` inside identifiers are not utilities
				const scrubbed = line.replace(/\bon(blur|transitionend|animationend)\b/g, '');
				if (BANNED.test(scrubbed) || /style[!]?="[^"]*(transition|transform|opacity|box-shadow|filter)/.test(scrubbed)) offenders.push(`${f}:${i + 1}: ${line.trim()}`);
			});
		}
		expect(offenders).toEqual([]);
	});

	test('no mouse tracking: only Tooltip listens to pointer enter/leave', () => {
		const offenders = files.filter((f) => /onmouse(enter|leave|over|move)|onpointer(enter|leave|over|move)/.test(read(f)) && !f.endsWith('/Tooltip.n'));
		expect(offenders).toEqual([]);
	});

	test('effect components are not part of the base library', () => {
		for (const name of ['ShinyButton', 'RippleButton', 'GradientText']) expect(existsSync(`${ROOT}/src/components/${name}.n`)).toBe(false);
		expect(existsSync(`${ROOT}/src/motion`)).toBe(false);
		expect(JSON.parse(read('package.json')).dependencies.motion).toBeUndefined();
	});
});
