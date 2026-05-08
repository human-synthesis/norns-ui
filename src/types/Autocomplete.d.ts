import type { Component } from 'svelte';

export type ComboboxItem = { value: string; label: string };

export type AutocompleteProps = {
	items?: ComboboxItem[];
	value?: string;
	open?: boolean;
	placeholder?: string;
	disabled?: boolean;
	name?: string;
	id?: string;
	error?: boolean;
};

declare const Autocomplete: Component<AutocompleteProps>;
export default Autocomplete;
