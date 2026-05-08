/**
 * Main barrel — re-exports user-facing components and helpers.
 *
 * Most consumption goes through auto-import (via the `presetUI()` factory in
 * `@human-synthesis/norns-ui/auto-import`). This barrel exists for users
 * who prefer explicit imports or who need to reach a component from JS
 * code that auto-import doesn't process (e.g. dynamic mount).
 */

// Phase 1
export { default as Btn } from './components/Btn.n';

// Phase 2 — forms tier
export { default as Checkbox } from './components/Checkbox.n';
export { default as Field } from './components/Field.n';
export { default as FieldGroup } from './components/FieldGroup.n';
export { default as Form } from './components/Form.n';
export { default as Input } from './components/Input.n';
export { default as Radio } from './components/Radio.n';
export { default as Select } from './components/Select.n';
export { default as Switch } from './components/Switch.n';
export { default as Textarea } from './components/Textarea.n';

// Helpers
export { cn } from './lib/cn.js';
export { variantClasses } from './lib/variants.js';
export { presetUI } from './auto-import.js';
