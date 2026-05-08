import type { Component, Snippet } from 'svelte';

export type ToolbarProps = {
	orientation?: 'horizontal' | 'vertical';
	/** Accessible label, used as aria-label. */
	label?: string;
	children?: Snippet;
	class?: string;
};

declare const Toolbar: Component<ToolbarProps>;
export default Toolbar;
