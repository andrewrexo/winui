<script lang="ts">
	import type { Snippet } from 'svelte';
	import { wm } from '../state/windows.svelte.js';
	import { taskbar } from '../state/taskbar.svelte.js';
	import { theme } from '../state/theme.svelte.js';

	interface Props {
		tray?: Snippet;
	}

	let { tray }: Props = $props();

	let clock = $state('');
	let dateString = $state('');
	let showCalendar = $state(false);

	const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	$effect(() => {
		function tick() {
			const now = new Date();
			let h = now.getHours();
			const m = String(now.getMinutes()).padStart(2, '0');
			const ampm = h >= 12 ? 'PM' : 'AM';
			h = h % 12 || 12;
			clock = `${h}:${m} ${ampm}`;
			dateString = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
		}
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	});
</script>

<svelte:window onclick={() => { showCalendar = false; }} />

<div
	class="taskbar"
	class:win98={theme.version === 'win98'}
	class:xp={theme.version === 'xp'}
	class:vista={theme.version === 'vista'}
>
	<button
		class="start-button"
		class:open={taskbar.startMenuOpen}
		onclick={() => taskbar.toggleStartMenu()}
	>
		<span class="start-flag">
			<span class="windows-logo">
				<span class="wr"></span><span class="wg"></span>
				<span class="wb"></span><span class="wy"></span>
			</span>
		</span>
		{#if theme.version !== 'vista'}
			<span class="start-label">
				{theme.version === 'win98' ? 'Start' : 'start'}
			</span>
		{/if}
	</button>

	{#if theme.version === 'win98'}
		<div class="win98-divider"></div>
	{/if}

	<div class="taskbar-items">
		{#each wm.taskbarItems as item (item.id)}
			<button
				class="taskbar-item"
				class:active={item.active}
				onclick={() => wm.taskbarClick(item.id)}
			>
				<span class="item-icon">{item.icon}</span>
				<span class="item-title">{item.title}</span>
			</button>
		{/each}
	</div>

	<div class="system-tray">
		{#if tray}
			{@render tray()}
		{/if}
		<button class="clock" title={dateString} onclick={(e: MouseEvent) => { e.stopPropagation(); showCalendar = !showCalendar; }}>
			{clock}
		</button>
		{#if showCalendar}
			<div class="calendar-popup" onclick={(e: MouseEvent) => e.stopPropagation()}>
				<div class="cal-header">{dateString}</div>
				<div class="cal-time">{clock}</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.taskbar {
		height: var(--taskbar-height, 30px);
		background: var(--taskbar-bg);
		border-top: var(--taskbar-border-top, none);
		box-shadow: var(--taskbar-shadow, none);
		display: flex;
		align-items: center;
		position: relative;
		z-index: 9999;
		flex-shrink: 0;
	}

	/* ========= START BUTTON ========= */
	.start-button {
		height: calc(var(--taskbar-height, 30px) - 6px);
		padding: var(--start-padding, 0 10px 0 4px);
		margin: 0 4px;
		background: var(--start-bg);
		border: var(--start-border, none);
		border-radius: var(--start-radius, 0 8px 8px 0);
		color: var(--start-color, #fff);
		font-family: var(--font-family, Tahoma, sans-serif);
		font-size: var(--start-font-size, 12px);
		font-weight: var(--start-font-weight, bold);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 3px;
		text-shadow: var(--start-text-shadow, 1px 1px 2px rgba(0, 0, 0, 0.5));
		box-shadow: var(--start-shadow, none);
		flex-shrink: 0;
		letter-spacing: 0.3px;
	}

	.start-button:hover {
		background: var(--start-hover-bg);
	}

	.start-button:active,
	.start-button.open {
		background: var(--start-active-bg);
	}

	.start-flag {
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.windows-logo {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		width: 14px;
		height: 14px;
	}

	.windows-logo span { border-radius: 1px; }
	.wr { background: #ff2020; }
	.wg { background: #00c800; }
	.wb { background: #2088ff; }
	.wy { background: #ffcc00; }

	.start-label { letter-spacing: 0.2px; }

	/* ========= Win98 Start Button: 3D raised ========= */
	.win98 .start-button {
		border: none;
		border-top: var(--start-border-top);
		border-left: var(--start-border-left);
		border-bottom: var(--start-border-bottom);
		border-right: var(--start-border-right);
		text-shadow: none;
		box-shadow: none;
		border-radius: 0;
		height: calc(var(--taskbar-height) - 4px);
	}

	.win98 .start-button:active,
	.win98 .start-button.open {
		border-top: var(--start-active-border-top);
		border-left: var(--start-active-border-left);
		border-bottom: var(--start-active-border-bottom);
		border-right: var(--start-active-border-right);
	}

	.win98-divider {
		width: 2px;
		height: calc(100% - 6px);
		border-left: 1px solid #808080;
		border-right: 1px solid #fff;
		margin: 0 2px;
	}

	/* ========= Vista Start Button: Circular orb ========= */
	.vista .start-button {
		width: var(--start-orb-size, 38px);
		height: var(--start-orb-size, 38px);
		border-radius: 50%;
		padding: 0;
		margin: 0 6px;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.vista .start-button::after {
		content: '';
		position: absolute;
		top: 1px;
		left: 15%;
		right: 15%;
		height: 45%;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.45) 0%,
			rgba(255, 255, 255, 0.1) 100%
		);
		border-radius: 50% 50% 40% 40%;
		pointer-events: none;
	}

	.vista .start-flag {
		width: 20px;
		height: 20px;
	}

	.vista .windows-logo {
		width: 16px;
		height: 16px;
		filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
	}

	/* ========= TASKBAR ITEMS ========= */
	.taskbar-items {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 3px;
		padding: 0 4px;
		overflow: hidden;
	}

	.taskbar-item {
		height: 22px;
		min-width: 120px;
		max-width: 180px;
		background: var(--taskbar-item-bg);
		border: var(--taskbar-item-border, none);
		border-radius: var(--taskbar-item-radius, 3px);
		display: flex;
		align-items: center;
		padding: 0 8px;
		gap: 4px;
		cursor: pointer;
		color: var(--taskbar-item-color, #fff);
		font-family: var(--font-family, Tahoma, sans-serif);
		font-size: 11px;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
		flex-shrink: 0;
	}

	.taskbar-item:hover {
		filter: brightness(1.08);
	}

	.taskbar-item.active {
		background: var(--taskbar-item-active-bg);
		border: var(--taskbar-item-active-border, var(--taskbar-item-border));
	}

	.item-icon { font-size: 14px; flex-shrink: 0; }
	.item-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

	/* Win98 taskbar items: 3D borders */
	.win98 .taskbar-item {
		border: none;
		border-top: var(--taskbar-item-border-top);
		border-left: var(--taskbar-item-border-left);
		border-bottom: var(--taskbar-item-border-bottom);
		border-right: var(--taskbar-item-border-right);
		text-shadow: none;
		box-shadow: none;
		height: calc(var(--taskbar-height) - 6px);
	}

	.win98 .taskbar-item.active {
		border-top: var(--taskbar-item-active-border-top);
		border-left: var(--taskbar-item-active-border-left);
		border-bottom: var(--taskbar-item-active-border-bottom);
		border-right: var(--taskbar-item-active-border-right);
	}

	/* XP taskbar items */
	.xp .taskbar-item {
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
		height: 24px;
	}

	.xp .taskbar-item.active {
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
	}

	/* Vista taskbar items */
	.vista .taskbar-item {
		height: 28px;
		backdrop-filter: blur(4px);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
	}

	/* ========= SYSTEM TRAY ========= */
	.system-tray {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0 10px;
		height: 100%;
		background: var(--tray-bg, transparent);
		color: var(--tray-color, #fff);
	}

	.clock {
		font-size: 11px;
		font-weight: bold;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
		min-width: 55px;
		text-align: center;
		background: transparent;
		border: none;
		color: inherit;
		font-family: inherit;
		cursor: pointer;
		padding: 1px 4px;
		border-radius: 2px;
	}

	.clock:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.calendar-popup {
		position: absolute;
		bottom: 100%;
		right: 0;
		background: #ece9d8;
		border: 1px solid #888;
		box-shadow: 2px -2px 6px rgba(0, 0, 0, 0.25);
		padding: 12px 16px;
		z-index: 10001;
		margin-bottom: 2px;
		border-radius: 3px;
		text-align: center;
		min-width: 180px;
	}

	.cal-header {
		font-size: 11px;
		font-weight: bold;
		color: #000;
		font-family: Tahoma, sans-serif;
		margin-bottom: 4px;
	}

	.cal-time {
		font-size: 20px;
		font-weight: bold;
		color: #000;
		font-family: Tahoma, sans-serif;
	}

	/* Win98 system tray: inset recessed */
	.win98 .system-tray {
		border-top: var(--tray-border-top);
		border-left: var(--tray-border-left);
		border-bottom: var(--tray-border-bottom);
		border-right: var(--tray-border-right);
		margin: 2px 2px 2px 0;
		padding: 0 6px;
	}

	.win98 .clock {
		text-shadow: none;
		font-weight: normal;
	}

	/* XP system tray */
	.xp .system-tray {
		border-left: 1px solid rgba(255, 255, 255, 0.08);
	}

	/* Vista: glass taskbar with blur */
	.vista {
		backdrop-filter: blur(16px);
	}

	.vista .clock {
		font-weight: normal;
		font-size: 12px;
	}
</style>
