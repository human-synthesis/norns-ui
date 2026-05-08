import type { Component } from 'svelte';

export type NumberInputProps = {
	value?: number;
	min?: number;
	max?: number;
	stepSize?: number;
	disabled?: boolean;
	readonly?: boolean;
	name?: string;
	id?: string;
	error?: boolean;
	class?: string;
};

declare const NumberInput: Component<NumberInputProps>;
export default NumberInput;
