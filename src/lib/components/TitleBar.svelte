<script lang="ts">
	import { theme } from '../state/theme.svelte.js';

	interface Props {
		title: string;
		icon?: string;
		active?: boolean;
		onminimize?: () => void;
		onmaximize?: () => void;
		onclose?: () => void;
	}

	let {
		title,
		icon = '',
		active = true,
		onminimize,
		onmaximize,
		onclose
	}: Props = $props();
</script>

<div
	class="title-bar"
	class:active
	class:win98={theme.version === 'win98'}
	class:xp={theme.version === 'xp'}
	class:vista={theme.version === 'vista'}
>
	{#if icon}
		<span class="title-icon">{icon}</span>
	{/if}
	<span class="title-text">{title}</span>
	<div class="window-controls">
		{#if theme.version === 'win98'}
			<!-- Win98: grouped [_][☐]  [x] with classic pixel look -->
			<div class="win98-btn-group">
				{#if onminimize}
					<button class="ctrl-btn" onclick={onminimize} aria-label="Minimize">
						<svg viewBox="0 0 6 2" width="6" height="2"><rect width="6" height="2" fill="currentColor"/></svg>
					</button>
				{/if}
				{#if onmaximize}
					<button class="ctrl-btn" onclick={onmaximize} aria-label="Maximize">
						<svg viewBox="0 0 9 9" width="7" height="7"><rect x="0" y="0" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2"/><line x1="0" y1="2" x2="9" y2="2" stroke="currentColor" stroke-width="2"/></svg>
					</button>
				{/if}
			</div>
			{#if onclose}
				<button class="ctrl-btn btn-close" onclick={onclose} aria-label="Close">
					<svg viewBox="0 0 8 7" width="7" height="6"><path d="M0,0 L3,3 L0,6 M8,0 L5,3 L8,6" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="1" y1="3" x2="7" y2="3" stroke="currentColor" stroke-width="1.5"/></svg>
				</button>
			{/if}
		{:else}
			<!-- XP / Vista: individual rounded buttons -->
			{#if onminimize}
				<button class="ctrl-btn" onclick={onminimize} aria-label="Minimize">
					<svg viewBox="0 0 11 11" width="9" height="9"><rect x="2" y="8" width="7" height="2" fill="currentColor" rx="0.3"/></svg>
				</button>
			{/if}
			{#if onmaximize}
				<button class="ctrl-btn" onclick={onmaximize} aria-label="Maximize">
					<svg viewBox="0 0 11 11" width="9" height="9"><rect x="2" y="2" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.2" rx="0.3"/><rect x="2" y="2" width="7" height="2.5" fill="currentColor" rx="0.3"/></svg>
				</button>
			{/if}
			{#if onclose}
				<button class="ctrl-btn btn-close" onclick={onclose} aria-label="Close">
					<svg viewBox="0 0 11 11" width="9" height="9"><line x1="2.5" y1="2.5" x2="8.5" y2="8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="8.5" y1="2.5" x2="2.5" y2="8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
				</button>
			{/if}
		{/if}
	</div>
</div>

<style>
	.title-bar {
		height: var(--win-titlebar-height, 25px);
		background: var(--win-titlebar-active);
		display: flex;
		align-items: center;
		padding: var(--win-titlebar-padding, 0 2px 0 4px);
		cursor: default;
		border-radius: var(--win-titlebar-radius, 0);
		flex-shrink: 0;
		gap: 3px;
		user-select: none;
	}

	.title-bar:not(.active) {
		background: var(--win-titlebar-inactive);
	}

	.title-icon {
		width: 16px;
		height: 16px;
		font-size: 13px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.title-text {
		flex: 1;
		color: white;
		font-family: Tahoma, sans-serif;
		font-size: var(--win-titlebar-font-size, 11px);
		font-weight: bold;
		text-shadow: var(--win-titlebar-text-shadow, none);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-left: 1px;
	}

	.vista .title-text {
		font-family: 'Segoe UI', Tahoma, sans-serif;
		font-weight: normal;
		letter-spacing: 0.3px;
		font-size: 12px;
	}

	/* ===== Window Controls ===== */
	.window-controls {
		display: flex;
		gap: var(--win-ctrl-gap, 2px);
		flex-shrink: 0;
		align-items: center;
	}

	.ctrl-btn {
		width: var(--win-ctrl-size, 21px);
		height: var(--win-ctrl-size, 21px);
		border: var(--win-ctrl-border, none);
		border-radius: var(--win-ctrl-radius, 3px);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--win-ctrl-color, #fff);
		background: var(--win-ctrl-bg);
		padding: 0;
		line-height: 1;
	}

	.ctrl-btn:hover {
		background: var(--win-ctrl-hover-bg);
	}

	.btn-close {
		background: var(--win-ctrl-close-bg) !important;
	}

	.btn-close:hover {
		filter: brightness(1.12);
	}

	/* ===== XP ===== */
	.xp .ctrl-btn {
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 0 rgba(0, 0, 0, 0.12);
	}

	.xp .btn-close {
		margin-left: 2px;
	}

	/* ===== Win98: 3D buttons ===== */
	.win98-btn-group {
		display: flex;
		gap: 0px;
	}

	.win98 .ctrl-btn {
		box-shadow: none;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-bottom: 1px solid #404040;
		border-right: 1px solid #404040;
		border-radius: 0;
		background: #c0c0c0;
	}

	.win98 .ctrl-btn:active {
		border-top: 1px solid #404040;
		border-left: 1px solid #404040;
		border-bottom: 1px solid #fff;
		border-right: 1px solid #fff;
	}

	.win98 .btn-close {
		background: #c0c0c0 !important;
		margin-left: 2px;
	}

	/* ===== Vista: glass ===== */
	.vista .ctrl-btn {
		backdrop-filter: blur(6px);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
	}
</style>
