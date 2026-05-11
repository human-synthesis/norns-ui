import type { Component, Snippet } from 'svelte';

export type DropdownItem = {
	label?: string;
	icon?: string;
	separator?: boolean;
	disabled?: boolean;
	onSelect?: () => void;
};

export type DropdownProps = {
	open?: boolean;
	side?: 'top' | 'right' | 'bottom' | 'left';
	align?: 'start' | 'center' | 'end';
	sideOffset?: number;
	items?: DropdownItem[];
	trigger?: Snippet;
	children?: Snippet;
	triggerClass?: string;
	class?: string;
};

declare const Dropdown: Component<DropdownProps>;
export default Dropdown;
