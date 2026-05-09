import type { Component } from 'svelte';
import type { AvatarSize } from './Avatar';

export type AvatarGroupItem = { src?: string; name?: string };

export type AvatarGroupProps = {
	items?: AvatarGroupItem[];
	max?: number;
	size?: AvatarSize;
	label?: string;
	class?: string;
};

declare const AvatarGroup: Component<AvatarGroupProps>;
export default AvatarGroup;
