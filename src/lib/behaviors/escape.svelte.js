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
	document.addEventListener('keydown', onKeyDown);

	return {
		update(value) {
			set(value);
		},
		destroy() {
			document.removeEventListener('keydown', onKeyDown);
		}
	};
}
