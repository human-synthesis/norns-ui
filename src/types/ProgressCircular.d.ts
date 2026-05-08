import type { Component } from 'svelte';

export type ProgressCircularSize = 'sm' | 'md' | 'lg';

export type ProgressCircularProps = {
	value?: number;
	max?: number;
	size?: ProgressCircularSize;
	indeterminate?: boolean;
	class?: string;
};

declare const ProgressCircular: Component<ProgressCircularProps>;
export default ProgressCircular;
