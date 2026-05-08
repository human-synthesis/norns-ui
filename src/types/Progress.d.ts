import type { Component } from 'svelte';

export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger';

export type ProgressProps = {
	value?: number;
	max?: number;
	variant?: ProgressVariant;
	indeterminate?: boolean;
	class?: string;
};

declare const Progress: Component<ProgressProps>;
export default Progress;
