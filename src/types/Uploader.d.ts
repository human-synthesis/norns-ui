import type { Component } from 'svelte';

export type UploaderProps = {
	files?: File[];
	multiple?: boolean;
	accept?: string;
	disabled?: boolean;
	placeholder?: string;
	helper?: string;
	onchange?: (files: File[]) => void;
	class?: string;
};

declare const Uploader: Component<UploaderProps>;
export default Uploader;
