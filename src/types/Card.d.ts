import type { Component, Snippet } from 'svelte';

export type CardProps = {
	/** Wrap body in `.card-body` (default true). Set false for full-bleed content. */
	padded?: boolean;
	/** Apply `.card-interactive` hover/focus treatment. Implicit if `href` is set. */
	interactive?: boolean;
	/** Renders as `<a>` instead of `<div>` when set. */
	href?: string;
	target?: string;
	rel?: string;
	header?: Snippet;
	footer?: Snippet;
	children?: Snippet;
	class?: string;
};

declare const Card: Component<CardProps>;
export default Card;
