import type { Component, Snippet } from 'svelte';

export type DialogProps = {
	open?: boolean;
	title?: string;
	description?: string;
	hideClose?: boolean;
	trigger?: Snippet;
	actions?: Snippet;
	children?: Snippet;
	triggerClass?: string;
	overlayClass?: string;
	class?: string;
};

declare const Dialog: Component<DialogProps>;
export default Dialog;
