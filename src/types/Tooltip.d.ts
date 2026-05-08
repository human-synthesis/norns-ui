import type { Component, Snippet } from 'svelte';

export type TooltipProps = {
	content?: string;
	side?: 'top' | 'right' | 'bottom' | 'left';
	sideOffset?: number;
	delay?: number;
	trigger?: Snippet;
	children?: Snippet;
	triggerClass?: string;
	class?: string;
};

declare const Tooltip: Component<TooltipProps>;
export default Tooltip;
