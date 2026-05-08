import type { Component } from 'svelte';

export type DatePickerProps = {
	/** ISO date string (YYYY-MM-DD). Bindable. */
	value?: string;
	min?: string;
	max?: string;
	disabled?: boolean;
	readonly?: boolean;
	required?: boolean;
	name?: string;
	id?: string;
	error?: boolean;
	class?: string;
};

declare const DatePicker: Component<DatePickerProps>;
export default DatePicker;
