import type { Component, Snippet } from 'svelte';

export type CopyButtonProps = {
	value?: string | number;
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
	size?: 'sm' | 'md' | 'lg';
	icon?: string;
	disabled?: boolean;
	label?: string;
	oncopy?: (value: string | number) => void;
	children?: Snippet;
	class?: string;
};

declare const CopyButton: Component<CopyButtonProps>;
export default CopyButton;
