import type { Component, Snippet } from 'svelte';

export type CardProps = {
	/** Wrap body in `.card-body` (default true). Set false for full-bleed content. */
	padded?: boolean;
	/** Apply `.card-interactive` hover/focus treatment. */
	interactive?: boolean;
	header?: Snippet;
	footer?: Snippet;
	children?: Snippet;
	class?: string;
};

declare const Card: Component<CardProps>;
export default Card;
