import type { Component } from 'svelte';

export type DateRange = { start: string; end: string };

export type DateRangePickerProps = {
	value?: DateRange;
	/** Whether the popover is open. Bindable. */
	open?: boolean;
	min?: string;
	max?: string;
	placeholder?: string;
	disabled?: boolean;
	class?: string;
};

declare const DateRangePicker: Component<DateRangePickerProps>;
export default DateRangePicker;
