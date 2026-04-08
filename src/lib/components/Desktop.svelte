<script lang="ts">
	import type { Snippet } from 'svelte';
	import Window from './Window.svelte';
	import Taskbar from './Taskbar.svelte';
	import StartMenu from './StartMenu.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import { wm } from '../state/windows.svelte.js';
	import { desktop } from '../state/desktop.svelte.js';
	import { taskbar } from '../state/taskbar.svelte.js';
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
</style>
