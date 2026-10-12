import type { Component, Snippet } from 'svelte';

export type SurfaceProps = {
	children?: Snippet;
	class?: string;
};

declare const Surface: Component<SurfaceProps>;
export default Surface;
