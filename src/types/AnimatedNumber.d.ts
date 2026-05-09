import type { Component } from 'svelte';

export type AnimatedNumberProps = {
	value: number;
	from?: number;
	/** Duration in seconds. */
	duration?: number;
	decimals?: number;
	/** Custom number-to-string formatter. */
	format?: (n: number) => string;
	class?: string;
};

declare const AnimatedNumber: Component<AnimatedNumberProps>;
export default AnimatedNumber;
