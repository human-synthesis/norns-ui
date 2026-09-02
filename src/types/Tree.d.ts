import type { Component } from 'svelte';

export type TreeNode = {
	id: string | number;
	label: string;
	icon?: string;
	children?: TreeNode[];
};

export type TreeProps = {
	items?: TreeNode[];
	/** Alias for `items` — the prop a generated Page binds a Query result to. */
	data?: TreeNode[];
	/** Array of node ids that are expanded. Bindable. */
	expanded?: (string | number)[];
	/** Currently-selected node id. Bindable. */
	selected?: string | number;
	class?: string;
};

declare const Tree: Component<TreeProps>;
export default Tree;
