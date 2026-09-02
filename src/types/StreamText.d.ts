import type { Component } from 'svelte';

export type StreamTextProps = {
	/** SSE endpoint URL — a generated Page binds a `stream:` Endpoint here. */
	streamSource?: string;
	/** JSON-able request body; the stream opens with POST when set. */
	input?: unknown;
	/** Open the stream on mount (default true). */
	autostart?: boolean;
	/** Called with each parsed frame as it arrives. */
	onframe?: (frame: unknown) => void;
	/** Called with the full accumulated text when the stream ends. */
	ondone?: (text: string) => void;
	class?: string;
};

declare const StreamText: Component<StreamTextProps>;
export default StreamText;
