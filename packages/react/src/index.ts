// Components
export { Desktop } from './components/Desktop';
export { Window } from './components/Window';
export { TitleBar } from './components/TitleBar';
export { Taskbar } from './components/Taskbar';
export { StartMenu } from './components/StartMenu';
export { DesktopIcon } from './components/DesktopIcon';
export { Button } from './components/Button';
export { ContextMenu } from './components/ContextMenu';
export { ProgressBar } from './components/ProgressBar';
export { TextInput } from './components/TextInput';
export { MenuBar } from './components/MenuBar';
export { Toolbar } from './components/Toolbar';
export { AddressBar } from './components/AddressBar';
export { NotificationBalloon } from './components/NotificationBalloon';

// State
export { wm, useWindowManager } from './state/windows';
export { theme, useTheme } from './state/theme';
export { taskbar, useTaskbar } from './state/taskbar';
export { desktop, useDesktop } from './state/desktop';
export { notifications, useNotifications } from './state/notifications';

// Hooks
export { useDraggable } from './hooks/useDraggable';
export { useResizable } from './hooks/useResizable';

// Types
export type { ThemeVersion, ThemeConfig } from '@drewrube/winui-themes';
export { THEME_CONFIGS } from '@drewrube/winui-themes';
export type { WindowState, WindowOpenConfig, TaskbarItemState } from './state/windows';
export type { DesktopIconConfig } from './state/desktop';
export type { DraggableOptions } from './hooks/useDraggable';
export type { ResizableOptions, ResizeEdge } from './hooks/useResizable';
export type { ContextMenuItem } from './components/ContextMenu';
export type { StartMenuItem } from './components/StartMenu';
export type { MenuDef, MenuItemDef } from './components/MenuBar';
export type { ToolbarButton, ToolbarGroup } from './components/Toolbar';
export type { Notification } from './state/notifications';
