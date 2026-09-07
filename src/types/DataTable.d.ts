import type { Component } from 'svelte';

export type DataTableColumn = {
	key: string;
	label?: string;
	width?: string;
	class?: string;
	cellClass?: string;
	sortable?: boolean;
	/** Render the cell value (e.g. a date or number formatter). */
	format?: (value: unknown, row: Record<string, unknown>) => string | number;
};

export type DataTableProps = {
	columns?: DataTableColumn[];
	rows?: Record<string, unknown>[];
	striped?: boolean;
	dense?: boolean;
	stickyHeader?: boolean;
	/** Dims the table and swaps the empty message while a page is being fetched (see `useList()`). */
	loading?: boolean;
	emptyMessage?: string;
	loadingMessage?: string;
	/**
	 * Currently-sorted column key. Bindable. The table only flips these two;
	 * sort `rows` yourself or bind them to `useList()` for server-side ordering.
	 */
	sortKey?: string;
	sortDir?: 'asc' | 'desc';
	onrowclick?: (row: Record<string, unknown>, index: number) => void;
	class?: string;
};

declare const DataTable: Component<DataTableProps>;
export default DataTable;
