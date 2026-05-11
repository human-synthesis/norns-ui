/**
 * Svelte action: invoke `handler` when a pointerdown occurs outside `node`.
 *
 *   div(use:clickOutside={onClose})
 *   div(use:clickOutside={[onClose, open]})
 *   div(use:clickOutside={[onClose, open, triggerEl]})
 *
 * Three parameter shapes:
 *   - `handler` alone
 *   - `[handler, enabled]` — pass the open flag so the action no-ops while closed
 *   - `[handler, enabled, ignore]` — `ignore` is an element (or array of elements)
 *     whose subtree also counts as "inside." Use this to exclude the trigger
 *     button so clicking it doesn't close-then-reopen the overlay.
 *
 * Listens on `pointerdown` (capture) so it fires before inner handlers get
 * a chance to stop propagation.
 */
export function clickOutside(node, paramOrHandler) {
	let handler;
	let enabled = true;
	let ignoreEls = [];
	const set = (value) => {
		if (Array.isArray(value)) {
			handler = value[0];
			enabled = value[1] !== false;
			const ig = value[2];
			ignoreEls = ig == null ? [] : Array.isArray(ig) ? ig : [ig];
		} else {
			handler = value;
			enabled = true;
			ignoreEls = [];
		}
	};
	set(paramOrHandler);

	const onPointerDown = (e) => {
		if (!enabled || !handler) return;
		if (node.contains(e.target)) return;
		for (const el of ignoreEls) {
			if (el && typeof el.contains === 'function' && el.contains(e.target)) return;
		}
		handler(e);
	};
	document.addEventListener('pointerdown', onPointerDown, true);

	return {
		update(value) {
			set(value);
		},
		destroy() {
			document.removeEventListener('pointerdown', onPointerDown, true);
		}
	};
}
