import { useSyncExternalStore } from 'react';

class TaskbarState {
  private _startMenuOpen = false;
  private _listeners = new Set<() => void>();

  private _notify() { this._listeners.forEach(l => l()); }

  subscribe = (listener: () => void) => {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  };

  getSnapshot = () => this._startMenuOpen;

  get startMenuOpen() { return this._startMenuOpen; }

  toggleStartMenu() { this._startMenuOpen = !this._startMenuOpen; this._notify(); }
  closeStartMenu() { this._startMenuOpen = false; this._notify(); }
}

export const taskbar = new TaskbarState();

export function useTaskbar() {
  const startMenuOpen = useSyncExternalStore(taskbar.subscribe, taskbar.getSnapshot);
  return { startMenuOpen, taskbar };
}
