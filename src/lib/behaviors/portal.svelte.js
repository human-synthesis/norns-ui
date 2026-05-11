/**
 * Svelte action: move a node out of its DOM parent into a target element
 * (default: <body>) for the lifetime of the action. Used by overlays
 * (Dialog, Sheet, Popover, Dropdown, Tooltip) so they're not constrained
 * by parent `overflow` or `transform` stacking contexts.
 *
 * Usage in Pug + Civet:
 *   div(use:portal class!="dialog-content")
 *
 * Cleanup note: `destroy` only removes the moved node + the placeholder
 * comment we inserted. It does NOT attempt to move the node back into the
 * original tree. Svelte already iterates its own tracked DOM (and finds
 * the moved node by reference) when the branch unmounts; if we re-inserted
 * the node here, Svelte would leave it in place because it had already
 * "removed" it via the body reference — the overlay would stay visible.
 *
 * @param {HTMLElement} node
 * @param {HTMLElement | string} [target]
 */
export function portal(node, target = document.body) {
	const dest = typeof target === 'string' ? document.querySelector(target) : target;
	if (!dest) return {};
	const placeholder = document.createComment('portal');
	node.parentNode?.replaceChild(placeholder, node);
	dest.appendChild(node);
	return {
		destroy() {
			node.parentNode?.removeChild(node);
			placeholder.parentNode?.removeChild(placeholder);
		}
	};
}
