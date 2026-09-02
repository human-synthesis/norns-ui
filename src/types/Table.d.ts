import type { Component, Snippet } from 'svelte';
import type { DataTableColumn } from './DataTable.js';

export type TableColumn = DataTableColumn;

export type TableProps = {
	/** Rows to render — typically a generated Query result bound by a Page spec. */
	data?: Record<string, unknown>[];
	/**
	 * Columns: array of keys/column objects, or a comma-separated key string
	 * (the form spec literals arrive in). Defaults to the first row's keys.
	 */
	columns?: string | Array<string | TableColumn>;
	/** Client-side page size. 0 disables pagination. Accepts numeric strings. */
	pageSize?: number | string;
	striped?: boolean;
	dense?: boolean;
	stickyHeader?: boolean;
	emptyMessage?: string;
	onrowclick?: (row: Record<string, unknown>, index: number) => void;
	/** Cell renderer snippet — receives (row, columnKey, value). */
	cell?: Snippet<[Record<string, unknown>, string, unknown]>;
	/** Rendered instead of emptyMessage when there are no rows. */
	empty?: Snippet;
	class?: string;
};

declare const Table: Component<TableProps>;
export default Table;
