import type { Component, Snippet } from 'svelte';

export type WindowProps = {
	/** Header title (truncated). */
	title?: string;
	/** Remove the whole header bar; keeps the rounded shell. */
	hideHeader?: boolean;
	/** When set, renders a `lucide:x` close button (marked `.nodrag`). */
	onClose?: () => void;
	/** Fires on double-click over the header bar (e.g. maximise). */
	onHeaderDoubleClick?: (event: MouseEvent) => void;
	/** Extra header controls, rendered before the close button. */
	actions?: Snippet;
	children?: Snippet;
	/** Classes for the outer shell — pass dimensions here (`w-[520px] h-[380px]`). */
	class?: string;
	/** Classes for the body section. */
	bodyClass?: string;
};

declare const Window: Component<WindowProps>;
export default Window;
