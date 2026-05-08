import type { Component, Snippet } from 'svelte';

export type HeroBannerProps = {
	title: string;
	description?: string;
	/** Background/decorative image src; rendered with reduced opacity behind the content. */
	image?: string;
	align?: 'left' | 'center';
	actions?: Snippet;
	children?: Snippet;
	class?: string;
};

declare const HeroBanner: Component<HeroBannerProps>;
export default HeroBanner;
