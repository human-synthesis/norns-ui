import type { Component, Snippet } from 'svelte';

export type FeedProps = {
	/** SSE endpoint URL — frames append as entries. */
	streamSource?: string;
	/** Room name — received frames append as entries. */
	roomChannel?: string;
	/** Room message type to append ('*' for all, the default). */
	receive?: string;
	/** Newest entries kept (default 100). */
	max?: number | string;
	emptyMessage?: string;
	/** Entry renderer snippet — replaces the default text/JSON line. */
	item?: Snippet<[unknown]>;
	class?: string;
};

declare const Feed: Component<FeedProps>;
export default Feed;
