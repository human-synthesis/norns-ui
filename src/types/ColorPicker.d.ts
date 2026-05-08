import type { Component } from 'svelte';

export type ColorPickerProps = {
	/** Hex value with leading `#`. Bindable. */
	value?: string;
	disabled?: boolean;
	/** Hide the clipboard-copy button. */
	hideCopy?: boolean;
	name?: string;
	id?: string;
	class?: string;
};

declare const ColorPicker: Component<ColorPickerProps>;
export default ColorPicker;
