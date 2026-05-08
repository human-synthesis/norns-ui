import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

export type RadioProps = Omit<HTMLInputAttributes, 'class' | 'type'> & {
	/** Two-way bound shared group value — pass `bind:group={selected}` from parent. */
	group?: string;
	value?: string;
	error?: boolean;
	class?: string;
};

declare const Radio: Component<RadioProps>;
export default Radio;
