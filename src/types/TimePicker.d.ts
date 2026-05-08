import type { Component } from 'svelte';

export type TimePickerProps = {
	/** Time string `HH:MM` (24h regardless of display `hourCycle`). Bindable. */
	value?: string;
	open?: boolean;
	/** Minute increment in the picker (5, 10, 15, 30). Default 5. */
	minuteStep?: number;
	hourCycle?: 12 | 24;
	placeholder?: string;
	disabled?: boolean;
	label?: string;
	name?: string;
	id?: string;
	error?: boolean;
	class?: string;
};

declare const TimePicker: Component<TimePickerProps>;
export default TimePicker;
