/**
 * Keyboard navigation for menu/tab/listbox patterns.
 *
 * Attach to a container; the action queries focusable items via `selector`
 * (default `[data-roving]`) and routes ArrowDown/Up/Home/End between them.
 * Items get `tabindex=-1` except the active one (`tabindex=0`).
 *
 *   ul(use:rovingTabindex={{ orientation: 'vertical', selector: '[data-item]' }})
 *
 * Use `orientation: 'horizontal'` for ArrowLeft/Right (Tabs).
 * Pass `loop: true` to wrap around at the ends.
 */
export function rovingTabindex(node, opts = {}) {
	let { orientation = 'vertical', selector = '[data-roving]', loop = true } = opts;
	const isVertical = () => orientation === 'vertical';
	const isHorizontal = () => orientation === 'horizontal';

	const items = () => Array.from(node.querySelectorAll(selector)).filter((el) => !el.disabled);

	const setTabindex = () => {
		const list = items();
		if (list.length === 0) return;
		const activeIdx = list.indexOf(document.activeElement);
		list.forEach((el, i) => {
			el.setAttribute('tabindex', i === Math.max(0, activeIdx) ? '0' : '-1');
		});
	};

	const move = (delta) => {
		const list = items();
		if (list.length === 0) return;
		const cur = list.indexOf(document.activeElement);
		let next = cur + delta;
		if (next < 0) next = loop ? list.length - 1 : 0;
		if (next >= list.length) next = loop ? 0 : list.length - 1;
		list[next].focus();
	};

	const onKeyDown = (e) => {
		const { key } = e;
		if (isVertical() && (key === 'ArrowDown' || key === 'ArrowUp')) {
			e.preventDefault();
			move(key === 'ArrowDown' ? 1 : -1);
		} else if (isHorizontal() && (key === 'ArrowRight' || key === 'ArrowLeft')) {
			e.preventDefault();
			move(key === 'ArrowRight' ? 1 : -1);
		} else if (key === 'Home') {
			e.preventDefault();
			items()[0]?.focus();
		} else if (key === 'End') {
			e.preventDefault();
			const list = items();
			list[list.length - 1]?.focus();
		}
	};

	const onFocusIn = () => setTabindex();

	node.addEventListener('keydown', onKeyDown);
	node.addEventListener('focusin', onFocusIn);
	queueMicrotask(setTabindex);

	return {
		update(next) {
			if (next) {
				orientation = next.orientation ?? orientation;
				selector = next.selector ?? selector;
				loop = next.loop ?? loop;
			}
		},
		destroy() {
			node.removeEventListener('keydown', onKeyDown);
			node.removeEventListener('focusin', onFocusIn);
		}
	};
}
