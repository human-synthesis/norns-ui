import type { Component } from 'svelte';

export type AudioSource = { src: string; type?: string };

export type AudioProps = {
	src?: string;
	sources?: AudioSource[];
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	preload?: 'none' | 'metadata' | 'auto';
	fallback?: string;
	class?: string;
};

declare const Audio: Component<AudioProps>;
export default Audio;
