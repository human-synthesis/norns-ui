/**
 * Map a `{ variant, size, ... }` prop bag to a class string following the
 * `<atom>-<variant>` naming convention. Skips falsy values (so an undefined
 * variant doesn't emit `btn-undefined`).
 *
 *   variantClasses('btn', { variant: 'primary', size: 'sm' })
 *   → 'btn-primary btn-sm'
 *
 * Used by component wrappers (Btn, Badge, etc.) so the variant convention
 * stays uniform across the library.
 *
 * @param {string} atom
 * @param {Record<string, string | undefined | false>} props
 * @returns {string}
 */
export function variantClasses(atom, props) {
	const out = [];
	for (const value of Object.values(props)) {
		if (value) out.push(`${atom}-${value}`);
	}
	return out.join(' ');
}
