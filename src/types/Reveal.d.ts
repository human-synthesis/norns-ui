import type { Component, Snippet } from 'svelte';

export type RevealProps = {
	direction?: 'up' | 'down' | 'left' | 'right';
	/** Travel distance in pixels. Default 12. */
	distance?: number;
	/** Animation duration in seconds. Default 0.5. */
	duration?: number;
	/** Delay before animating, seconds. Default 0. */
	delay?: number;
	/** Re-trigger on every entry (false) or just the first time (true). Default true. */
	once?: boolean;
	/** IntersectionObserver threshold (0–1). Default 0.15. */
	threshold?: number;
	children?: Snippet;
	class?: string;
};

declare const Reveal: Component<RevealProps>;
export default Reveal;
