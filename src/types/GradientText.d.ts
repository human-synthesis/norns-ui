import type { Component, Snippet } from 'svelte';

export type GradientTextProps = {
	/** Start color. Default `var(--color-primary-500)`. Accepts any CSS color. */
	from?: string;
	/** End color. Default `var(--color-info-500)`. */
	to?: string;
	/** Optional middle stop. */
	via?: string;
	/** Animate the gradient via background-position keyframes. Default true. */
	animate?: boolean;
	/** Gradient angle in degrees. Default 90. */
	angle?: number;
	children?: Snippet;
	class?: string;
};

declare const GradientText: Component<GradientTextProps>;
export default GradientText;
