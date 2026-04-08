<script lang="ts">
	import { theme } from '../state/theme.svelte.js';

	export interface MenuDef {
		label: string;
		items: MenuItemDef[];
	}

	export interface MenuItemDef {
		label: string;
		action?: () => void;
		disabled?: boolean;
		checked?: boolean;
		separator?: boolean;
	}

	interface Props {
		menus: MenuDef[];
	}

	let { menus }: Props = $props();
	let openMenu = $state<number | null>(null);

	function toggle(idx: number) {
		openMenu = openMenu === idx ? null : idx;
	}

	function handleItemClick(item: MenuItemDef) {
		if (item.disabled) return;
		item.action?.();
		openMenu = null;
	}
</script>

<svelte:window onclick={() => { openMenu = null; }} />

<div class="menubar" class:win98={theme.version === 'win98'}>
	{#each menus as menu, idx}
		<div class="menu-wrapper">
			<button
				class="menu-trigger"
				class:open={openMenu === idx}
				onclick={(e: MouseEvent) => { e.stopPropagation(); toggle(idx); }}
			>
				{menu.label}
			</button>
			{#if openMenu === idx}
				<div class="dropdown" onclick={(e: MouseEvent) => e.stopPropagation()}>
					{#each menu.items as item}
						{#if item.separator}
							<div class="dd-sep"></div>
						{:else}
							<button
								class="dd-item"
								class:disabled={item.disabled}
								onclick={() => handleItemClick(item)}
							>
								{#if item.checked !== undefined}
									<span class="dd-check">{item.checked ? '✓' : ' '}</span>
								{/if}
								{item.label}
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.menubar {
		display: flex;
		align-items: center;
		height: 20px;
		background: #ece9d8;
		border-bottom: 1px solid #d0cbb8;
		padding: 0 2px;
		flex-shrink: 0;
	}

	.menu-wrapper {
		position: relative;
	}

	.menu-trigger {
		background: transparent;
		border: 1px solid transparent;
		padding: 1px 6px;
		font-size: 11px;
		font-family: Tahoma, sans-serif;
		cursor: pointer;
		color: #000;
		height: 100%;
	}

	.menu-trigger:hover,
	.menu-trigger.open {
		border-color: #c8d6f0;
		background: linear-gradient(180deg, #f0f4fc 0%, #d8e0f4 100%);
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		background: #fff;
		border: 1px solid #888;
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
		min-width: 160px;
		z-index: 100;
		padding: 2px 0;
	}

	.dd-item {
		display: block;
		width: 100%;
		padding: 3px 20px;
		background: transparent;
		border: none;
		font-family: Tahoma, sans-serif;
		font-size: 11px;
		text-align: left;
		cursor: pointer;
		color: #000;
	}

	.dd-item:hover:not(.disabled) {
		background: #316ac5;
		color: white;
	}

	.dd-item.disabled {
		color: #a0a0a0;
		cursor: default;
	}

	.dd-check {
		display: inline-block;
		width: 14px;
		margin-left: -14px;
	}

	.dd-sep {
		height: 1px;
		background: #d6d0c4;
		margin: 2px 2px;
	}

	/* Win98 */
	.win98 {
		background: #c0c0c0;
		border-bottom: 1px solid #808080;
	}

	.win98 .menu-trigger:hover,
	.win98 .menu-trigger.open {
		background: #000080;
		color: white;
		border-color: transparent;
	}

	.win98 .dropdown {
		background: #c0c0c0;
		border: 2px outset #dfdfdf;
		box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
	}

	.win98 .dd-item:hover:not(.disabled) {
		background: #000080;
	}

	.win98 .dd-sep {
		background: #808080;
	}
</style>
