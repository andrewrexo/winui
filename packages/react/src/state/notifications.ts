import { useSyncExternalStore } from 'react';

export interface Notification {
  id: number;
  title: string;
  message: string;
  icon?: string;
}

class NotificationManager {
  private _notifications: Notification[] = [];
  private _nextId = 0;
  private _listeners = new Set<() => void>();
  private _snapshot: readonly Notification[] = [];

  private _notify() {
    this._snapshot = [...this._notifications];
    this._listeners.forEach(l => l());
  }

  subscribe = (listener: () => void) => {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  };

  getSnapshot = (): readonly Notification[] => this._snapshot;

  get notifications() { return this._notifications; }

  show(title: string, message: string, icon?: string): number {
    const id = this._nextId++;
    this._notifications.push({ id, title, message, icon });
    this._notify();
    return id;
  }

  dismiss(id: number) {
    const idx = this._notifications.findIndex(n => n.id === id);
    if (idx !== -1) this._notifications.splice(idx, 1);
    this._notify();
  }

  clear() {
    this._notifications.splice(0, this._notifications.length);
    this._notify();
  }
}

export const notifications = new NotificationManager();

export function useNotifications() {
  const notifs = useSyncExternalStore(notifications.subscribe, notifications.getSnapshot);
  return { notifications: notifs, manager: notifications };
}
