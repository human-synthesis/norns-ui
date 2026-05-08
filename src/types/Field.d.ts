import type { Component, Snippet } from 'svelte';

export type FieldProps = {
	/** Label text rendered above the control. Used as id-derivation fallback if no `id` is given. */
	label?: string;
	/** Helper text shown below the control when there's no error. */
	help?: string;
	/** Error message shown below the control. Switches the inner control to error styling via context. */
	error?: string;
	/** Adds a red asterisk after the label. Cosmetic; pair with `required` on the actual input. */
	required?: boolean;
	/** Explicit id for the control. Otherwise derived from `label`, otherwise undefined. */
	id?: string;
	/** Optional class merged into the field wrapper. */
	class?: string;
	/** Snippet that renders the actual control. Children should call `<Input />`, `<Textarea />`, etc. */
	children?: Snippet;
};

declare const Field: Component<FieldProps>;
export default Field;
