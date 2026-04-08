<script lang="ts">
	import type { Snippet } from 'svelte';
	import { taskbar } from '../state/taskbar.svelte.js';
	import { theme } from '../state/theme.svelte.js';

	export interface StartMenuItem {
		icon: string;
		label: string;
		bold?: boolean;
		action?: () => void;
		separator?: boolean;
	}

	interface Props {
		userName?: string;
		userAvatar?: string;
		leftItems?: StartMenuItem[];
		rightItems?: StartMenuItem[];
		footer?: Snippet;
	}

	let {
		userName = 'User',
		userAvatar = '😎',
		leftItems = [],
		rightItems = [],
		footer
	}: Props = $props();

	function handleItemClick(item: StartMenuItem) {
		item.action?.();
		taskbar.closeStartMenu();
	}
</script>

<svelte:window
	onclick={(e) => {
		const target = e.target as HTMLElement;
		if (!target.closest('.start-menu') && !target.closest('.start-button')) {
			taskbar.closeStartMenu();
		}
	}}
/>

{#if taskbar.startMenuOpen}
	<div
		class="start-menu"
		class:win98={theme.version === 'win98'}
		class:xp={theme.version === 'xp'}
		class:vista={theme.version === 'vista'}
		role="menu"
	>
		{#if theme.version === 'win98'}
			<!-- Win98: Vertical sidebar + single column -->
			<div class="win98-layout">
				<div class="win98-sidebar">
					<span class="win98-sidebar-text">Windows<span class="win98-98">98</span></span>
				</div>
				<div class="win98-items">
					{#each leftItems as item}
						{#if item.separator}
							<div class="start-separator"></div>
						{:else}
							<button class="start-menu-item" role="menuitem" onclick={() => handleItemClick(item)}>
								<span class="sm-icon">{item.icon}</span>
								<span class:sm-bold={item.bold} class:sm-normal={!item.bold}>{item.label}</span>
							</button>
						{/if}
					{/each}
					<div class="start-separator"></div>
					{#each rightItems as item}
						{#if item.separator}
							<div class="start-separator"></div>
						{:else}
							<button class="start-menu-item" role="menuitem" onclick={() => handleItemClick(item)}>
								<span class="sm-icon">{item.icon}</span>
								<span class:sm-bold={item.bold} class:sm-normal={!item.bold}>{item.label}</span>
							</button>
						{/if}
					{/each}
				</div>
			</div>
			{#if footer}
				<div class="start-menu-footer">
					{@render footer()}
				</div>
			{/if}
		{:else}
			<!-- XP / Vista: Header + two-column layout -->
			<div class="start-menu-header">
				<span class="user-avatar">{userAvatar}</span>
				<span class="user-name">{userName}</span>
			</div>
			<div class="start-menu-body">
				<div class="start-menu-left">
					{#each leftItems as item}
						{#if item.separator}
							<div class="start-separator"></div>
						{:else}
							<button class="start-menu-item" role="menuitem" onclick={() => handleItemClick(item)}>
								<span class="sm-icon">{item.icon}</span>
								<span class:sm-bold={item.bold} class:sm-normal={!item.bold}>{item.label}</span>
							</button>
						{/if}
					{/each}
				</div>
				<div class="start-menu-right">
					{#each rightItems as item}
						{#if item.separator}
							<div class="start-separator"></div>
						{:else}
							<button class="start-menu-item" role="menuitem" onclick={() => handleItemClick(item)}>
								<span class="sm-icon">{item.icon}</span>
								<span class:sm-bold={item.bold} class:sm-normal={!item.bold}>{item.label}</span>
							</button>
						{/if}
					{/each}
				</div>
			</div>
			{#if footer}
				<div class="start-menu-footer">
					{@render footer()}
				</div>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.start-menu {
		position: fixed;
		bottom: var(--taskbar-height, 30px);
		left: 0;
		width: 380px;
		background: var(--startmenu-bg, #ece9d8);
		border: var(--startmenu-border, 2px solid #0054e3);
		border-bottom: none;
		border-radius: var(--startmenu-radius, 8px 8px 0 0);
		box-shadow: var(--startmenu-shadow, 3px -3px 10px rgba(0, 0, 0, 0.35));
		z-index: 10000;
		overflow: hidden;
	}

	/* ========= XP / Vista header ========= */
	.start-menu-header {
		height: 54px;
		background: var(--startmenu-header-bg);
		display: flex;
		align-items: center;
		padding: 0 10px;
		gap: 10px;
	}

	.user-avatar {
		width: 42px;
		height: 42px;
		background: linear-gradient(135deg, #e8a040, #d08030);
		border-radius: 4px;
		border: 2px solid white;
		box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
	}

	.user-name {
		color: var(--startmenu-header-color, #fff);
		font-size: 14px;
		font-weight: bold;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	/* ========= Two-column body (XP/Vista) ========= */
	.start-menu-body {
		display: flex;
		min-height: 300px;
	}

	.start-menu-left {
		flex: 1;
		background: white;
		padding: 6px 0;
		border-right: 1px solid var(--startmenu-separator, #d6d0c4);
	}

	.start-menu-right {
		width: 160px;
		background: #d3e5fa;
		padding: 6px 0;
	}

	.vista .start-menu-left {
		background: rgba(255, 255, 255, 0.92);
	}

	.vista .start-menu-right {
		background: rgba(200, 215, 240, 0.85);
	}

	/* ========= Win98: 3D border + vertical sidebar ========= */
	.win98 {
		width: 320px;
		border: none;
		border-top: var(--startmenu-border-top);
		border-left: var(--startmenu-border-left);
		border-bottom: var(--startmenu-border-bottom);
		border-right: var(--startmenu-border-right);
		border-radius: 0;
		box-shadow: var(--startmenu-shadow);
	}

	.win98-layout {
		display: flex;
		min-height: 300px;
	}

	.win98-sidebar {
		width: 22px;
		background: linear-gradient(180deg, #000080 0%, #1084d0 100%);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 6px;
		flex-shrink: 0;
	}

	.win98-sidebar-text {
		writing-mode: vertical-lr;
		transform: rotate(180deg);
		color: white;
		font-family: Arial, sans-serif;
		font-size: 16px;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.win98-98 {
		color: #fff;
		font-weight: 900;
	}

	.win98-items {
		flex: 1;
		padding: 2px 0;
		background: #c0c0c0;
	}

	.win98 .start-menu-footer {
		background: #c0c0c0;
		border-top: 1px solid #808080;
	}

	/* ========= Shared menu items ========= */
	.start-menu-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 12px;
		cursor: pointer;
		height: 32px;
		font-size: var(--font-size, 11px);
		font-family: var(--font-family, Tahoma, sans-serif);
		background: transparent;
		border: none;
		width: 100%;
		text-align: left;
		color: inherit;
	}

	.start-menu-item:hover {
		background: var(--startmenu-item-hover-bg, #316ac5);
		color: var(--startmenu-item-hover-color, #fff);
	}

	.sm-icon {
		width: 24px;
		height: 24px;
		font-size: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.sm-bold { font-weight: bold; }
	.sm-normal { font-weight: normal; }

	.start-separator {
		height: 1px;
		background: var(--startmenu-separator, #d6d0c4);
		margin: 3px 12px;
	}

	/* Win98 separator is full-width etched */
	.win98 .start-separator {
		margin: 3px 2px;
		height: 2px;
		background: none;
		border-top: 1px solid #808080;
		border-bottom: 1px solid #fff;
	}

	/* ========= Footer ========= */
	.start-menu-footer {
		height: 34px;
		background: linear-gradient(180deg, #3a87f0 0%, #0054e3 100%);
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 10px;
		gap: 10px;
	}

	.vista .start-menu-footer {
		background: linear-gradient(180deg, rgba(50, 80, 150, 0.92), rgba(30, 50, 100, 0.96));
		backdrop-filter: blur(8px);
	}
</style>
