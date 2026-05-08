import type { Component, Snippet } from 'svelte';

export type ChipProps = {
	icon?: string;
	removable?: boolean;
	onremove?: (event: MouseEvent) => void;
	children?: Snippet;
	class?: string;
};

declare const Chip: Component<ChipProps>;
export default Chip;
