import type { Component } from 'svelte';

export type BreadcrumbItem = {
	label: string;
	href?: string;
};

export type BreadcrumbsProps = {
	items?: BreadcrumbItem[];
	separator?: string;
	class?: string;
};

declare const Breadcrumbs: Component<BreadcrumbsProps>;
export default Breadcrumbs;
