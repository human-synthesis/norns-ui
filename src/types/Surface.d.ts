import type { Component, Snippet } from 'svelte';

export type SurfaceProps = {
	tone?: 'glass';
	children?: Snippet;
	class?: string;
};

declare const Surface: Component<SurfaceProps>;
export default Surface;
