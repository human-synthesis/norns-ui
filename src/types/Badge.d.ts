import type { Component, Snippet } from 'svelte';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

export type BadgeProps = {
	variant?: BadgeVariant;
	size?: BadgeSize;
	children?: Snippet;
	class?: string;
};

declare const Badge: Component<BadgeProps>;
export default Badge;
