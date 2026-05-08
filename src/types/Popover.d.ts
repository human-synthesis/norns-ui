import type { Component, Snippet } from 'svelte';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';

export type PopoverProps = {
	open?: boolean;
	side?: PopoverSide;
	align?: PopoverAlign;
	sideOffset?: number;
	trigger?: Snippet;
	children?: Snippet;
	triggerClass?: string;
	class?: string;
};

declare const Popover: Component<PopoverProps>;
export default Popover;
