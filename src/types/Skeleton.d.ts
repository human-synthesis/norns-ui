import type { Component } from 'svelte';

export type SkeletonVariant = 'rect' | 'text' | 'circle';

export type SkeletonProps = {
	variant?: SkeletonVariant;
	width?: number | string;
	height?: number | string;
	class?: string;
};

declare const Skeleton: Component<SkeletonProps>;
export default Skeleton;
