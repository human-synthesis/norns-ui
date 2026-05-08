import type { Component, Snippet } from 'svelte';
import type { HTMLFormAttributes } from 'svelte/elements';

export type FormProps = Omit<HTMLFormAttributes, 'class' | 'children'> & {
	method?: 'GET' | 'POST';
	action?: string;
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
	class?: string;
	children?: Snippet;
};

declare const Form: Component<FormProps>;
export default Form;
