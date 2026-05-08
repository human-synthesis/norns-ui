import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

export type SwitchProps = Omit<HTMLInputAttributes, 'class' | 'type' | 'checked' | 'role'> & {
	checked?: boolean;
	error?: boolean;
	class?: string;
};

declare const Switch: Component<SwitchProps>;
export default Switch;
