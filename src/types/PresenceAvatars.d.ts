import type { Component } from 'svelte';

export type PresenceAvatarsProps = {
	/** Room name — client count comes from the Room's presence broadcasts. */
	roomChannel?: string;
	/** Avatars shown before the +N overflow (default 5). */
	max?: number | string;
	size?: 'xs' | 'sm' | 'md' | 'lg';
	/** Suffix after the count (default 'online'). */
	label?: string;
	/** Show the numeric count next to the avatars (default true). */
	showCount?: boolean;
	class?: string;
};

declare const PresenceAvatars: Component<PresenceAvatarsProps>;
export default PresenceAvatars;
