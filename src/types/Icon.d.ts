import type { Component } from 'svelte';

export type IconProps = {
	/**
	 * Iconify icon name in `<set>:<name>` form, e.g. `"lucide:check"` or
	 * `"mdi:home"`. The `@iconify-json/lucide` package ships with the library;
	 * other sets can be installed alongside (`@iconify-json/heroicons`, etc.).
	 */
	name: string;
	/**
	 * Tailwind size utility for the icon, e.g. `"size-4"`, `"size-5"`. Default
	 * `"size-4"`. Pass any class string accepted by Tailwind.
	 */
	size?: string;
	flip?: 'horizontal' | 'vertical' | 'horizontal,vertical';
	rotate?: 90 | 180 | 270 | string;
	class?: string;
};

declare const Icon: Component<IconProps>;
export default Icon;
