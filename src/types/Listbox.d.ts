import type { Component } from 'svelte';

export type ListboxItem =
	| string
	| { value: unknown; label?: string; disabled?: boolean };

export type ListboxProps = {
	items?: ListboxItem[];
	/** Selected value (array when `multiple`). Bindable. */
	value?: unknown;
	multiple?: boolean;
	disabled?: boolean;
	emptyMessage?: string;
	onchange?: (value: unknown) => void;
	class?: string;
};

declare const Listbox: Component<ListboxProps>;
export default Listbox;
