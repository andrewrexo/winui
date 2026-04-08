<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		/** Visual variant */
		variant?: 'default' | 'primary';
		children: Snippet;
	}

	let {
		variant = 'default',
		children,
		...rest
	}: Props = $props();
</script>

<button class="win-btn" class:primary={variant === 'primary'} {...rest}>
	{@render children()}
</button>

<style>
	.win-btn {
		background: var(--btn-bg, #ece9d8);
		border: var(--btn-border, 1px solid #aca899);
		border-radius: var(--btn-radius, 3px);
		color: var(--btn-color, #000);
		font-family: var(--font-family, Tahoma, sans-serif);
		font-size: var(--btn-font-size, 11px);
		padding: 3px 12px;
		cursor: pointer;
		user-select: none;
	}

	.win-btn:hover {
		background: var(--btn-hover-bg, #f0ede4);
	}

	.win-btn:active {
		background: var(--btn-active-bg, #ddd8c8);
		border: var(--btn-active-border, 1px solid #888);
	}

	.primary {
		font-weight: bold;
	}
</style>
