import type { Component, Snippet } from 'svelte';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

export type SheetProps = {
	open?: boolean;
	side?: SheetSide;
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

declare const Sheet: Component<SheetProps>;
export default Sheet;
