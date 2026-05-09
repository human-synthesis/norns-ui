import type { Component, Snippet } from 'svelte';

export type GradientBackgroundProps = {
	colors?: string[];
	/** Loop duration in seconds. Default 18. */
	duration?: number;
	/** Gradient angle. Default 130. */
	angle?: number;
	children?: Snippet;
	class?: string;
};

declare const GradientBackground: Component<GradientBackgroundProps>;
export default GradientBackground;
