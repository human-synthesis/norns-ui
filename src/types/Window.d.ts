import type { Component, Snippet } from 'svelte';

export type WindowProps = {
	title?: string;
	hideHeader?: boolean;
	/** Renders the header close button when supplied. */
	onClose?: (event: MouseEvent) => void;
	onHeaderDoubleClick?: (event: MouseEvent) => void;
	/** Extra header actions, rendered before the close button. */
	actions?: Snippet;
	children?: Snippet;
	class?: string;
	bodyClass?: string;
};

declare const Window: Component<WindowProps>;
export default Window;
