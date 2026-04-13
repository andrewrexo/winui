import { useSyncExternalStore } from 'react';

export interface DesktopIconConfig {
  id: string;
  label: string;
  icon: string;
  appId: string;
}

class DesktopState {
  private _selectedIconId: string | null = null;
  private _contextMenu: { x: number; y: number } | null = null;
  private _listeners = new Set<() => void>();
  private _snapshot = { selectedIconId: null as string | null, contextMenu: null as { x: number; y: number } | null };

  private _notify() {
    this._snapshot = { selectedIconId: this._selectedIconId, contextMenu: this._contextMenu };
    this._listeners.forEach(l => l());
  }

  subscribe = (listener: () => void) => {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  };

  getSnapshot = () => this._snapshot;

  get selectedIconId() { return this._selectedIconId; }
  get contextMenu() { return this._contextMenu; }

  selectIcon(id: string) { this._selectedIconId = id; this._notify(); }
  clearSelection() { this._selectedIconId = null; this._notify(); }
  showContextMenu(x: number, y: number) { this._contextMenu = { x, y }; this._notify(); }
  hideContextMenu() { this._contextMenu = null; this._notify(); }
}

export const desktop = new DesktopState();

export function useDesktop() {
  const snapshot = useSyncExternalStore(desktop.subscribe, desktop.getSnapshot);
  return { ...snapshot, desktop };
}
