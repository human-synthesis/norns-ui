import type { Component, Snippet } from 'svelte';

export type HeaderProps = {
	sticky?: boolean;
	brand?: Snippet;
	nav?: Snippet;
	actions?: Snippet;
	class?: string;
};

declare const Header: Component<HeaderProps>;
export default Header;
