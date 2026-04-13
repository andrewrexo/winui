import React, { useState, useEffect } from 'react';
import { ContextMenu } from './ContextMenu';
import type { ContextMenuItem } from './ContextMenu';
import { wm, useWindowManager } from '../state/windows';
import { taskbar } from '../state/taskbar';
import { theme } from '../state/theme';

interface TaskbarProps {
  tray?: React.ReactNode;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function Taskbar({ tray }: TaskbarProps) {
  useWindowManager(); // subscribe to changes
  const version = theme.version;

  const [clock, setClock] = useState('');
  const [dateString, setDateString] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [itemCtxMenu, setItemCtxMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);

  useEffect(() => {
    function tick() {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      setClock(`${h}:${m} ${ampm}`);
      setDateString(`${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = () => setShowCalendar(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  function handleItemContextMenu(e: React.MouseEvent, windowId: string) {
    e.preventDefault();
    e.stopPropagation();
    setItemCtxMenu({
      x: e.clientX,
      y: e.clientY - 120,
      items: [
        { label: 'Restore', action: () => { const w = wm.windows.find(w => w.id === windowId); if (w) { w.minimized = false; wm.activate(windowId); } } },
        { label: 'Minimize', action: () => wm.minimize(windowId) },
        { label: 'Maximize', action: () => wm.toggleMaximize(windowId) },
        { label: '', separator: true },
        { label: 'Close', action: () => wm.close(windowId) },
      ]
    });
  }

  return (
    <div className={`taskbar ${version}`}>
      <button
        className={`start-button ${taskbar.startMenuOpen ? 'open' : ''}`}
        onClick={() => taskbar.toggleStartMenu()}
      >
        <span className="start-flag">
          <span className="windows-logo">
            <span className="wr" /><span className="wg" />
            <span className="wb" /><span className="wy" />
          </span>
        </span>
        {version !== 'vista' && (
          <span className="start-label">{version === 'win98' ? 'Start' : 'start'}</span>
        )}
      </button>

      {version === 'win98' && <div className="win98-divider" />}

      <div className="taskbar-items">
        {wm.taskbarItems.map((item) => (
          <button
            key={item.id}
            className={`taskbar-item ${item.active ? 'active' : ''}`}
            onClick={() => wm.taskbarClick(item.id)}
            onContextMenu={(e) => handleItemContextMenu(e, item.id)}
            title={item.title}
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-title">{item.title}</span>
          </button>
        ))}
      </div>

      <div className="system-tray">
        {tray}
        <button
          className="clock"
          title={dateString}
          onClick={(e) => { e.stopPropagation(); setShowCalendar(prev => !prev); }}
        >
          {clock}
        </button>
        {showCalendar && (
          <div className="calendar-popup" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="cal-header">{dateString}</div>
            <div className="cal-time">{clock}</div>
          </div>
        )}
      </div>

      {itemCtxMenu && (
        <ContextMenu items={itemCtxMenu.items} x={itemCtxMenu.x} y={itemCtxMenu.y} onClose={() => setItemCtxMenu(null)} />
      )}
    </div>
  );
}
