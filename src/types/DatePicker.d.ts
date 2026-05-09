import type { Component } from 'svelte';

export type DatePickerProps = {
	/** ISO date string (YYYY-MM-DD). Bindable. */
	value?: string;
	/** Whether the popover is open. Bindable. */
	open?: boolean;
	min?: string;
	max?: string;
	placeholder?: string;
	disabled?: boolean;
	/** Close the popover automatically once a date is picked (default true). */
	closeOnSelect?: boolean;
	/** aria-label override; defaults to "Pick a date". */
	label?: string;
	name?: string;
	id?: string;
	error?: boolean;
	class?: string;
};

declare const DatePicker: Component<DatePickerProps>;
export default DatePicker;
