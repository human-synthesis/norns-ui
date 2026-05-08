import type { Component, Snippet } from 'svelte';

export type ScrollAreaProps = {
	type?: 'hover' | 'auto' | 'scroll' | 'always';
	horizontal?: boolean;
	children?: Snippet;
	class?: string;
};

declare const ScrollArea: Component<ScrollAreaProps>;
export default ScrollArea;
