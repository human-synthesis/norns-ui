import type { Component, Snippet } from 'svelte';

export type ToggleButtonProps = {
	pressed?: boolean;
	disabled?: boolean;
	icon?: string;
	/** Any `.btn-*` variant. The toggle visual state is controlled by `data-pressed`. */
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
	size?: 'sm' | 'md' | 'lg';
	onpressedchange?: (pressed: boolean) => void;
	children?: Snippet;
	class?: string;
};

declare const ToggleButton: Component<ToggleButtonProps>;
export default ToggleButton;
