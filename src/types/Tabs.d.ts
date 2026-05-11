import type { Component, Snippet } from 'svelte';

export type TabsItem = {
	value: string;
	label: string;
	panel?: Snippet;
	disabled?: boolean;
};

export type TabsProps = {
	value?: string;
	items?: TabsItem[];
	/** ARIA label for the tablist. Default 'Tabs'. */
	label?: string;
	class?: string;
};

declare const Tabs: Component<TabsProps>;
export default Tabs;
