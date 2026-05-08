/**
 * Type shim for `Btn.n`. Hand-rolled until we have a proper
 * `svelte-package` build over the Civet+Pug source.
 */

import type { Component, Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type BtnSize = 'sm' | 'md' | 'lg';

export type BtnProps = Omit<HTMLButtonAttributes, 'class' | 'children'> & {
	variant?: BtnVariant;
	size?: BtnSize;
	loading?: boolean;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
	class?: string;
	children?: Snippet;
	leading?: Snippet;
	trailing?: Snippet;
};

declare const Btn: Component<BtnProps>;
export default Btn;
