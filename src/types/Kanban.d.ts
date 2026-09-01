import type { Component } from 'svelte';

export type KanbanCard = Record<string, unknown>;

export type KanbanProps = {
	/** Cards grouped by column key — typically a grouped Query result. */
	data?: Record<string, KanbanCard[]>;
	/** Column order/labels: comma-separated keys, key list, or {key,label} list. */
	columns?: string | Array<string | { key: string; label?: string }>;
	/** Card field used as the card title. Defaults to the first string field. */
	title?: string;
	/** Card field rendered under the title when present. */
	subtitle?: string;
	/** Called after a drag between columns; binding an Action enables dragging. */
	onMove?: (card: KanbanCard, to: string, from: string) => unknown;
	oncardclick?: (card: KanbanCard) => void;
	emptyMessage?: string;
	class?: string;
};

declare const Kanban: Component<KanbanProps>;
export default Kanban;
