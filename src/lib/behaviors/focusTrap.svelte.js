/**
 * Svelte action: trap Tab/Shift+Tab focus inside `node`.
 *
 *   div(use:focusTrap)
 *
 * On mount, focuses the first focusable child (or the node itself if it's
 * tabbable). On destroy, returns focus to the previously focused element
 * outside the trap.
 *
 * Disable via tuple form:
 *   div(use:focusTrap={open})
 */
const FOCUSABLE = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
	'audio[controls]',
	'video[controls]',
	'[contenteditable]:not([contenteditable="false"])'
].join(',');

function focusable(node) {
	return Array.from(node.querySelectorAll(FOCUSABLE)).filter(
		(el) => !el.hasAttribute('disabled') && el.offsetParent !== null
	);
}

export function focusTrap(node, enabled = true) {
	let active = enabled !== false;
	const previouslyFocused = document.activeElement;

	const focusFirst = () => {
		const items = focusable(node);
		if (items.length > 0) {
			items[0].focus();
		} else {
			node.setAttribute('tabindex', '-1');
			node.focus();
		}
	};

	const onKeyDown = (e) => {
		if (!active || e.key !== 'Tab') return;
		const items = focusable(node);
		if (items.length === 0) {
			e.preventDefault();
			return;
		}
		const first = items[0];
		const last = items[items.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	if (active) {
		// Defer one frame so the node is actually in the DOM after portal moves.
		queueMicrotask(focusFirst);
	}
	node.addEventListener('keydown', onKeyDown);

	return {
		update(value) {
			active = value !== false;
		},
		destroy() {
			node.removeEventListener('keydown', onKeyDown);
			if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
				previouslyFocused.focus();
			}
		}
	};
}
