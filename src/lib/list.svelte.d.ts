export interface ListQueryState {
	page: number;
	pageSize: number;
	sort?: string;
	dir: 'asc' | 'desc';
	q: string;
}

export type ListLoader<T> = (
	qs: string,
	query: ListQueryState
) => Promise<{ data?: T[]; total?: number } | T[] | null | undefined>;

export interface UseListOptions<T> {
	page?: number;
	pageSize?: number;
	sort?: string;
	dir?: 'asc' | 'desc';
	q?: string;
	/** Debounce every reload by this many milliseconds (useful when `q` is bound to an input). */
	debounce?: number;
	/** First page from a `load` function; no request is made until the query changes. */
	initial?: { data?: T[]; total?: number } | null;
}

export interface ListState<T> {
	readonly rows: T[];
	readonly total: number;
	readonly loading: boolean;
	readonly error: unknown;
	readonly pages: number;
	readonly params: string;
	page: number;
	pageSize: number;
	sort: string | undefined;
	dir: 'asc' | 'desc';
	q: string;
	refresh(): Promise<void>;
}

/**
 * Server-driven list state for DataTable + Pagination. Call during component
 * initialisation; every change to page / pageSize / sort / dir / q re-runs
 * `load` with a `listQuery()`-compatible query string.
 */
export function useList<T = Record<string, unknown>>(load: ListLoader<T>, opts?: UseListOptions<T>): ListState<T>;
