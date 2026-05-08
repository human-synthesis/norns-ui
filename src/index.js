/**
 * Main barrel — re-exports user-facing components and helpers.
 *
 * Most consumption goes through auto-import (via the `presetUI()` factory in
 * `@human-synthesis/norns-ui/auto-import`). This barrel exists for users
 * who prefer explicit imports or who need to reach a component from JS
 * code that auto-import doesn't process (e.g. dynamic mount).
 */

export { default as Btn } from './components/Btn.n';
export { cn } from './lib/cn.js';
export { variantClasses } from './lib/variants.js';
export { presetUI } from './auto-import.js';
