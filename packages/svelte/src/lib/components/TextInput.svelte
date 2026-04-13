<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		/** Input label shown before the field */
		label?: string;
	}

	let { label, value = $bindable(''), ...rest }: Props = $props();
</script>

<div class="text-input-wrapper">
	{#if label}
		<label class="input-label">{label}</label>
	{/if}
	<input class="win-input" bind:value {...rest} />
</div>

<style>
	.text-input-wrapper {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.input-label {
		font-size: var(--font-size, 11px);
		color: var(--btn-color, #555);
		white-space: nowrap;
	}

	.win-input {
		flex: 1;
		background: var(--input-bg, #fff);
		border: var(--input-border, 1px solid #7f9db9);
		border-radius: var(--input-radius, 0);
		color: var(--input-color, #000);
		font-family: var(--font-family, Tahoma, sans-serif);
		font-size: var(--font-size, 11px);
		padding: 2px 4px;
	}
</style>
