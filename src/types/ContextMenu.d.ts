import type { Component, Snippet } from 'svelte';

export type ContextMenuItem = {
	label?: string;
	icon?: string;
	separator?: boolean;
	disabled?: boolean;
	onSelect?: () => void;
	/**
	 * NOTE: nested submenus are not supported in 0.0.6+ (the property is
	 * accepted but children are ignored). Re-introduce when the upstream
	 * design needs them.
	 */
	children?: ContextMenuItem[];
};

export type ContextMenuProps = {
	items?: ContextMenuItem[];
	trigger?: Snippet;
	triggerClass?: string;
};

declare const ContextMenu: Component<ContextMenuProps>;
export default ContextMenu;
