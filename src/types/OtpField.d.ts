import type { Component } from 'svelte';

export type OtpFieldProps = {
	value?: string;
	length?: number;
	mask?: boolean;
	label?: string;
	oncomplete?: (value: string) => void;
	class?: string;
};

declare const OtpField: Component<OtpFieldProps>;
export default OtpField;
