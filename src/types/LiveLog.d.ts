import type { Component } from 'svelte';

export type LiveLogProps = {
	/** SSE endpoint URL — each frame becomes a log line. */
	streamSource?: string;
	/** Room name — received frames become log lines. */
	roomChannel?: string;
	/** Room message type to log ('*' for all, the default). */
	receive?: string;
	/** Newest lines kept (default 200). */
	maxLines?: number | string;
	class?: string;
};

declare const LiveLog: Component<LiveLogProps>;
export default LiveLog;
