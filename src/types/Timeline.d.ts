import type { Component } from 'svelte';

export type TimelineItem = {
	time?: string;
	title?: string;
	description?: string;
	icon?: string;
	variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
};

export type TimelineProps = {
	items?: TimelineItem[];
	/** Alias for `items` — the prop a generated Page binds a Query result to. */
	data?: TimelineItem[];
	class?: string;
};

declare const Timeline: Component<TimelineProps>;
export default Timeline;
