import type { Component, Snippet } from 'svelte';

export type ChatMessage = {
	text?: string;
	from?: string;
	/** True for messages appended locally by this client's composer. */
	self?: boolean;
	[key: string]: unknown;
};

export type ChatThreadProps = {
	/** Room name — a generated Page binds a `room: true` Worker here. */
	roomChannel?: string;
	/** Message type sent by the composer (default 'chat'). */
	send?: string;
	/** Message type appended to the thread (defaults to `send`). */
	receive?: string;
	placeholder?: string;
	sendLabel?: string;
	emptyMessage?: string;
	/** Message renderer snippet — replaces the default from/text row. */
	message?: Snippet<[ChatMessage]>;
	class?: string;
};

declare const ChatThread: Component<ChatThreadProps>;
export default ChatThread;
