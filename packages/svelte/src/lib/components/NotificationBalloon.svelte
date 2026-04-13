<script lang="ts">
	import { theme } from '../state/theme.svelte.js';

	interface Props {
		title: string;
		message: string;
		icon?: string;
		onclose?: () => void;
	}

	let { title, message, icon = 'ℹ️', onclose }: Props = $props();

	// Auto-dismiss after 8 seconds
	$effect(() => {
		const timeout = setTimeout(() => onclose?.(), 8000);
		return () => clearTimeout(timeout);
	});
</script>

<div class="balloon" class:win98={theme.version === 'win98'} class:vista={theme.version === 'vista'}>
	<div class="balloon-header">
		<span class="balloon-icon">{icon}</span>
		<span class="balloon-title">{title}</span>
		<button class="balloon-close" onclick={onclose}>✕</button>
	</div>
	<div class="balloon-body">{message}</div>
	<div class="balloon-arrow"></div>
</div>

<style>
	.balloon {
		position: fixed;
		bottom: 44px;
		right: 12px;
		width: 260px;
		background: #ffffe1;
		border: 1px solid #000;
		border-radius: 6px;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.25);
		z-index: 15000;
		animation: balloonIn 0.3s ease-out;
		font-family: Tahoma, sans-serif;
		font-size: 11px;
	}

	@keyframes balloonIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.balloon-header {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 8px 2px;
	}

	.balloon-icon { font-size: 16px; }

	.balloon-title {
		flex: 1;
		font-weight: bold;
		font-size: 11px;
		color: #000;
	}

	.balloon-close {
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 10px;
		color: #666;
		padding: 0 2px;
	}

	.balloon-close:hover { color: #000; }

	.balloon-body {
		padding: 2px 8px 8px;
		color: #000;
		line-height: 1.4;
	}

	.balloon-arrow {
		position: absolute;
		bottom: -8px;
		right: 40px;
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 8px solid #ffffe1;
		filter: drop-shadow(0 1px 0 #000);
	}

	/* Win98: simpler look */
	.win98 {
		border-radius: 0;
		background: #ffffe1;
	}

	/* Vista: glass effect */
	.vista {
		background: rgba(255, 255, 240, 0.95);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 8px;
	}
</style>
