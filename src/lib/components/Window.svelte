<script lang="ts">
	import type { Snippet } from 'svelte';
	import TitleBar from './TitleBar.svelte';
	import { draggable } from '../actions/draggable.js';
	import { resizable } from '../actions/resizable.js';
	import { wm } from '../state/windows.svelte.js';
	import { theme } from '../state/theme.svelte.js';

	interface Props {
		id: string;
		title: string;
		icon?: string;
		active?: boolean;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		z?: number;
		minimized?: boolean;
		maximized?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		id,
		title,
		icon = '',
		active = false,
		x = 100,
		y = 100,
		width = 500,
		height = 380,
		z = 100,
		minimized = false,
		maximized = false,
		class: extraClass = '',
		children
	}: Props = $props();

	// Minimize animation state
	let animating = $state<'minimize' | 'restore' | null>(null);
	let wasMinimized = $state(minimized);

	$effect(() => {
		if (minimized && !wasMinimized) {
			// Going minimized — play shrink animation then hide
			animating = 'minimize';
			setTimeout(() => { animating = null; }, 200);
		} else if (!minimized && wasMinimized) {
			// Restoring — play grow animation
			animating = 'restore';
			setTimeout(() => { animating = null; }, 200);
		}
		wasMinimized = minimized;
	});

	let shouldRender = $derived(!minimized || animating === 'minimize');
</script>

{#if shouldRender}
	<div
		class="xp-window {extraClass}"
		class:active
		class:maximized
		class:minimizing={animating === 'minimize'}
		class:restoring={animating === 'restore'}
		class:win98={theme.version === 'win98'}
		class:xp={theme.version === 'xp'}
		class:vista={theme.version === 'vista'}
		style="left:{x}px;top:{y}px;width:{width}px;height:{height}px;z-index:{z};"
		role="dialog"
		aria-label={title}
		onmousedown={() => wm.activate(id)}
		use:draggable={{
			handle: '.title-bar',
			disabled: maximized,
			onDragEnd: (nx, ny) => wm.move(id, nx, ny)
		}}
		use:resizable={{
			disabled: maximized,
			onResize: (nx, ny, nw, nh) => wm.resize(id, nx, ny, nw, nh)
		}}
	>
		<TitleBar
			{title}
			{icon}
			{active}
			onminimize={() => wm.minimize(id)}
			onmaximize={() => wm.toggleMaximize(id)}
			onclose={() => wm.close(id)}
		/>
		<div class="window-content">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.xp-window {
		position: absolute;
		background: var(--win-face, #ece9d8);
		border-radius: var(--win-radius, 8px 8px 0 0);
		box-shadow: var(--win-shadow, 2px 2px 8px rgba(0, 0, 0, 0.35));
		min-width: 200px;
		min-height: 100px;
		display: flex;
		flex-direction: column;
		overflow: visible;
		border: var(--win-border, 3px solid #0054e3);
		transform-origin: bottom left;
	}

	/* Minimize animation: shrink toward taskbar */
	.minimizing {
		animation: minimizeAnim 0.2s ease-in forwards;
		pointer-events: none;
	}

	/* Restore animation: grow from taskbar */
	.restoring {
		animation: restoreAnim 0.2s ease-out forwards;
	}

	@keyframes minimizeAnim {
		0% { transform: scale(1); opacity: 1; }
		100% { transform: scale(0.1) translateY(100vh); opacity: 0; }
	}

	@keyframes restoreAnim {
		0% { transform: scale(0.1) translateY(100vh); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}

	.xp-window.maximized {
		top: 0 !important;
		left: 0 !important;
		width: 100% !important;
		height: 100% !important;
		border-radius: 0;
	}

	.window-content {
		flex: 1;
		overflow: auto;
		background: var(--win-content-bg, white);
		border: var(--win-content-border, none);
	}

	/* Win98: 3D outset border */
	.win98 {
		border: none;
		border-top: var(--win-border-top, 2px solid #dfdfdf);
		border-left: var(--win-border-left, 2px solid #dfdfdf);
		border-bottom: var(--win-border-bottom, 2px solid #404040);
		border-right: var(--win-border-right, 2px solid #404040);
		outline: 1px solid #fff;
		outline-offset: -3px;
	}

	.win98 .window-content { margin: 2px; }

	/* XP */
	.xp {
		border: 3px solid #0054e3;
		border-top: none;
	}

	/* Vista: Glass */
	.vista {
		backdrop-filter: blur(12px);
		border: 1px solid rgba(60, 100, 170, 0.5);
	}

	.vista .window-content {
		background: rgba(255, 255, 255, 0.96);
	}
</style>
