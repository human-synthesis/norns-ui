import type { Component, Snippet } from 'svelte';

export type AccordionItem = {
	value: string;
	title: string;
	content?: Snippet;
};

export type AccordionProps = {
	items?: AccordionItem[];
	multiple?: boolean;
	value?: string | string[];
	class?: string;
};

declare const Accordion: Component<AccordionProps>;
export default Accordion;
