import type { Component, Snippet } from 'svelte';

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
	/** Cell renderer snippet — receives (row, columnKey, value). */
	cell?: Snippet<[Record<string, unknown>, string, unknown]>;
	/** Rendered instead of emptyMessage when there are no rows. */
	empty?: Snippet;
	class?: string;
};

declare const DataTable: Component<DataTableProps>;
export default DataTable;
