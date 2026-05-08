import type { Component, Snippet } from 'svelte';

export type DrawerSide = 'left' | 'right';

export type DrawerProps = {
	open?: boolean;
	side?: DrawerSide;
	title?: string;
	description?: string;
	hideClose?: boolean;
	trigger?: Snippet;
	children?: Snippet;
	triggerClass?: string;
	class?: string;
};

declare const Drawer: Component<DrawerProps>;
export default Drawer;
