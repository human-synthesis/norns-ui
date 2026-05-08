import type { Component, Snippet } from 'svelte';

export type BannerVariant = 'info' | 'success' | 'warning' | 'danger';

export type BannerProps = {
	variant?: BannerVariant;
	/** Iconify icon name (e.g. `"lucide:alert-triangle"`). */
	icon?: string;
	actions?: Snippet;
	children?: Snippet;
	class?: string;
};

declare const Banner: Component<BannerProps>;
export default Banner;
