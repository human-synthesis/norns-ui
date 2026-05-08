import type { Component } from 'svelte';

export type CalendarDateRange = { start: string; end: string };

export type CalendarProps = {
	/** ISO YYYY-MM-DD. Bindable. */
	value?: string;
	/** Range mode. Bindable. Use instead of `value` when `range` is true. */
	rangeValue?: CalendarDateRange;
	range?: boolean;
	/** ISO YYYY-MM-DD inclusive. */
	min?: string;
	max?: string;
	label?: string;
	onchange?: (next: string | CalendarDateRange) => void;
	class?: string;
};

declare const Calendar: Component<CalendarProps>;
export default Calendar;
