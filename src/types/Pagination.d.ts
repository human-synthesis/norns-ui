import type { Component } from 'svelte';

export type PaginationProps = {
	page?: number;
	total?: number;
	pageSize?: number;
	/** How many pages to show on each side of the current. Default 1. */
	siblingCount?: number;
	class?: string;
};

declare const Pagination: Component<PaginationProps>;
export default Pagination;
