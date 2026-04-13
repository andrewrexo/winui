<script lang="ts">
	import type { Snippet } from 'svelte';
	import { theme } from '../state/theme.svelte.js';

	export interface ToolbarButton {
		icon: string;
		label?: string;
		dropdown?: boolean;
		disabled?: boolean;
		action?: () => void;
	}

	export interface ToolbarGroup {
		buttons: ToolbarButton[];
	}

	interface Props {
		/** Array of button groups separated by dividers */
		groups: ToolbarGroup[];
	}

	let { groups }: Props = $props();
</script>

<div class="toolbar" class:win98={theme.version === 'win98'} class:vista={theme.version === 'vista'}>
	{#each groups as group, gi}
		{#if gi > 0}
			<div class="tb-sep"></div>
		{/if}
		<div class="tb-group">
			{#each group.buttons as btn}
				<button
					class="tb-btn"
					disabled={btn.disabled}
					onclick={btn.action}
					title={btn.label ?? ''}
				>
					<span class="tb-icon">{btn.icon}</span>
					{#if btn.label}
						<span class="tb-label">{btn.label}</span>
					{/if}
					{#if btn.dropdown}
						<span class="tb-drop">▾</span>
					{/if}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		height: 26px;
		background: linear-gradient(180deg, #f4f1ea 0%, #ece9d8 60%, #dcd6c4 100%);
		border-bottom: 1px solid #bfb8a4;
		padding: 0 4px;
		gap: 1px;
		flex-shrink: 0;
	}

	.tb-group {
		display: flex;
		gap: 0;
	}

	.tb-btn {
		display: flex;
		align-items: center;
		gap: 3px;
		padding: 1px 5px;
		height: 22px;
		background: transparent;
		border: 1px solid transparent;
		font-family: Tahoma, sans-serif;
		font-size: 11px;
		color: #000;
		cursor: pointer;
		border-radius: 2px;
	}

	.tb-btn:hover:not(:disabled) {
		border-color: #c8d6f0;
		background: linear-gradient(180deg, #f8f8ff 0%, #e0e8f8 100%);
	}

	.tb-btn:disabled {
		color: #a0a0a0;
		cursor: default;
	}

	.tb-icon { font-size: 14px; line-height: 1; }
	.tb-label { font-size: 11px; }
	.tb-drop { font-size: 8px; margin-left: 1px; color: #666; }

	.tb-sep {
		width: 1px;
		height: 18px;
		margin: 0 3px;
		background: #d0cbb8;
		border-right: 1px solid #fff;
	}

	/* Win98 */
	.win98 {
		background: #c0c0c0;
		border-bottom: 1px solid #808080;
	}

	.win98 .tb-btn:hover:not(:disabled) {
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-bottom: 1px solid #404040;
		border-right: 1px solid #404040;
		background: #c0c0c0;
	}

	/* Vista */
	.vista {
		background: linear-gradient(180deg, #f8f8fc 0%, #e8ecf4 100%);
		border-bottom: 1px solid #c4c8d4;
	}

	.vista .tb-btn:hover:not(:disabled) {
		background: rgba(80, 130, 200, 0.12);
		border-color: rgba(80, 130, 200, 0.3);
	}
</style>
