import type { Component } from 'svelte';

export type MegaMenuItem = {
	label: string;
	href?: string;
	icon?: string;
	description?: string;
};

export type MegaMenuColumn = {
	title?: string;
	items: MegaMenuItem[];
};

export type MegaMenuSection = {
	label: string;
	cols?: 2 | 3 | 4;
	columns: MegaMenuColumn[];
};

export type MegaMenuProps = {
	sections?: MegaMenuSection[];
	/** aria-label for the <nav> wrapper. */
	label?: string;
	class?: string;
};

declare const MegaMenu: Component<MegaMenuProps>;
export default MegaMenu;
