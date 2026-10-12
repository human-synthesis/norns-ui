import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = (path) => readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), 'utf8');

test('reduced motion removes transitions instead of shortening them', () => {
	const css = read('src/styles/atoms.css');
	const block = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
	const rule = block.slice(0, block.indexOf('}'));
	// A 0.01ms transition still costs a transition per changed property per
	// element per frame; `none` costs nothing.
	expect(rule).toContain('transition: none !important;');
	expect(rule).not.toContain('transition-duration');
	expect(rule).toContain('animation-duration: 0.01ms !important;');
});

test('RippleButton cleans up on animationend (its ripple is a CSS animation)', () => {
	const src = read('src/components/RippleButton.n');
	expect(src).toContain('onanimationend');
	expect(src).not.toContain('ontransitionend');
});
