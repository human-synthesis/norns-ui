import type { Component } from 'svelte';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
	src?: string;
	/** Display name; first + last initial used as fallback when `src` is missing. */
	name?: string;
	size?: AvatarSize;
	class?: string;
};

declare const Avatar: Component<AvatarProps>;
export default Avatar;
