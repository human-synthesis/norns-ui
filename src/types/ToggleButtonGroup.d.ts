import type { Component } from 'svelte';

export type ToggleGroupItem = {
	value: string;
	label?: string;
	icon?: string;
	iconOnly?: boolean;
	disabled?: boolean;
};

export type ToggleButtonGroupProps = {
	items?: ToggleGroupItem[];
	value?: string | string[];
	multiple?: boolean;
	disabled?: boolean;
	class?: string;
};

declare const ToggleButtonGroup: Component<ToggleButtonGroupProps>;
export default ToggleButtonGroup;
