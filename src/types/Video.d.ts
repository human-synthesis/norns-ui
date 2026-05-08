import type { Component } from 'svelte';

export type VideoSource = { src: string; type?: string };

export type VideoProps = {
	src?: string;
	sources?: VideoSource[];
	controls?: boolean;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	playsinline?: boolean;
	preload?: 'none' | 'metadata' | 'auto';
	poster?: string;
	fallback?: string;
	class?: string;
};

declare const Video: Component<VideoProps>;
export default Video;
