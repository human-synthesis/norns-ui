import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

export type CheckboxProps = Omit<HTMLInputAttributes, 'class' | 'type' | 'checked'> & {
	checked?: boolean;
	error?: boolean;
	class?: string;
};

declare const Checkbox: Component<CheckboxProps>;
export default Checkbox;
