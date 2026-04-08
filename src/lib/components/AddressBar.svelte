<script lang="ts">
	import { theme } from '../state/theme.svelte.js';

	interface Props {
		/** Current address value */
		value: string;
		/** Icon shown inside the input */
		icon?: string;
		/** Whether the input is editable */
		readonly?: boolean;
		/** Called when the user presses Enter or clicks Go */
		onnavigate?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		icon = '📁',
		readonly: isReadonly = false,
		onnavigate
	}: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') onnavigate?.(value);
	}
</script>

<div class="address-bar" class:win98={theme.version === 'win98'} class:vista={theme.version === 'vista'}>
	<span class="addr-label">Address</span>
	<div class="addr-input">
		<span class="addr-icon">{icon}</span>
		<input type="text" bind:value readonly={isReadonly} onkeydown={handleKeydown} />
	</div>
	<button class="addr-go" onclick={() => onnavigate?.(value)}>
		Go <span class="go-arrow">→</span>
	</button>
</div>

<style>
	.address-bar {
		display: flex;
		align-items: center;
		height: 24px;
		background: #ece9d8;
		border-bottom: 1px solid #bfb8a4;
		padding: 0 4px;
		gap: 4px;
		flex-shrink: 0;
	}

	.addr-label {
		font-size: 11px;
		font-family: Tahoma, sans-serif;
		color: #000;
		padding: 0 3px;
	}

	.addr-input {
		flex: 1;
		display: flex;
		align-items: center;
		background: #fff;
		border: 1px solid #7f9db9;
		height: 18px;
		padding: 0 2px;
	}

	.addr-icon {
		font-size: 12px;
		margin-right: 3px;
		flex-shrink: 0;
	}

	.addr-input input {
		flex: 1;
		border: none;
		outline: none;
		font-family: Tahoma, sans-serif;
		font-size: 11px;
		padding: 0;
		height: 100%;
		background: transparent;
	}

	.addr-go {
		display: flex;
		align-items: center;
		gap: 3px;
		padding: 1px 6px;
		height: 20px;
		background: linear-gradient(180deg, #f4f1ea 0%, #dcd6c4 100%);
		border: 1px solid #a0a0a0;
		font-family: Tahoma, sans-serif;
		font-size: 11px;
		cursor: pointer;
		border-radius: 1px;
		color: #000;
	}

	.addr-go:hover {
		background: linear-gradient(180deg, #fafafa 0%, #e4e0d4 100%);
	}

	.go-arrow { color: #208020; font-weight: bold; }

	/* Win98 */
	.win98 {
		background: #c0c0c0;
		border-bottom: 1px solid #808080;
	}

	.win98 .addr-input {
		border: 2px inset #bbb;
	}

	.win98 .addr-go {
		background: #c0c0c0;
		border: 1px outset #dfdfdf;
	}

	/* Vista */
	.vista {
		background: linear-gradient(180deg, #f0f2f8 0%, #e4e8f0 100%);
		border-bottom: 1px solid #c4c8d4;
	}
</style>
