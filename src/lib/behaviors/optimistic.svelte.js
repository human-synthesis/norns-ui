/**
 * Optimistic overlay: a client-side id → value map that shadows server truth
 * until the next reload. A user gesture (drag-drop, toggle) lands instantly
 * via `set`, while the bound action persists it in the background; `get`
 * answers the overlaid value and falls back to the server's. Extracted from
 * Kanban's drag-drop so other components can share the interaction model.
 */
export function optimisticOverlay() {
	let overlay = $state({});
	return {
		get(id, base) {
			return overlay[id] ?? base;
		},
		set(id, value) {
			overlay = { ...overlay, [id]: value };
		},
		clear() {
			overlay = {};
		},
		get size() {
			return Object.keys(overlay).length;
		}
	};
}
