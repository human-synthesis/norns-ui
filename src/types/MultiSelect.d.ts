import type { Component } from 'svelte';
import type { ComboboxItem } from './Autocomplete';

export type MultiSelectProps = {
	items?: ComboboxItem[];
	value?: string[];
	open?: boolean;
	placeholder?: string;
	disabled?: boolean;
	name?: string;
	id?: string;
	error?: boolean;
};

declare const MultiSelect: Component<MultiSelectProps>;
export default MultiSelect;
