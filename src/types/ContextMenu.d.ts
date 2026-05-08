import type { Component, Snippet } from 'svelte';

export type ContextMenuItem = {
	label?: string;
	icon?: string;
	separator?: boolean;
	disabled?: boolean;
	onSelect?: (event: Event) => void;
	children?: ContextMenuItem[];
};

export type ContextMenuProps = {
	items?: ContextMenuItem[];
	trigger?: Snippet;
	triggerClass?: string;
};

declare const ContextMenu: Component<ContextMenuProps>;
export default ContextMenu;
