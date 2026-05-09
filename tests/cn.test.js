import { describe, expect, test } from 'bun:test';
import { cn } from '../src/lib/cn.js';

describe('cn', () => {
	test('joins truthy parts with a single space', () => {
		expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
	});

	test('filters falsy values', () => {
		expect(cn('btn', null, undefined, '', false, 'btn-primary')).toBe('btn btn-primary');
	});

	test('later Tailwind utility wins (twMerge)', () => {
		expect(cn('p-4', 'p-2')).toBe('p-2');
	});

	test('inline conditional', () => {
		const variant = 'primary';
		expect(cn('btn', variant === 'primary' && 'btn-primary', 'extra')).toBe(
			'btn btn-primary extra'
		);
	});

	test('empty input returns empty string', () => {
		expect(cn()).toBe('');
		expect(cn(false, null)).toBe('');
	});
});
