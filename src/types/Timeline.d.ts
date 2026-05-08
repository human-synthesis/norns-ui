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
	class?: string;
};

declare const Timeline: Component<TimelineProps>;
export default Timeline;
