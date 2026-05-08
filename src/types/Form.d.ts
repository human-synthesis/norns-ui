import type { Component, Snippet } from 'svelte';
import type { HTMLFormAttributes } from 'svelte/elements';

/**
 * The shape returned by `fail(400, { errors, values })` from a SvelteKit
 * action — what `+page.server.c`'s `page.actions` produces on validation
 * failure (or a manually-constructed equivalent). `errors` is a valibot
 * issue list; `values` is the raw form data echoed back for re-rendering.
 */
export type FormActionResult = {
	errors?: Array<{ path?: Array<{ key?: string }>; message: string }>;
	values?: Record<string, string>;
} | null | undefined;

export type FormProps = Omit<HTMLFormAttributes, 'class' | 'children'> & {
	method?: 'GET' | 'POST';
	action?: string;
	enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
	/**
	 * Pass the page's `form` prop here. Form derives a `name → message` errors
	 * map and exposes it via context so descendant `<Field name="...">` looks
	 * up its own error automatically.
	 */
	form?: FormActionResult;
	class?: string;
	children?: Snippet;
};

declare const Form: Component<FormProps>;
export default Form;
