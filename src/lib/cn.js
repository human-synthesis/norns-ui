import { twMerge } from 'tailwind-merge';

/**
 * Merge a list of class strings, deduplicating Tailwind utilities so the
 * later one wins (e.g. `cn('p-4', 'p-2')` → `'p-2'`).
 *
 * Falsy inputs (null / undefined / '' / false) are filtered, so consumers
 * can pass conditionals inline:
 *   cn('btn', variant === 'primary' && 'btn-primary', extra)
 *
 * Exported from a subpath so users can swap to plain `clsx` if they don't
 * want tailwind-merge's bundle cost.
 *
 * @param {...(string | false | null | undefined)} parts
 * @returns {string}
 */
export function cn(...parts) {
	return twMerge(parts.filter(Boolean).join(' '));
}
