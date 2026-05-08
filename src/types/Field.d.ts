import type { Component, Snippet } from 'svelte';

export type FieldProps = {
	/** Label text rendered above the control. Used as id-derivation fallback if no `id`/`name` is given. */
	label?: string;
	/** Helper text shown below the control when there's no error. */
	help?: string;
	/**
	 * Explicit error message. Overrides any auto-resolved error from the
	 * parent `<Form form={...}>` context. Switches the inner control to
	 * error styling.
	 */
	error?: string;
	/**
	 * Field name — used to look up an auto-error from the parent `<Form>`
	 * context (matching `form.errors[*].path[0].key`) and as the default
	 * id for the inner control. When set, an inner `<Input>` doesn't need
	 * an explicit `name=` either if it inherits from this Field.
	 */
	name?: string;
	/** Adds a red asterisk after the label. Cosmetic; pair with `required` on the actual input. */
	required?: boolean;
	/** Explicit id for the control. Otherwise: `name`, then slugified `label`, then undefined. */
	id?: string;
	/** Optional class merged into the field wrapper. */
	class?: string;
	/** Snippet that renders the actual control. Children should call `<Input />`, `<Textarea />`, etc. */
	children?: Snippet;
};

declare const Field: Component<FieldProps>;
export default Field;
