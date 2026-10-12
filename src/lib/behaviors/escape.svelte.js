/**
 * Svelte action: invoke `handler` on Escape keydown while the action is
 * mounted. Honors disabled state via the second-tuple parameter form:
 *
 *   div(use:escape={[onClose, open]})
 */
export function escape(node, paramOrHandler) {
	let handler;
	let enabled = true;
	const set = (value) => {
		if (Array.isArray(value)) {
			handler = value[0];
			enabled = value[1] !== false;
		} else {
			handler = value;
			enabled = true;
		}
	};
	set(paramOrHandler);

	const onKeyDown = (e) => {
		if (!enabled || !handler) return;
		if (e.key !== 'Escape') return;
		handler(e);
	};
	let attached = false;
	const sync = () => {
		const want = enabled && !!handler;
		if (want === attached) return;
		attached = want;
		if (want) document.addEventListener('keydown', onKeyDown);
		else document.removeEventListener('keydown', onKeyDown);
	};
	sync();

	return {
		update(value) {
			set(value);
			sync();
		},
		destroy() {
			enabled = false;
			sync();
		}
	};
}
