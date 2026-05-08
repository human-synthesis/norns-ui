import type { Component } from 'svelte';

export type DataTableColumn = {
	key: string;
	label?: string;
	width?: string;
	class?: string;
	cellClass?: string;
	sortable?: boolean;
};

export type DataTableProps = {
	columns?: DataTableColumn[];
	rows?: Record<string, unknown>[];
	striped?: boolean;
	dense?: boolean;
	stickyHeader?: boolean;
	emptyMessage?: string;
	/** Currently-sorted column key. Bindable. */
	sortKey?: string;
	sortDir?: 'asc' | 'desc';
	onrowclick?: (row: Record<string, unknown>, index: number) => void;
	class?: string;
};

declare const DataTable: Component<DataTableProps>;
export default DataTable;
