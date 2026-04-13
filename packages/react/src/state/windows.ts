import { useSyncExternalStore } from 'react';
import type { ComponentType } from 'react';

export interface WindowState {
  readonly id: string;
  title: string;
  icon: string;
  component: ComponentType<any>;
  props: Record<string, unknown>;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export interface WindowOpenConfig<TProps extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  title: string;
  icon: string;
  component: ComponentType<TProps>;
  props?: TProps;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface TaskbarItemState {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly minimized: boolean;
  readonly active: boolean;
}

class WindowManager {
  private _windows: WindowState[] = [];
  private _activeId: string | null = null;
  private _zCounter = 100;
  private _listeners = new Set<() => void>();
  private _snapshot = { windows: [] as WindowState[], activeId: null as string | null };

  onEvent?: (event: 'minimize' | 'maximize' | 'close' | 'open', id: string) => void;

  private _notify() {
    this._snapshot = { windows: [...this._windows], activeId: this._activeId };
    this._listeners.forEach(l => l());
  }

  subscribe = (listener: () => void) => {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  };

  getSnapshot = () => this._snapshot;

  get windows() { return this._windows; }
  get activeId() { return this._activeId; }

  get visibleWindows(): readonly WindowState[] {
    return this._windows.filter(w => !w.minimized);
  }

  get taskbarItems(): readonly TaskbarItemState[] {
    return this._windows.map(w => ({
      id: w.id, title: w.title, icon: w.icon,
      minimized: w.minimized,
      active: w.id === this._activeId && !w.minimized
    }));
  }

  open<TProps extends Record<string, unknown> = Record<string, unknown>>(config: WindowOpenConfig<TProps>): void {
    const existing = this._windows.find(w => w.id === config.id);
    if (existing) { existing.minimized = false; this.activate(config.id); return; }
    this._zCounter++;
    const win: WindowState = {
      id: config.id, title: config.title, icon: config.icon,
      component: config.component as ComponentType<any>,
      props: (config.props ?? {}) as Record<string, unknown>,
      x: config.x ?? 80 + Math.random() * 200,
      y: config.y ?? 40 + Math.random() * 100,
      width: config.width ?? 500, height: config.height ?? 380,
      z: this._zCounter, minimized: false, maximized: false
    };
    this._windows.push(win);
    this.activate(config.id);
    this.onEvent?.('open', config.id);
  }

  close(id: string): void {
    const idx = this._windows.findIndex(w => w.id === id);
    if (idx !== -1) { this._windows.splice(idx, 1); this.onEvent?.('close', id); }
    if (this._activeId === id) this._activeId = null;
    this._notify();
  }

  activate(id: string): void {
    this._zCounter++;
    const win = this._windows.find(w => w.id === id);
    if (win) { win.z = this._zCounter; this._activeId = id; }
    this._notify();
  }

  minimize(id: string): void {
    const win = this._windows.find(w => w.id === id);
    if (win) { win.minimized = true; if (this._activeId === id) this._activeId = null; this.onEvent?.('minimize', id); }
    this._notify();
  }

  toggleMaximize(id: string): void {
    const win = this._windows.find(w => w.id === id);
    if (win) { win.maximized = !win.maximized; this.onEvent?.('maximize', id); }
    this._notify();
  }

  taskbarClick(id: string): void {
    const win = this._windows.find(w => w.id === id);
    if (!win) return;
    if (win.minimized) { win.minimized = false; this.activate(id); }
    else if (this._activeId === id) { this.minimize(id); }
    else { this.activate(id); }
  }

  deactivateAll(): void { this._activeId = null; this._notify(); }

  move(id: string, x: number, y: number): void {
    const win = this._windows.find(w => w.id === id);
    if (win) { win.x = x; win.y = y; }
    this._notify();
  }

  resize(id: string, x: number, y: number, width: number, height: number): void {
    const win = this._windows.find(w => w.id === id);
    if (win) { win.x = x; win.y = y; win.width = Math.max(200, width); win.height = Math.max(100, height); }
    this._notify();
  }

  closeActive(): void { if (this._activeId) this.close(this._activeId); }
}

export const wm = new WindowManager();

export function useWindowManager() {
  const snapshot = useSyncExternalStore(wm.subscribe, wm.getSnapshot);
  return { ...snapshot, wm };
}
