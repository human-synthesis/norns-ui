import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputType =
	| 'text'
	| 'email'
	| 'password'
	| 'number'
	| 'tel'
	| 'url'
	| 'search'
	| 'date'
	| 'time'
	| 'datetime-local'
	| 'month'
	| 'week';

export type InputProps = Omit<HTMLInputAttributes, 'class' | 'type' | 'size' | 'value'> & {
	value?: string | number;
	type?: InputType;
	size?: InputSize;
	/** Force the error styling regardless of the parent Field's error state. */
	error?: boolean;
	class?: string;
};

declare const Input: Component<InputProps>;
export default Input;
