import type { Component, Snippet } from 'svelte';

export type CollapsibleProps = {
	open?: boolean;
	title?: string;
	trigger?: Snippet;
	children?: Snippet;
	class?: string;
};

declare const Collapsible: Component<CollapsibleProps>;
export default Collapsible;
