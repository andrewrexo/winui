<script lang="ts">
	import type { Snippet } from 'svelte';
	import Window from './Window.svelte';
	import Taskbar from './Taskbar.svelte';
	import StartMenu from './StartMenu.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import { wm } from '../state/windows.svelte.js';
	import { desktop } from '../state/desktop.svelte.js';
	import { taskbar } from '../state/taskbar.svelte.js';
	import { notifications } from '../state/notifications.svelte.js';
	import NotificationBalloon from './NotificationBalloon.svelte';
	import { theme } from '../state/theme.svelte.js';
	import { THEME_CONFIGS } from '../themes/types.js';
	import type { ThemeVersion } from '../themes/types.js';
	import type { StartMenuItem } from './StartMenu.svelte';
	import type { ContextMenuItem } from './ContextMenu.svelte';

	interface Props {
		themeVersion?: ThemeVersion;
		icons?: Snippet;
		tray?: Snippet;
		startMenuFooter?: Snippet;
		userName?: string;
		userAvatar?: string;
		startMenuLeft?: StartMenuItem[];
		startMenuRight?: StartMenuItem[];
		contextMenuItems?: ContextMenuItem[];
	}

	let {
		themeVersion = 'xp',
		icons,
		tray,
		startMenuFooter,
		userName = 'User',
		userAvatar = '😎',
		startMenuLeft = [],
		startMenuRight = [],
		contextMenuItems = [
			{ label: 'Arrange Icons By' },
			{ label: 'Refresh' },
			{ separator: true, label: '' },
			{ label: 'Properties' }
		]
	}: Props = $props();

	$effect(() => { theme.set(themeVersion); });

	function handleDesktopClick() {
		desktop.clearSelection();
		wm.deactivateAll();
	}

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
		desktop.showContextMenu(e.clientX, e.clientY);
	}

	const wallpaperStyle = $derived(THEME_CONFIGS[theme.version].wallpaperCSS);

	// ===== Drag Selection Rectangle =====
	let selecting = $state(false);
	let selStartX = $state(0);
	let selStartY = $state(0);
	let selCurX = $state(0);
	let selCurY = $state(0);

	function handleDesktopMouseDown(e: MouseEvent) {
		// Only start selection on direct desktop-surface click (not on icons/windows)
		const target = e.target as HTMLElement;
		if (!target.classList.contains('desktop-surface') && !target.classList.contains('icon-grid')) return;
		selecting = true;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		selStartX = e.clientX - rect.left;
		selStartY = e.clientY - rect.top;
		selCurX = selStartX;
		selCurY = selStartY;
	}

	function handleDesktopMouseMove(e: MouseEvent) {
		if (!selecting) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		selCurX = e.clientX - rect.left;
		selCurY = e.clientY - rect.top;
	}

	function handleDesktopMouseUp() {
		selecting = false;
	}

	let selRect = $derived({
		left: Math.min(selStartX, selCurX),
		top: Math.min(selStartY, selCurY),
		width: Math.abs(selCurX - selStartX),
		height: Math.abs(selCurY - selStartY)
	});

	// ===== Alt+Tab Switcher =====
	let altTabOpen = $state(false);
	let altTabIndex = $state(0);

	function handleKeyDown(e: KeyboardEvent) {
		// Alt+F4: close active window
		if (e.altKey && e.key === 'F4') {
			e.preventDefault();
			wm.closeActive();
			return;
		}

		// Meta/Win key: toggle start menu
		if (e.key === 'Meta' || e.key === 'OS') {
			e.preventDefault();
			taskbar.toggleStartMenu();
			return;
		}

		// Escape: close start menu / context menu / alt-tab
		if (e.key === 'Escape') {
			taskbar.closeStartMenu();
			desktop.hideContextMenu();
			if (altTabOpen) { altTabOpen = false; return; }
			return;
		}

		// Alt+Tab: switcher
		if (e.altKey && e.key === 'Tab') {
			e.preventDefault();
			if (wm.windows.length === 0) return;
			if (!altTabOpen) {
				altTabOpen = true;
				// Start at current active, move to next
				const currentIdx = wm.windows.findIndex(w => w.id === wm.activeId);
				altTabIndex = (currentIdx + 1) % wm.windows.length;
			} else {
				altTabIndex = (altTabIndex + 1) % wm.windows.length;
			}
			return;
		}

		// Win+D: show desktop (minimize all)
		if (e.metaKey && e.key === 'd') {
			e.preventDefault();
			for (const win of wm.windows) {
				win.minimized = true;
			}
			wm.activeId = null;
			return;
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		// When Alt is released while alt-tab is open, switch to selected window
		if (altTabOpen && (e.key === 'Alt' || !e.altKey)) {
			const target = wm.windows[altTabIndex];
			if (target) {
				target.minimized = false;
				wm.activate(target.id);
			}
			altTabOpen = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} onkeyup={handleKeyUp} />

<div class="desktop-shell" data-theme={theme.version}>
	<div
		class="desktop-surface"
		style={wallpaperStyle}
		role="application"
		aria-label="Desktop"
		onclick={handleDesktopClick}
		oncontextmenu={handleContextMenu}
		onmousedown={handleDesktopMouseDown}
		onmousemove={handleDesktopMouseMove}
		onmouseup={handleDesktopMouseUp}
	>
		{#if icons}
			<div class="icon-grid">
				{@render icons()}
			</div>
		{/if}

		{#each wm.windows as win (win.id)}
			<Window
				id={win.id}
				title={win.title}
				icon={win.icon}
				active={win.id === wm.activeId}
				x={win.x}
				y={win.y}
				width={win.width}
				height={win.height}
				z={win.z}
				minimized={win.minimized}
				maximized={win.maximized}
			>
				<win.component {...win.props} />
			</Window>
		{/each}

		{#if desktop.contextMenu}
			<ContextMenu
				items={contextMenuItems}
				x={desktop.contextMenu.x}
				y={desktop.contextMenu.y}
				onclose={() => desktop.hideContextMenu()}
			/>
		{/if}

		<!-- Drag Selection Rectangle -->
		{#if selecting && selRect.width > 3 && selRect.height > 3}
			<div
				class="selection-rect"
				style="left:{selRect.left}px;top:{selRect.top}px;width:{selRect.width}px;height:{selRect.height}px;"
			></div>
		{/if}

		<!-- Alt+Tab Switcher Overlay -->
		{#if altTabOpen && wm.windows.length > 0}
			<div class="alt-tab-overlay">
				<div class="alt-tab-box">
					{#each wm.windows as win, i}
						<div class="alt-tab-item" class:selected={i === altTabIndex}>
							<span class="alt-tab-icon">{win.icon}</span>
						</div>
					{/each}
					<div class="alt-tab-label">{wm.windows[altTabIndex]?.title ?? ''}</div>
				</div>
			</div>
		{/if}
	</div>

	<StartMenu
		{userName}
		{userAvatar}
		leftItems={startMenuLeft}
		rightItems={startMenuRight}
		footer={startMenuFooter}
	/>

	<Taskbar {tray} />

	<!-- Notification Balloons -->
	{#each notifications.notifications as notif (notif.id)}
		<NotificationBalloon
			title={notif.title}
			message={notif.message}
			icon={notif.icon}
			onclose={() => notifications.dismiss(notif.id)}
		/>
	{/each}
</div>

<style>
	.desktop-shell {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		font-family: var(--font-family, Tahoma, sans-serif);
		font-size: var(--font-size, 11px);
		user-select: none;
		cursor: default;
	}

	.desktop-surface {
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	.icon-grid {
		padding: 12px;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-content: flex-start;
		gap: 8px;
		height: 100%;
	}

	::selection {
		background: var(--selection-bg, #316ac5);
		color: var(--selection-color, #fff);
	}

	/* ===== Selection Rectangle ===== */
	.selection-rect {
		position: absolute;
		border: 1px solid var(--selection-bg, #316ac5);
		background: rgba(49, 106, 197, 0.15);
		pointer-events: none;
		z-index: 5;
	}

	/* ===== Alt+Tab Overlay ===== */
	.alt-tab-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50000;
		background: rgba(0, 0, 0, 0.15);
	}

	.alt-tab-box {
		background: #ece9d8;
		border: 2px solid #0054e3;
		box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.4);
		padding: 12px 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
		min-width: 200px;
		max-width: 500px;
		border-radius: 4px;
	}

	.alt-tab-item {
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		border: 2px solid transparent;
		border-radius: 3px;
		background: transparent;
	}

	.alt-tab-item.selected {
		border-color: #0054e3;
		background: #d0d8f0;
	}

	.alt-tab-label {
		width: 100%;
		text-align: center;
		margin-top: 4px;
		font-size: 11px;
		font-weight: bold;
		color: #000;
		border-top: 1px solid #d0cbb8;
		padding-top: 6px;
	}

	/* ===== Themed Scrollbars (global, scoped by data-theme) ===== */

	/* --- Windows XP scrollbars --- */
	:global([data-theme='xp']) :global(::-webkit-scrollbar) {
		width: 17px;
		height: 17px;
	}
	:global([data-theme='xp']) :global(::-webkit-scrollbar-track) {
		background: #f1efe2;
		border-left: 1px solid #d6d0c4;
	}
	:global([data-theme='xp']) :global(::-webkit-scrollbar-thumb) {
		background: linear-gradient(90deg, #ece9d8 0%, #d8d4c4 50%, #ece9d8 100%);
		border: 1px solid #b0a890;
		border-radius: 0;
		min-height: 24px;
	}
	:global([data-theme='xp']) :global(::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(90deg, #e0ddd0 0%, #ccc8b8 50%, #e0ddd0 100%);
	}
	:global([data-theme='xp']) :global(::-webkit-scrollbar-button) {
		width: 17px;
		height: 17px;
		background: #ece9d8;
		border: 1px solid #b0a890;
	}
	:global([data-theme='xp']) :global(::-webkit-scrollbar-button:hover) {
		background: #e0ddd0;
	}
	:global([data-theme='xp']) :global(::-webkit-scrollbar-corner) {
		background: #ece9d8;
	}

	/* --- Windows 98 scrollbars --- */
	:global([data-theme='win98']) :global(::-webkit-scrollbar) {
		width: 16px;
		height: 16px;
	}
	:global([data-theme='win98']) :global(::-webkit-scrollbar-track) {
		background: repeating-conic-gradient(#c0c0c0 0% 25%, #ffffff 0% 50%) 50% / 2px 2px;
	}
	:global([data-theme='win98']) :global(::-webkit-scrollbar-thumb) {
		background: #c0c0c0;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-bottom: 1px solid #404040;
		border-right: 1px solid #404040;
	}
	:global([data-theme='win98']) :global(::-webkit-scrollbar-button) {
		width: 16px;
		height: 16px;
		background: #c0c0c0;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-bottom: 1px solid #404040;
		border-right: 1px solid #404040;
	}
	:global([data-theme='win98']) :global(::-webkit-scrollbar-corner) {
		background: #c0c0c0;
	}

	/* --- Windows Vista scrollbars --- */
	:global([data-theme='vista']) :global(::-webkit-scrollbar) {
		width: 14px;
		height: 14px;
	}
	:global([data-theme='vista']) :global(::-webkit-scrollbar-track) {
		background: rgba(240, 242, 248, 0.6);
	}
	:global([data-theme='vista']) :global(::-webkit-scrollbar-thumb) {
		background: rgba(160, 170, 195, 0.5);
		border-radius: 7px;
		border: 2px solid transparent;
		background-clip: content-box;
	}
	:global([data-theme='vista']) :global(::-webkit-scrollbar-thumb:hover) {
		background: rgba(120, 135, 165, 0.65);
		border-radius: 7px;
		border: 2px solid transparent;
		background-clip: content-box;
	}
	:global([data-theme='vista']) :global(::-webkit-scrollbar-button) {
		display: none;
	}
	:global([data-theme='vista']) :global(::-webkit-scrollbar-corner) {
		background: rgba(240, 242, 248, 0.4);
	}
</style>
