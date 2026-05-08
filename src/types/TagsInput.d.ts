import type { Component } from 'svelte';

export type TagsInputProps = {
	value?: string[];
	max?: number;
	placeholder?: string;
	commitOnBlur?: boolean;
	separators?: string[];
	disabled?: boolean;
	name?: string;
	id?: string;
	error?: boolean;
	class?: string;
};

declare const TagsInput: Component<TagsInputProps>;
export default TagsInput;
