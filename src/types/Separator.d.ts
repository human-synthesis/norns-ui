import type { Component } from 'svelte';

export type SeparatorProps = {
	orientation?: 'horizontal' | 'vertical';
	class?: string;
};

declare const Separator: Component<SeparatorProps>;
export default Separator;
