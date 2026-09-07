import type { Component } from 'svelte';
import type { ComboboxItem, ComboboxSource } from './Autocomplete';

export type MultiSelectProps = {
	/** Local options, filtered client-side by label. Ignored when `source` is set. */
	items?: ComboboxItem[];
	/** Remote options: called (debounced) with the typed text while the list is open. Picked labels are remembered across searches. */
	source?: ComboboxSource;
	/** Milliseconds to wait after typing before calling `source`. Default 200. */
	debounce?: number;
	/** Minimum typed characters before `source` is called. Default 0. */
	minChars?: number;
	value?: string[];
	open?: boolean;
	placeholder?: string;
	emptyMessage?: string;
	loadingMessage?: string;
	disabled?: boolean;
	name?: string;
	id?: string;
	error?: boolean;
};

declare const MultiSelect: Component<MultiSelectProps>;
export default MultiSelect;
