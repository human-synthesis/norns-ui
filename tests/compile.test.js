import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compile as svelteCompile, preprocess } from 'svelte/compiler';
import { nornsPreprocess } from '@human-synthesis/norns-core';

const DIR = fileURLToPath(new URL('../src/components', import.meta.url));

async function compileComponent(file) {
	const source = readFileSync(`${DIR}/${file}`, 'utf8');
	const pre = await preprocess(source, nornsPreprocess(), { filename: file });
	return svelteCompile(pre.code, { filename: file, generate: 'client', runes: true });
}

describe('components compile through the norns-core pipeline', () => {
	const files = readdirSync(DIR).filter((f) => f.endsWith('.n')).sort();

	test('palette is non-empty and includes Table', () => {
		expect(files).toContain('Table.n');
	});

	for (const file of files) {
		test(file, async () => {
			const out = await compileComponent(file);
			expect(out.js.code.length).toBeGreaterThan(0);
		});
	}
});
