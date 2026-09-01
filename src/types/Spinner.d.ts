import type { Component } from 'svelte';

export type SpinnerProps = {
	/** Tailwind size utility for the spinner glyph. */
	size?: string;
	/** Accessible label announced to screen readers. */
	label?: string;
	class?: string;
};

declare const Spinner: Component<SpinnerProps>;
export default Spinner;
