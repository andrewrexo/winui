import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { ContextMenu } from './ContextMenu';
import { NotificationBalloon } from './NotificationBalloon';
import { wm, useWindowManager } from '../state/windows';
import { desktop, useDesktop } from '../state/desktop';
import { taskbar } from '../state/taskbar';
import { notifications, useNotifications } from '../state/notifications';
import { theme, useTheme } from '../state/theme';
import { THEME_CONFIGS, type ThemeVersion } from '@drewrube/winui-themes';
import type { StartMenuItem } from './StartMenu';
import type { ContextMenuItem } from './ContextMenu';

interface DesktopProps {
  themeVersion?: ThemeVersion;
  wallpaperOverride?: string;
  icons?: React.ReactNode;
  tray?: React.ReactNode;
  startMenuFooter?: React.ReactNode;
  userName?: string;
  userAvatar?: string;
  startMenuLeft?: StartMenuItem[];
  startMenuRight?: StartMenuItem[];
  contextMenuItems?: ContextMenuItem[];
}

export function Desktop({
  themeVersion = 'xp',
  wallpaperOverride,
  icons,
  tray,
  startMenuFooter,
  userName = 'User',
  userAvatar = '😎',
  startMenuLeft = [],
  startMenuRight = [],
  contextMenuItems = [
    { label: 'Arrange Icons By' },
    { label: 'Refresh' },
    { separator: true, label: '' },
    { label: 'Properties' }
  ],
}: DesktopProps) {
  useWindowManager();
  const { contextMenu: ctxMenu } = useDesktop();
  const { notifications: notifs } = useNotifications();
  const { version } = useTheme();

  useEffect(() => {
    theme.set(themeVersion);
    document.documentElement.dataset.theme = themeVersion;
  }, [themeVersion]);

  const wallpaperStyle = useMemo(() => {
    const css = wallpaperOverride ?? THEME_CONFIGS[theme.version].wallpaperCSS;
    const style: Record<string, string> = {};
    css.split(';').forEach(rule => {
      const [prop, ...valParts] = rule.split(':');
      if (prop && valParts.length) {
        const camelProp = prop.trim().replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
        style[camelProp] = valParts.join(':').trim();
      }
    });
    return style;
  }, [wallpaperOverride, version]);

  const [selecting, setSelecting] = useState(false);
  const [selStart, setSelStart] = useState({ x: 0, y: 0 });
  const [selCur, setSelCur] = useState({ x: 0, y: 0 });

  const [altTabOpen, setAltTabOpen] = useState(false);
  const [altTabIndex, setAltTabIndex] = useState(0);
  const metaPressedAlone = useRef(false);
  const altTabOpenRef = useRef(altTabOpen);
  const altTabIndexRef = useRef(altTabIndex);
  altTabOpenRef.current = altTabOpen;
  altTabIndexRef.current = altTabIndex;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key === 'F4') { e.preventDefault(); wm.closeActive(); return; }
      if (e.key === 'Meta' || e.key === 'OS') { metaPressedAlone.current = true; return; }
      if (e.metaKey) metaPressedAlone.current = false;
      if (e.key === 'Escape') { taskbar.closeStartMenu(); desktop.hideContextMenu(); setAltTabOpen(false); return; }
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        if (wm.windows.length === 0) return;
        if (!altTabOpenRef.current) {
          const currentIdx = wm.windows.findIndex(w => w.id === wm.activeId);
          setAltTabIndex((currentIdx + 1) % wm.windows.length);
          setAltTabOpen(true);
        } else {
          setAltTabIndex(prev => (prev + 1) % wm.windows.length);
        }
        return;
      }
      if (e.metaKey && e.key === 'd') {
        e.preventDefault();
        metaPressedAlone.current = false;
        for (const win of wm.windows) win.minimized = true;
        wm.deactivateAll();
        return;
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if ((e.key === 'Meta' || e.key === 'OS') && metaPressedAlone.current) {
        taskbar.toggleStartMenu();
        metaPressedAlone.current = false;
        return;
      }
      if (altTabOpenRef.current && (e.key === 'Alt' || !e.altKey)) {
        const target = wm.windows[altTabIndexRef.current];
        if (target) { target.minimized = false; wm.activate(target.id); }
        setAltTabOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, []);

  function handleDesktopClick() { desktop.clearSelection(); wm.deactivateAll(); }
  function handleContextMenu(e: React.MouseEvent) { e.preventDefault(); desktop.showContextMenu(e.clientX, e.clientY); }

  function handleMouseDown(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('desktop-surface') && !target.classList.contains('icon-grid')) return;
    setSelecting(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setSelStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setSelCur({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!selecting) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSelCur({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const selRect = {
    left: Math.min(selStart.x, selCur.x),
    top: Math.min(selStart.y, selCur.y),
    width: Math.abs(selCur.x - selStart.x),
    height: Math.abs(selCur.y - selStart.y),
  };

  return (
    <div className="desktop-shell" data-theme={version}>
      <div
        className="desktop-surface"
        style={wallpaperStyle}
        role="application"
        aria-label="Desktop"
        onClick={handleDesktopClick}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setSelecting(false)}
      >
        {icons && <div className="icon-grid">{icons}</div>}

        {wm.windows.map(win => (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            active={win.id === wm.activeId}
            x={win.x} y={win.y}
            width={win.width} height={win.height}
            z={win.z}
            minimized={win.minimized}
            maximized={win.maximized}
          >
            <win.component {...win.props} />
          </Window>
        ))}

        {ctxMenu && <ContextMenu items={contextMenuItems} x={ctxMenu.x} y={ctxMenu.y} onClose={() => desktop.hideContextMenu()} />}

        {selecting && selRect.width > 3 && selRect.height > 3 && (
          <div className="selection-rect" style={{ left: selRect.left, top: selRect.top, width: selRect.width, height: selRect.height }} />
        )}

        {altTabOpen && wm.windows.length > 0 && (
          <div className="alt-tab-overlay">
            <div className="alt-tab-box">
              {wm.windows.map((win, i) => (
                <div key={win.id} className={`alt-tab-item ${i === altTabIndex ? 'selected' : ''}`}>
                  <span className="alt-tab-icon">{win.icon}</span>
                </div>
              ))}
              <div className="alt-tab-label">{wm.windows[altTabIndex]?.title ?? ''}</div>
            </div>
          </div>
        )}
      </div>

      <StartMenu userName={userName} userAvatar={userAvatar} leftItems={startMenuLeft} rightItems={startMenuRight} footer={startMenuFooter} />
      <Taskbar tray={tray} />

      {notifications.notifications.map(notif => (
        <NotificationBalloon key={notif.id} title={notif.title} message={notif.message} icon={notif.icon} onClose={() => notifications.dismiss(notif.id)} />
      ))}
    </div>
  );
}
