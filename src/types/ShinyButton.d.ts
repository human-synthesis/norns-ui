import type { Component, Snippet } from 'svelte';

export type ShinyButtonProps = {
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
	size?: 'sm' | 'md' | 'lg';
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	onclick?: (event: MouseEvent) => void;
	icon?: string;
	children?: Snippet;
	class?: string;
};

declare const ShinyButton: Component<ShinyButtonProps>;
export default ShinyButton;
