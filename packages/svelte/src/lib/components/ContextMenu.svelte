<script lang="ts">
	/** A single item in the context menu */
	export interface ContextMenuItem {
		/** Display label */
		label: string;
		/** Called when clicked */
		action?: () => void;
		/** Renders a separator line instead of an item */
		separator?: boolean;
		/** Disables the item */
		disabled?: boolean;
	}

	interface Props {
		/** Menu items to display */
		items: ContextMenuItem[];
		/** Horizontal position in viewport pixels */
		x: number;
		/** Vertical position in viewport pixels */
		y: number;
		/** Called when the menu should close */
		onclose?: () => void;
	}

	let { items, x, y, onclose }: Props = $props();

	function handleClick(item: ContextMenuItem) {
		if (item.disabled) return;
		item.action?.();
		onclose?.();
	}
</script>

<svelte:window onclick={onclose} />

<div
	class="context-menu"
	style="left:{x}px;top:{y}px"
	role="menu"
	onclick={(e: MouseEvent) => e.stopPropagation()}
>
	{#each items as item}
		{#if item.separator}
			<div class="ctx-sep" role="separator"></div>
		{:else}
			<button
				class="ctx-item"
				class:disabled={item.disabled}
				role="menuitem"
				aria-disabled={item.disabled}
				onclick={() => handleClick(item)}
			>
				{item.label}
			</button>
		{/if}
	{/each}
</div>

<style>
	.context-menu {
		position: fixed;
		background: var(--ctx-bg, #fff);
		border: var(--ctx-border, 1px solid #888);
		box-shadow: var(--ctx-shadow, 2px 2px 6px rgba(0, 0, 0, 0.3));
		z-index: 20000;
		min-width: 180px;
		padding: 2px 0;
	}

	.ctx-item {
		display: block;
		width: 100%;
		padding: 4px 24px;
		cursor: pointer;
		font-size: var(--font-size, 11px);
		font-family: var(--font-family, Tahoma, sans-serif);
		background: transparent;
		border: none;
		text-align: left;
		color: inherit;
	}

	.ctx-item:hover:not(.disabled) {
		background: var(--ctx-hover-bg, #316ac5);
		color: var(--ctx-hover-color, #fff);
	}

	.ctx-item.disabled {
		color: #999;
		cursor: default;
	}

	.ctx-sep {
		height: 1px;
		background: var(--ctx-separator, #d6d0c4);
		margin: 2px 0;
	}
</style>
