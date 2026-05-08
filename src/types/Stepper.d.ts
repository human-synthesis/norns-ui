import type { Component } from 'svelte';

export type StepperStep = {
	id?: string;
	label: string;
	complete?: boolean;
	current?: boolean;
};

export type StepperProps = {
	steps?: StepperStep[];
	/** Index of the active step. Steps before are auto-marked complete unless overridden. */
	current?: number;
	orientation?: 'horizontal' | 'vertical';
	class?: string;
};

declare const Stepper: Component<StepperProps>;
export default Stepper;
