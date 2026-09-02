import type { Component, Snippet } from 'svelte';
import type { HTMLSelectAttributes } from 'svelte/elements';

export type SelectProps = Omit<HTMLSelectAttributes, 'class' | 'value' | 'children'> & {
	value?: string | number | string[];
	name?: string;
	id?: string;
	required?: boolean;
	disabled?: boolean;
	error?: boolean;
	class?: string;
	/** `<option>` children. Pass via Pug body. */
	children?: Snippet;
};

declare const Select: Component<SelectProps>;
export default Select;
