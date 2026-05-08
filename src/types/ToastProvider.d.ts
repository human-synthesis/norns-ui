import type { Component } from 'svelte';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export type ToastProviderProps = {
	class?: string;
};

export type ToastOpts = {
	variant?: ToastVariant;
	duration?: number;
};

declare const ToastProvider: Component<ToastProviderProps>;
export default ToastProvider;
