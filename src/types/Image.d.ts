import type { Component } from 'svelte';

export type ImageProps = {
	src: string;
	alt?: string;
	loading?: 'lazy' | 'eager';
	fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
	rounded?: boolean | 'sm' | 'md' | 'lg' | 'full';
	width?: number | string;
	height?: number | string;
	class?: string;
};

declare const Image: Component<ImageProps>;
export default Image;
