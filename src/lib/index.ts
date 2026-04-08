// Components
export { default as Desktop } from './components/Desktop.svelte';
export { default as Window } from './components/Window.svelte';
export { default as TitleBar } from './components/TitleBar.svelte';
export { default as Taskbar } from './components/Taskbar.svelte';
export { default as StartMenu } from './components/StartMenu.svelte';
export { default as DesktopIcon } from './components/DesktopIcon.svelte';
export { default as Button } from './components/Button.svelte';
export { default as ContextMenu } from './components/ContextMenu.svelte';
export { default as ProgressBar } from './components/ProgressBar.svelte';
export { default as TextInput } from './components/TextInput.svelte';

// State
export { wm } from './state/windows.svelte.js';
export { theme } from './state/theme.svelte.js';
export { taskbar } from './state/taskbar.svelte.js';
export { desktop } from './state/desktop.svelte.js';

// Actions
export { draggable } from './actions/draggable.js';

// Types
export type { ThemeVersion, ThemeConfig } from './themes/types.js';
export { THEME_CONFIGS } from './themes/types.js';
export type { WindowState, WindowOpenConfig, TaskbarItemState } from './state/windows.svelte.js';
export type { DesktopIconConfig } from './state/desktop.svelte.js';
export type { DraggableOptions } from './actions/draggable.js';
export type { ContextMenuItem } from './components/ContextMenu.svelte';
export type { StartMenuItem } from './components/StartMenu.svelte';
