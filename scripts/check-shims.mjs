#!/usr/bin/env bun
/**
 * Drift detector for hand-rolled .d.ts shims vs the .n component sources.
 *
 * For every component in src/components/*.n and src/motion/*.n:
 *   1. Find the $props() destructure inside <script>.
 *   2. Extract the external prop names (left side of `:` if renamed).
 *   3. Confirm a shim file exists at src/types/<Name>.d.ts.
 *   4. Confirm each prop name appears in the shim text.
 *
 * Reports:
 *   ERROR — source without shim, shim without source.
 *   WARN  — prop in source but not mentioned in shim. (False positive when
 *           prop is inherited via Omit<HTMLElementAttributes,...>; reviewer
 *           confirms.)
 *
 * Exit 1 on ERROR. WARN does not fail unless --strict is passed.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const COMPONENT_DIRS = ['src/components', 'src/motion'];
const TYPES_DIR = 'src/types';
const STRICT = process.argv.includes('--strict');

const errors = [];
const warnings = [];

function listFiles(dir, ext) {
	try {
		return readdirSync(join(ROOT, dir))
			.filter((f) => f.endsWith(ext))
			.map((f) => ({ name: basename(f, ext), path: join(ROOT, dir, f), dir }));
	} catch {
		return [];
	}
}

function extractPropsFromSource(text) {
	const scriptMatch = text.match(/<script[^>]*>([\s\S]*?)<\/script>/);
	if (!scriptMatch) return null;
	const script = scriptMatch[1];

	// Find `} := $props()` or `} .= $props()` and walk back to matching `{`.
	const propsCallRe = /(\}\s*(?::=|\.=)\s*\$props\s*\(\s*\))/m;
	const m = propsCallRe.exec(script);
	if (!m) return [];
	const closeIdx = script.indexOf('}', m.index);
	let depth = 1;
	let i = closeIdx - 1;
	while (i >= 0 && depth > 0) {
		const ch = script[i];
		if (ch === '}') depth++;
		else if (ch === '{') depth--;
		if (depth === 0) break;
		i--;
	}
	if (i < 0) return [];
	const inner = script.slice(i + 1, closeIdx);

	const props = [];
	for (const rawLine of inner.split('\n')) {
		const line = rawLine.replace(/\/\/.*$/, '').trim();
		if (!line) continue;
		if (line.startsWith('...')) continue;
		// Strip trailing comma if present.
		const stripped = line.replace(/,\s*$/, '');
		// External name = part before `:` or `=`, whichever is first.
		const colonIdx = stripped.indexOf(':');
		const eqIdx = stripped.indexOf('=');
		let cut = stripped.length;
		if (colonIdx >= 0) cut = Math.min(cut, colonIdx);
		if (eqIdx >= 0) cut = Math.min(cut, eqIdx);
		const name = stripped.slice(0, cut).trim();
		if (!name) continue;
		if (!/^[$A-Za-z_][\w$]*$/.test(name)) continue;
		props.push(name);
	}
	return props;
}

function shimMentions(shimText, propName) {
	const re = new RegExp(`\\b${propName}\\??\\s*:`);
	return re.test(shimText);
}

function shimExtendsHtmlAttributes(shimText) {
	return /HTML\w*Attributes/.test(shimText);
}

const HTML_INHERITED = new Set([
	'class', 'style', 'id', 'name', 'value', 'type', 'disabled', 'readonly',
	'placeholder', 'required', 'autocomplete', 'autofocus', 'tabindex', 'role',
	'onclick', 'onchange', 'oninput', 'onfocus', 'onblur', 'onsubmit', 'onkeydown',
	'onkeyup', 'onkeypress', 'onmousedown', 'onmouseup', 'onmouseenter', 'onmouseleave',
	'oncontextmenu', 'onwheel', 'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
	'min', 'max', 'step', 'multiple', 'checked', 'pattern', 'spellcheck', 'maxlength',
	'minlength', 'rows', 'cols', 'wrap', 'form', 'formaction', 'formenctype', 'list',
	'accept', 'capture', 'controls', 'loop', 'muted', 'autoplay', 'preload', 'poster'
]);

const sources = COMPONENT_DIRS.flatMap((dir) => listFiles(dir, '.n'));
const shims = listFiles(TYPES_DIR, '.d.ts');
const shimNames = new Set(shims.map((s) => s.name));
const sourceNames = new Set(sources.map((s) => s.name));

for (const src of sources) {
	if (!shimNames.has(src.name)) {
		errors.push(`MISSING SHIM: ${src.dir}/${src.name}.n has no ${TYPES_DIR}/${src.name}.d.ts`);
		continue;
	}
	const text = readFileSync(src.path, 'utf8');
	const props = extractPropsFromSource(text);
	if (props === null) {
		warnings.push(`NO SCRIPT: ${src.dir}/${src.name}.n has no <script> block (skipping prop check)`);
		continue;
	}
	const shim = shims.find((s) => s.name === src.name);
	const shimText = readFileSync(shim.path, 'utf8');
	const inheritsHtml = shimExtendsHtmlAttributes(shimText);
	for (const prop of props) {
		if (shimMentions(shimText, prop)) continue;
		if (inheritsHtml && HTML_INHERITED.has(prop)) continue;
		warnings.push(`DRIFT: ${src.name}.n exposes \`${prop}\` but ${src.name}.d.ts doesn't mention it`);
	}
}

for (const shim of shims) {
	if (!sourceNames.has(shim.name)) {
		errors.push(`ORPHAN SHIM: ${TYPES_DIR}/${shim.name}.d.ts has no matching .n source`);
	}
}

const fmt = (label, lines) =>
	lines.length === 0 ? `\n${label}: none` : `\n${label}:\n  ${lines.join('\n  ')}`;

console.log(`Checked ${sources.length} sources against ${shims.length} shims.`);
console.log(fmt('Errors', errors));
console.log(fmt('Warnings', warnings));

if (errors.length > 0) {
	console.log('\nFAIL');
	process.exit(1);
}
if (STRICT && warnings.length > 0) {
	console.log('\nFAIL (strict mode)');
	process.exit(1);
}
console.log('\nOK');
