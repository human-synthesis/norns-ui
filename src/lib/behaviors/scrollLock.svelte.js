/**
 * Refcounted scroll lock for the document body. Multiple overlays may stack
 * (Dialog over Drawer over Popover); each acquires a lock and releases on
 * unmount. The body stays locked until the last release.
 *
 * Preserves the scroll position by setting `position: fixed; top: -<scrollY>`
 * and restoring it on full release.
 */
let count = 0;
let savedScrollY = 0;
let savedStyles = null;

export function lock() {
	if (count === 0 && typeof document !== 'undefined') {
		savedScrollY = window.scrollY;
		const body = document.body;
		savedStyles = {
			position: body.style.position,
			top: body.style.top,
			width: body.style.width,
			overflow: body.style.overflow
		};
		body.style.position = 'fixed';
		body.style.top = `-${savedScrollY}px`;
		body.style.width = '100%';
		body.style.overflow = 'hidden';
	}
	count++;
}

export function unlock() {
	if (count === 0) return;
	count--;
	if (count === 0 && savedStyles && typeof document !== 'undefined') {
		const body = document.body;
		body.style.position = savedStyles.position;
		body.style.top = savedStyles.top;
		body.style.width = savedStyles.width;
		body.style.overflow = savedStyles.overflow;
		window.scrollTo(0, savedScrollY);
		savedStyles = null;
	}
}

/**
 * Svelte action — locks while mounted, releases on destroy.
 *   div(use:scrollLock)
 */
export function scrollLock(_node) {
	lock();
	return {
		destroy() {
			unlock();
		}
	};
}
