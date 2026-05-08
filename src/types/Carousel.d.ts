import type { Component, Snippet } from 'svelte';

export type CarouselSlide = {
	src?: string;
	alt?: string;
	[key: string]: unknown;
};

export type CarouselProps = {
	slides?: CarouselSlide[];
	index?: number;
	autoplay?: boolean;
	/** Autoplay interval in milliseconds. Default 5000. */
	interval?: number;
	/** Default aspect ratio applied if no explicit `class="aspect-..."` is passed. */
	aspect?: 'video' | 'square' | 'wide' | 'none';
	/** Custom slide renderer; receives `(slide, i)` and runs only for slides without `src`. */
	children?: Snippet<[CarouselSlide, number]>;
	class?: string;
};

declare const Carousel: Component<CarouselProps>;
export default Carousel;
