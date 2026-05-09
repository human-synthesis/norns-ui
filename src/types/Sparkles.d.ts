import type { Component, Snippet } from 'svelte';

export type SparklesProps = {
	density?: number;
	colors?: string[];
	minSize?: number;
	maxSize?: number;
	children?: Snippet;
	class?: string;
};

declare const Sparkles: Component<SparklesProps>;
export default Sparkles;
