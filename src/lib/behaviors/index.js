/**
 * Public re-exports of the behavior actions used by the library's components.
 * Consumers can use these directly in their own components for consistency
 * with the library's interaction model.
 *
 *   import { portal, clickOutside, escape, focusTrap, useFloating } from '@human-synthesis/norns-ui/behaviors'
 */
export { portal } from './portal.svelte.js';
export { clickOutside } from './clickOutside.svelte.js';
export { escape } from './escape.svelte.js';
export { focusTrap } from './focusTrap.svelte.js';
export { lock as scrollLockAcquire, unlock as scrollLockRelease, scrollLock } from './scrollLock.svelte.js';
export { useFloating, positionAt } from './floating.svelte.js';
export { rovingTabindex } from './rovingTabindex.svelte.js';
