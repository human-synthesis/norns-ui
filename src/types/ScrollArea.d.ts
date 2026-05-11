import type { Component, Snippet } from 'svelte';

export type ScrollAreaProps = {
	/** Allow horizontal scrolling instead of just vertical. */
	horizontal?: boolean;
	children?: Snippet;
	class?: string;
};

declare const ScrollArea: Component<ScrollAreaProps>;
export default ScrollArea;
