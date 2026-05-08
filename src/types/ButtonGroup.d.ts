import type { Component, Snippet } from 'svelte';

export type ButtonGroupProps = {
	orientation?: 'horizontal' | 'vertical';
	children?: Snippet;
	class?: string;
};

declare const ButtonGroup: Component<ButtonGroupProps>;
export default ButtonGroup;
