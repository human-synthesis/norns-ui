import type { Component } from 'svelte';

export type TagsInputProps = {
	value?: string[];
	max?: number;
	placeholder?: string;
	commitOnBlur?: boolean;
	separators?: string[];
	disabled?: boolean;
	/** Form field name — rides a hidden input carrying the committed tags, comma-joined. */
	name?: string;
	id?: string;
	/** Accessible name for the tag-entry box when there is no visible label. */
	ariaLabel?: string;
	error?: boolean;
	class?: string;
};

declare const TagsInput: Component<TagsInputProps>;
export default TagsInput;
