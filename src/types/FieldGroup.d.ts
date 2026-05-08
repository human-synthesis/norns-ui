import type { Component, Snippet } from 'svelte';

export type FieldGroupProps = {
	/** Optional legend text rendered as the fieldset's `<legend>`. */
	legend?: string;
	class?: string;
	children?: Snippet;
};

declare const FieldGroup: Component<FieldGroupProps>;
export default FieldGroup;
