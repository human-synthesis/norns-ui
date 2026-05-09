import type { Component, Snippet } from 'svelte';

export type LiquidButtonProps = {
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
	size?: 'sm' | 'md' | 'lg';
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	onclick?: (event: MouseEvent) => void;
	icon?: string;
	children?: Snippet;
	class?: string;
};

declare const LiquidButton: Component<LiquidButtonProps>;
export default LiquidButton;
