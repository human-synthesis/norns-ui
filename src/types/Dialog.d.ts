import type { Component, Snippet } from 'svelte';

export type DialogProps = {
	open?: boolean;
	title?: string;
	description?: string;
	hideClose?: boolean;
	/** Close on a click outside the dialog and on Escape. Default true. */
	dismissable?: boolean;
	/** Used as `aria-label` on the dialog when no `title` is provided. */
	ariaLabel?: string;
	trigger?: Snippet;
	actions?: Snippet;
	children?: Snippet;
	triggerClass?: string;
	class?: string;
};

declare const Dialog: Component<DialogProps>;
export default Dialog;
