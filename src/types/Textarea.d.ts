import type { Component } from 'svelte';
import type { HTMLTextareaAttributes } from 'svelte/elements';

export type TextareaProps = Omit<HTMLTextareaAttributes, 'class' | 'value' | 'rows'> & {
	value?: string;
	rows?: number;
	error?: boolean;
	class?: string;
};

declare const Textarea: Component<TextareaProps>;
export default Textarea;
