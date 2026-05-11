import type { Component, Snippet } from 'svelte';

export type TooltipProps = {
	content?: string;
	side?: 'top' | 'right' | 'bottom' | 'left';
	align?: 'start' | 'center' | 'end';
	sideOffset?: number;
	delay?: number;
	/** Wider, surface-elevated styling for tooltips with markup/multiline content. */
	rich?: boolean;
	trigger?: Snippet;
	children?: Snippet;
	triggerClass?: string;
	class?: string;
};

declare const Tooltip: Component<TooltipProps>;
export default Tooltip;
