import type { Component, Snippet } from 'svelte';

export type PreviewCardProps = {
	href?: string;
	side?: 'top' | 'right' | 'bottom' | 'left';
	align?: 'start' | 'center' | 'end';
	sideOffset?: number;
	openDelay?: number;
	trigger?: Snippet;
	children?: Snippet;
	triggerClass?: string;
	class?: string;
};

declare const PreviewCard: Component<PreviewCardProps>;
export default PreviewCard;
