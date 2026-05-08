import type { Component } from 'svelte';

export type HierarchicalMenuItem = {
	label: string;
	href?: string;
	icon?: string;
	description?: string;
	children?: HierarchicalMenuItem[];
};

export type HierarchicalMenuProps = {
	items?: HierarchicalMenuItem[];
	/** aria-label for the <nav> wrapper. */
	label?: string;
	onSelect?: (item: HierarchicalMenuItem) => void;
	class?: string;
};

declare const HierarchicalMenu: Component<HierarchicalMenuProps>;
export default HierarchicalMenu;
