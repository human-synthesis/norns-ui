/**
 * Floating-element positioning, built on `@floating-ui/dom`.
 *
 *   import { useFloating } from '$lib/behaviors/floating.svelte.js'
 *
 *   floating := useFloating
 *     placement: 'bottom-start'
 *     offset: 8
 *
 *   ...
 *   div(use:floating.reference)
 *   div(use:floating.floating)
 *
 * The action sets `position: absolute` + `left`/`top` on the floating
 * element, plus a `data-placement` attribute reflecting the actually-used
 * placement after collision flips.
 *
 * Imperative `update()` is exposed too — call it after content size changes.
 */
import { computePosition, flip, shift, offset as offsetMiddleware, autoUpdate, size } from '@floating-ui/dom';

/**
 * @param {object} [opts]
 * @param {import('@floating-ui/dom').Placement} [opts.placement] — e.g. 'bottom-start'
 * @param {number} [opts.offset] — gap from reference, in px
 * @param {number} [opts.padding] — viewport padding for collision
 * @param {boolean} [opts.matchWidth] — match floating's min-width to reference width
 * @param {boolean} [opts.flip] — enable collision flip (default true)
 */
export function useFloating(opts = {}) {
	const {
		placement = 'bottom',
		offset: gap = 8,
		padding = 8,
		matchWidth = false,
		flip: flipOnCollision = true
	} = opts;

	let referenceEl = null;
	let floatingEl = null;
	let cleanupAutoUpdate = null;

	const middleware = [offsetMiddleware(gap)];
	if (flipOnCollision) middleware.push(flip({ padding }));
	middleware.push(shift({ padding }));
	if (matchWidth) {
		middleware.push(
			size({
				apply({ rects, elements }) {
					Object.assign(elements.floating.style, {
						minWidth: `${rects.reference.width}px`
					});
				}
			})
		);
	}

	async function update() {
		if (!referenceEl || !floatingEl) return;
		const { x, y, placement: actualPlacement } = await computePosition(referenceEl, floatingEl, {
			placement,
			middleware,
			strategy: 'absolute'
		});
		Object.assign(floatingEl.style, {
			position: 'absolute',
			left: `${x}px`,
			top: `${y}px`
		});
		floatingEl.setAttribute('data-placement', actualPlacement);
	}

	function bind() {
		if (cleanupAutoUpdate) cleanupAutoUpdate();
		if (referenceEl && floatingEl) {
			cleanupAutoUpdate = autoUpdate(referenceEl, floatingEl, update);
		}
	}

	const reference = (node) => {
		referenceEl = node;
		bind();
		return {
			destroy() {
				if (referenceEl === node) referenceEl = null;
				if (cleanupAutoUpdate) cleanupAutoUpdate();
				cleanupAutoUpdate = null;
			}
		};
	};

	const floating = (node) => {
		floatingEl = node;
		bind();
		return {
			destroy() {
				if (floatingEl === node) floatingEl = null;
				if (cleanupAutoUpdate) cleanupAutoUpdate();
				cleanupAutoUpdate = null;
			}
		};
	};

	return { reference, floating, update };
}

/**
 * Position a floating element relative to an arbitrary `{ x, y }` virtual
 * reference (e.g. a right-click position for a context menu).
 */
export function positionAt(floatingEl, x, y, opts = {}) {
	const virtual = {
		getBoundingClientRect: () => ({
			x,
			y,
			width: 0,
			height: 0,
			left: x,
			top: y,
			right: x,
			bottom: y
		})
	};
	const { placement = 'right-start', offset: gap = 0, padding = 8 } = opts;
	return computePosition(virtual, floatingEl, {
		placement,
		middleware: [offsetMiddleware(gap), flip({ padding }), shift({ padding })],
		strategy: 'absolute'
	}).then(({ x: fx, y: fy, placement: p }) => {
		Object.assign(floatingEl.style, {
			position: 'absolute',
			left: `${fx}px`,
			top: `${fy}px`
		});
		floatingEl.setAttribute('data-placement', p);
	});
}
