import type { Component, Snippet } from 'svelte';

export type RichTooltipProps = {
	side?: 'top' | 'right' | 'bottom' | 'left';
	align?: 'start' | 'center' | 'end';
	sideOffset?: number;
	openDelay?: number;
	closeDelay?: number;
	trigger?: Snippet;
	children?: Snippet;
	triggerClass?: string;
	class?: string;
};

declare const RichTooltip: Component<RichTooltipProps>;
export default RichTooltip;
