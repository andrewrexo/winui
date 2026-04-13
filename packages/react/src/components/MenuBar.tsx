import React, { useState, useEffect } from 'react';
import { theme } from '../state/theme';

export interface MenuDef {
  label: string;
  items: MenuItemDef[];
}

export interface MenuItemDef {
  label: string;
  action?: () => void;
  disabled?: boolean;
  checked?: boolean;
  separator?: boolean;
}

interface MenuBarProps {
  menus: MenuDef[];
}

export function MenuBar({ menus }: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const version = theme.version;

  useEffect(() => {
    const handler = () => setOpenMenu(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  function toggle(idx: number) {
    setOpenMenu(prev => prev === idx ? null : idx);
  }

  function handleItemClick(item: MenuItemDef) {
    if (item.disabled) return;
    item.action?.();
    setOpenMenu(null);
  }

  return (
    <div className={`menubar ${version === 'win98' ? 'win98' : ''}`}>
      {menus.map((menu, idx) => (
        <div key={idx} className="menu-wrapper">
          <button
            className={`menu-trigger ${openMenu === idx ? 'open' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggle(idx); }}
          >
            {menu.label}
          </button>
          {openMenu === idx && (
            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
              {menu.items.map((item, i) =>
                item.separator ? (
                  <div key={i} className="dd-sep" />
                ) : (
                  <button
                    key={i}
                    className={`dd-item ${item.disabled ? 'disabled' : ''}`}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.checked !== undefined && (
                      <span className="dd-check">{item.checked ? '✓' : ' '}</span>
                    )}
                    {item.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
