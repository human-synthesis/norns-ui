import type { Component } from 'svelte';

export type DateRange = { start: string; end: string };

export type DateRangePickerProps = {
	value?: DateRange;
	min?: string;
	max?: string;
	disabled?: boolean;
	required?: boolean;
	/** Form name. The two inputs serialize as `${name}_start` and `${name}_end`. */
	name?: string;
	class?: string;
};

declare const DateRangePicker: Component<DateRangePickerProps>;
export default DateRangePicker;
