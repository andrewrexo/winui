<script lang="ts">
	import type { Snippet } from 'svelte';
	import Window from './Window.svelte';
	import Taskbar from './Taskbar.svelte';
	import StartMenu from './StartMenu.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import { wm } from '../state/windows.svelte.js';
	import { desktop } from '../state/desktop.svelte.js';
	import { theme } from '../state/theme.svelte.js';
	import { THEME_CONFIGS } from '../themes/types.js';
	import type { ThemeVersion } from '../themes/types.js';
	import type { StartMenuItem } from './StartMenu.svelte';
	import type { ContextMenuItem } from './ContextMenu.svelte';

	interface Props {
		/** Which Windows theme to use */
		themeVersion?: ThemeVersion;
		/** Desktop icons slot */
		icons?: Snippet;
		/** Content for the system tray */
		tray?: Snippet;
		/** Start menu footer */
		startMenuFooter?: Snippet;
		/** User display name */
		userName?: string;
		/** User avatar emoji */
		userAvatar?: string;
		/** Start menu left-column items */
		startMenuLeft?: StartMenuItem[];
		/** Start menu right-column items */
		startMenuRight?: StartMenuItem[];
		/** Right-click context menu items */
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

	// Sync theme version prop
	$effect(() => {
		theme.set(themeVersion);
	});

	function handleDesktopClick() {
		desktop.clearSelection();
		wm.deactivateAll();
	}

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
		desktop.showContextMenu(e.clientX, e.clientY);
	}

	const wallpaperStyle = $derived(THEME_CONFIGS[theme.version].wallpaperCSS);
</script>

<div class="desktop-shell" data-theme={theme.version}>
	<!-- Desktop surface -->
	<div
		class="desktop-surface"
		style={wallpaperStyle}
		role="application"
		aria-label="Desktop"
		onclick={handleDesktopClick}
		oncontextmenu={handleContextMenu}
	>
		<!-- Desktop Icons -->
		{#if icons}
			<div class="icon-grid">
				{@render icons()}
			</div>
		{/if}

		<!-- Windows -->
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

		<!-- Context Menu -->
		{#if desktop.contextMenu}
			<ContextMenu
				items={contextMenuItems}
				x={desktop.contextMenu.x}
				y={desktop.contextMenu.y}
				onclose={() => desktop.hideContextMenu()}
			/>
		{/if}
	</div>

	<!-- Start Menu -->
	<StartMenu
		{userName}
		{userAvatar}
		leftItems={startMenuLeft}
		rightItems={startMenuRight}
		footer={startMenuFooter}
	/>

	<!-- Taskbar -->
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
</style>
