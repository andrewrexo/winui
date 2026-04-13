import { useSyncExternalStore } from 'react';
import { THEME_CONFIGS, type ThemeVersion, type ThemeConfig } from '@drewrube/winui-themes';

class ThemeState {
  private _version: ThemeVersion = 'xp';
  private _listeners = new Set<() => void>();

  private _notify() { this._listeners.forEach(l => l()); }

  subscribe = (listener: () => void) => {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  };

  getSnapshot = (): ThemeVersion => this._version;

  get version() { return this._version; }
  get config(): ThemeConfig { return THEME_CONFIGS[this._version]; }

  set(version: ThemeVersion) { this._version = version; this._notify(); }

  cycle() {
    const versions: ThemeVersion[] = ['win98', 'xp', 'vista'];
    const idx = versions.indexOf(this._version);
    this._version = versions[(idx + 1) % versions.length];
    this._notify();
  }
}

export const theme = new ThemeState();

export function useTheme() {
  const version = useSyncExternalStore(theme.subscribe, theme.getSnapshot);
  return { version, config: THEME_CONFIGS[version], theme };
}
