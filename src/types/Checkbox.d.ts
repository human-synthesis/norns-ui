import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

export type CheckboxProps = Omit<HTMLInputAttributes, 'class' | 'type' | 'checked'> & {
	checked?: boolean;
	value?: string;
	name?: string;
	id?: string;
	required?: boolean;
	disabled?: boolean;
	error?: boolean;
	class?: string;
};

declare const Checkbox: Component<CheckboxProps>;
export default Checkbox;
