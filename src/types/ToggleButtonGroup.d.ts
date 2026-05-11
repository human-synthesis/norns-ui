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
	value?: string | string[] | undefined;
	multiple?: boolean;
	disabled?: boolean;
	label?: string;
	class?: string;
};

declare const ToggleButtonGroup: Component<ToggleButtonGroupProps>;
export default ToggleButtonGroup;
