/**
 * Toast store + helpers. Single in-process queue, mounted once via
 * <ToastProvider>. `toast(msg)` pushes from anywhere — server actions,
 * client effects, button handlers.
 */

let nextId = 0;

export const toastStore = $state({ items: [] });

/**
 * Push a toast. Returns the toast id so the caller can dismiss early.
 *
 * @param {string} message
 * @param {{ variant?: 'info' | 'success' | 'warning' | 'error', duration?: number }} [opts]
 *   `duration` in ms, default 4000. Set to 0 for sticky.
 */
export function toast(message, opts = {}) {
	const id = ++nextId;
	const item = {
		id,
		message,
		variant: opts.variant ?? 'info',
		duration: opts.duration ?? 4000
	};
	toastStore.items.push(item);
	if (item.duration > 0) {
		setTimeout(() => dismiss(id), item.duration);
	}
	return id;
}

export const notify = toast;

export function dismiss(id) {
	const i = toastStore.items.findIndex((t) => t.id === id);
	if (i >= 0) toastStore.items.splice(i, 1);
}

export function clear() {
	toastStore.items.length = 0;
}
