import type { Component } from 'svelte';

/** Describes the runtime state of an open window */
export interface WindowState {
	/** Unique identifier for this window instance */
	readonly id: string;
	/** Display title shown in the title bar and taskbar */
	title: string;
	/** Emoji or icon identifier */
	icon: string;
	/** Svelte component rendered as the window body */
	component: Component<any>;
	/** Props passed to the window body component */
	props: Record<string, unknown>;
	/** Horizontal position in pixels from the left edge of the desktop */
	x: number;
	/** Vertical position in pixels from the top edge of the desktop */
	y: number;
	/** Width of the window in pixels */
	width: number;
	/** Height of the window in pixels */
	height: number;
	/** z-index for stacking order */
	z: number;
	/** Whether the window is minimized to the taskbar */
	minimized: boolean;
	/** Whether the window fills the desktop area */
	maximized: boolean;
}

/**
 * Configuration for opening a new window.
 * Generic parameter `TProps` enables type-safe component props.
 *
 * @example
 * ```ts
 * wm.open<{ url: string }>({
 *   id: 'browser',
 *   title: 'Internet Explorer',
 *   icon: '🌐',
 *   component: InternetExplorer,
 *   props: { url: 'http://example.com' }
 * });
 * ```
 */
export interface WindowOpenConfig<TProps extends Record<string, unknown> = Record<string, unknown>> {
	/** Unique identifier — re-opening the same id activates the existing window */
	id: string;
	/** Display title for title bar and taskbar */
	title: string;
	/** Emoji or icon identifier */
	icon: string;
	/** Svelte component to render as the window body */
	component: Component<TProps>;
	/** Props passed to the window body component */
	props?: TProps;
	/** Initial width in pixels (default: 500) */
	width?: number;
	/** Initial height in pixels (default: 380) */
	height?: number;
	/** Initial horizontal position in pixels */
	x?: number;
	/** Initial vertical position in pixels */
	y?: number;
}

/** Snapshot of a window shown in the taskbar */
export interface TaskbarItemState {
	readonly id: string;
	readonly title: string;
	readonly icon: string;
	readonly minimized: boolean;
	readonly active: boolean;
}

/**
 * Manages all open windows: positions, z-ordering, minimize/maximize state.
 * Exposed as a singleton via `wm`.
 *
 * @example
 * ```ts
 * import { wm } from '@nostalgiazone/winui';
 * wm.open({ id: 'my-app', title: 'Hello', icon: '👋', component: MyApp });
 * ```
 */
class WindowManager {
	windows = $state<WindowState[]>([]);
	activeId = $state<string | null>(null);
	#zCounter = 100;

	/** Optional hook called on window events: 'minimize' | 'maximize' | 'close' | 'open' */
	onEvent?: (event: 'minimize' | 'maximize' | 'close' | 'open', id: string) => void;

	/** All non-minimized windows, for rendering on the desktop */
	get visibleWindows(): readonly WindowState[] {
		return this.windows.filter((w) => !w.minimized);
	}

	/** Derived taskbar item list for the Taskbar component */
	get taskbarItems(): readonly TaskbarItemState[] {
		return this.windows.map((w) => ({
			id: w.id,
			title: w.title,
			icon: w.icon,
			minimized: w.minimized,
			active: w.id === this.activeId && !w.minimized
		}));
	}

	/** Opens a window or brings an existing one to front */
	open<TProps extends Record<string, unknown> = Record<string, unknown>>(
		config: WindowOpenConfig<TProps>
	): void {
		const existing = this.windows.find((w) => w.id === config.id);
		if (existing) {
			existing.minimized = false;
			this.activate(config.id);
			return;
		}

		this.#zCounter++;
		const win: WindowState = {
			id: config.id,
			title: config.title,
			icon: config.icon,
			component: config.component as Component<any>,
			props: (config.props ?? {}) as Record<string, unknown>,
			x: config.x ?? 80 + Math.random() * 200,
			y: config.y ?? 40 + Math.random() * 100,
			width: config.width ?? 500,
			height: config.height ?? 380,
			z: this.#zCounter,
			minimized: false,
			maximized: false
		};

		this.windows.push(win);
		this.activate(config.id);
		this.onEvent?.('open', config.id);
	}

	/** Closes and removes a window */
	close(id: string): void {
		const idx = this.windows.findIndex((w) => w.id === id);
		if (idx !== -1) {
			this.windows.splice(idx, 1);
			this.onEvent?.('close', id);
		}
		if (this.activeId === id) this.activeId = null;
	}

	/** Brings a window to the top of the z-order */
	activate(id: string): void {
		this.#zCounter++;
		const win = this.windows.find((w) => w.id === id);
		if (win) {
			win.z = this.#zCounter;
			this.activeId = id;
		}
	}

	/** Minimizes a window to the taskbar */
	minimize(id: string): void {
		const win = this.windows.find((w) => w.id === id);
		if (win) {
			win.minimized = true;
			if (this.activeId === id) this.activeId = null;
			this.onEvent?.('minimize', id);
		}
	}

	/** Toggles a window between maximized and restored */
	toggleMaximize(id: string): void {
		const win = this.windows.find((w) => w.id === id);
		if (win) {
			win.maximized = !win.maximized;
			this.onEvent?.('maximize', id);
		}
	}

	/** Handles taskbar item click: restore, activate, or minimize */
	taskbarClick(id: string): void {
		const win = this.windows.find((w) => w.id === id);
		if (!win) return;
		if (win.minimized) {
			win.minimized = false;
			this.activate(id);
		} else if (this.activeId === id) {
			this.minimize(id);
		} else {
			this.activate(id);
		}
	}

	/** Deactivates all windows (e.g., when clicking the desktop background) */
	deactivateAll(): void {
		this.activeId = null;
	}

	/** Updates a window's position (called during/after drag) */
	move(id: string, x: number, y: number): void {
		const win = this.windows.find((w) => w.id === id);
		if (win) {
			win.x = x;
			win.y = y;
		}
	}

	/** Updates a window's size and optionally position (called during resize) */
	resize(id: string, x: number, y: number, width: number, height: number): void {
		const win = this.windows.find((w) => w.id === id);
		if (win) {
			win.x = x;
			win.y = y;
			win.width = Math.max(200, width);
			win.height = Math.max(100, height);
		}
	}

	/** Close the currently active window */
	closeActive(): void {
		if (this.activeId) this.close(this.activeId);
	}
}

export const wm = new WindowManager();
