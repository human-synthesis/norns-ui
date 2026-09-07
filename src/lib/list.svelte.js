/**
 * Server-driven list state for DataTable + Pagination (+ a search box).
 *
 * The component owns the page / sort / search state; the server owns the
 * data. Every state change re-runs `load` with the query string a norns
 * `listQuery()` route understands, and the `{ data, total }` envelope from
 * `listResult()` lands in `rows` / `total`.
 *
 *   import { useList } from '@human-synthesis/norns-ui/list'
 *   api := createApi { schemas: [noteWire] }
 *   list := useList (qs) => api.get(`/api/notes?${qs}`), { sort: 'updated_at', dir: 'desc' }
 *
 *   Input(bind:value!="{list.q}")
 *   DataTable(rows!="{list.rows}" bind:sortKey!="{list.sort}" bind:sortDir!="{list.dir}" loading!="{list.loading}")
 *   Pagination(bind:page!="{list.page}" total!="{list.total}" pageSize!="{list.pageSize}")
 *
 * Call it during component initialisation (it registers a `$effect`). With
 * `initial` (data from a `load` function) the first render is SSR-complete
 * and no request is made until something changes. In-flight responses that
 * arrive out of order are dropped.
 *
 * @template T
 * @param {(qs: string, query: { page: number, pageSize: number, sort?: string, dir: 'asc' | 'desc', q: string }) => Promise<{ data?: T[], total?: number } | T[] | null | undefined>} load
 * @param {{
 *   page?: number,
 *   pageSize?: number,
 *   sort?: string,
 *   dir?: 'asc' | 'desc',
 *   q?: string,
 *   debounce?: number,
 *   initial?: { data?: T[], total?: number } | null
 * }} [opts]
 */
export function useList(load, opts = {}) {
	if (typeof load !== 'function') throw new Error('useList(load): `load` must be a function');

	const state = $state({
		page: opts.page ?? 1,
		pageSize: opts.pageSize ?? 20,
		sort: opts.sort,
		dir: opts.dir ?? 'asc',
		q: opts.q ?? '',
		rows: /** @type {T[]} */ (opts.initial?.data ?? []),
		total: opts.initial?.total ?? opts.initial?.data?.length ?? 0,
		loading: false,
		error: /** @type {unknown} */ (null)
	});

	let seq = 0;
	let skipFirst = opts.initial != null;
	const debounce = opts.debounce ?? 0;

	function snapshot() {
		return { page: state.page, pageSize: state.pageSize, sort: state.sort, dir: state.dir, q: state.q };
	}

	function params(query = snapshot()) {
		const p = new URLSearchParams();
		p.set('page', String(query.page));
		p.set('pageSize', String(query.pageSize));
		if (query.sort) {
			p.set('sort', query.sort);
			p.set('dir', query.dir);
		}
		if (query.q) p.set('q', query.q);
		return p.toString();
	}

	async function refresh() {
		const id = ++seq;
		const query = snapshot();
		state.loading = true;
		state.error = null;
		try {
			const res = await load(params(query), query);
			if (id !== seq) return;
			const rows = Array.isArray(res) ? res : (res?.data ?? []);
			state.rows = rows;
			state.total = Array.isArray(res) ? rows.length : (res?.total ?? rows.length);
		} catch (e) {
			if (id !== seq) return;
			state.error = e;
		} finally {
			if (id === seq) state.loading = false;
		}
	}

	$effect(() => {
		// Reading through params() subscribes to every query field.
		params();
		if (skipFirst) {
			skipFirst = false;
			return;
		}
		if (debounce > 0) {
			const timer = setTimeout(refresh, debounce);
			return () => clearTimeout(timer);
		}
		refresh();
	});

	return {
		get rows() { return state.rows; },
		get total() { return state.total; },
		get loading() { return state.loading; },
		get error() { return state.error; },
		get pages() { return Math.max(1, Math.ceil(state.total / state.pageSize)); },
		/** The query string as sent to `load` (useful for links / debugging). */
		get params() { return params(); },

		get page() { return state.page; },
		set page(v) { state.page = Math.max(1, Number(v) || 1); },

		get pageSize() { return state.pageSize; },
		set pageSize(v) {
			const n = Math.max(1, Number(v) || 1);
			if (n === state.pageSize) return;
			state.pageSize = n;
			state.page = 1;
		},

		get sort() { return state.sort; },
		set sort(v) {
			if (v === state.sort) return;
			state.sort = v;
			state.page = 1;
		},

		get dir() { return state.dir; },
		set dir(v) { state.dir = v === 'desc' ? 'desc' : 'asc'; },

		get q() { return state.q; },
		set q(v) {
			const s = String(v ?? '');
			if (s === state.q) return;
			state.q = s;
			state.page = 1;
		},

		/** Re-run `load` with the current query (e.g. after a mutation). */
		refresh
	};
}
