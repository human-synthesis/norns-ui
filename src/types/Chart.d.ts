import type { Component } from 'svelte';

export type ChartType = 'bar' | 'line' | 'area';

export type ChartProps = {
	/** Rows to plot — typically a generated Query result. */
	data?: Record<string, unknown>[];
	type?: ChartType;
	/** Field for the x axis / labels. Defaults to the first string field. */
	x?: string;
	/** Field for the y axis values. Defaults to the first numeric field. */
	y?: string;
	/** Accessible label for the rendered svg. */
	label?: string;
	/** Show per-point x labels under the plot. */
	labels?: boolean;
	class?: string;
};

declare const Chart: Component<ChartProps>;
export default Chart;
