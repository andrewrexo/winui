import React, { useState, useRef, useEffect } from 'react';
import { taskbar, useTaskbar } from '../state/taskbar';
import { theme } from '../state/theme';

export interface StartMenuItem {
  icon: string;
  label: string;
  bold?: boolean;
  action?: () => void;
  separator?: boolean;
  children?: StartMenuItem[];
}

interface StartMenuProps {
  userName?: string;
  userAvatar?: string;
  leftItems?: StartMenuItem[];
  rightItems?: StartMenuItem[];
  footer?: React.ReactNode;
}

export function StartMenu({
  userName = 'User',
  userAvatar = '😎',
  leftItems = [],
  rightItems = [],
  footer,
}: StartMenuProps) {
  const { startMenuOpen } = useTaskbar();
  const version = theme.version;
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const submenuTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('.start-menu') && !target.closest('.start-button')) {
        taskbar.closeStartMenu();
        setOpenSubmenus(new Set());
      }
    }
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  function handleItemClick(item: StartMenuItem) {
    if (item.children && item.children.length > 0) return;
    item.action?.();
    setOpenSubmenus(new Set());
    taskbar.closeStartMenu();
  }

  function handleItemHover(item: StartMenuItem, siblings: StartMenuItem[]) {
    for (const [, timer] of submenuTimers.current) clearTimeout(timer);
    submenuTimers.current.clear();

    const siblingLabels = siblings.filter(s => s.children && s.label !== item.label).map(s => s.label);

    setOpenSubmenus(prev => {
      const next = new Set(prev);
      for (const label of siblingLabels) next.delete(label);
      if (item.children) {
        next.add(item.label);
      } else {
        const timer = setTimeout(() => {
          setOpenSubmenus(prev2 => {
            const n = new Set(prev2);
            for (const label of siblingLabels) n.delete(label);
            return n;
          });
        }, 300);
        submenuTimers.current.set(item.label, timer);
      }
      return next;
    });
  }

  function handleSubmenuEnter() {
    for (const [, timer] of submenuTimers.current) clearTimeout(timer);
    submenuTimers.current.clear();
  }

  function renderMenuItem(item: StartMenuItem, siblings: StartMenuItem[], key: number) {
    if (item.separator) return <div key={key} className="start-separator" />;
    return (
      <div key={key} className="sm-item-wrapper" onMouseEnter={() => handleItemHover(item, siblings)}>
        <button className="start-menu-item" role="menuitem" onClick={() => handleItemClick(item)}>
          <span className="sm-icon">{item.icon}</span>
          <span className={item.bold ? 'sm-bold' : 'sm-normal'}>{item.label}</span>
          {item.children && item.children.length > 0 && <span className="sm-arrow">▸</span>}
        </button>
        {item.children && openSubmenus.has(item.label) && (
          <div className="sm-submenu" onMouseEnter={handleSubmenuEnter}>
            {item.children.map((child, i) => renderMenuItem(child, item.children!, i))}
          </div>
        )}
      </div>
    );
  }

  if (!startMenuOpen) return null;

  return (
    <div className={`start-menu ${version}`} role="menu">
      {version === 'win98' ? (
        <>
          <div className="win98-layout">
            <div className="win98-sidebar">
              <span className="win98-sidebar-text">Windows<span className="win98-98">98</span></span>
            </div>
            <div className="win98-items">
              {leftItems.map((item, i) => renderMenuItem(item, leftItems, i))}
              <div className="start-separator" />
              {rightItems.map((item, i) => renderMenuItem(item, rightItems, i + 1000))}
            </div>
          </div>
          {footer && <div className="start-menu-footer">{footer}</div>}
        </>
      ) : (
        <>
          <div className="start-menu-header">
            <span className="user-avatar">{userAvatar}</span>
            <span className="user-name">{userName}</span>
          </div>
          <div className="start-menu-body">
            <div className="start-menu-left">
              {leftItems.map((item, i) => renderMenuItem(item, leftItems, i))}
            </div>
            <div className="start-menu-right">
              {rightItems.map((item, i) => renderMenuItem(item, rightItems, i))}
            </div>
          </div>
          {footer && <div className="start-menu-footer">{footer}</div>}
        </>
      )}
    </div>
  );
}
