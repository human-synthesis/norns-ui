import type { Component, Snippet } from 'svelte';

export type HeroBannerProps = {
	title: string;
	description?: string;
	/** Image src; fills the right half, text keeps the left half. */
	image?: string;
	align?: 'left' | 'center';
	/** Apply animated `GradientText` to the title. Default false. */
	actions?: Snippet;
	children?: Snippet;
	class?: string;
};

declare const HeroBanner: Component<HeroBannerProps>;
export default HeroBanner;
