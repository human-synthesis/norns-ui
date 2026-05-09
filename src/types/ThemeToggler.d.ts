import type { Component } from 'svelte';

export type ThemeTogglerProps = {
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
	size?: 'sm' | 'md' | 'lg';
	showLabel?: boolean;
	labelLight?: string;
	labelDark?: string;
	lightIcon?: string;
	darkIcon?: string;
	/** localStorage key. Default `'norns-theme'`. */
	storageKey?: string;
	class?: string;
};

declare const ThemeToggler: Component<ThemeTogglerProps>;
export default ThemeToggler;
