import React, { useEffect } from 'react';

export interface ContextMenuItem {
  label: string;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  x: number;
  y: number;
  onClose?: () => void;
}

export function ContextMenu({ items, x, y, onClose }: ContextMenuProps) {
  useEffect(() => {
    const handler = () => onClose?.();
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [onClose]);

  function handleClick(item: ContextMenuItem) {
    if (item.disabled) return;
    item.action?.();
    onClose?.();
  }

  return (
    <div
      className="context-menu"
      style={{ left: `${x}px`, top: `${y}px` }}
      role="menu"
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, i) =>
        item.separator ? (
          <div key={i} className="ctx-sep" role="separator" />
        ) : (
          <button
            key={i}
            className={`ctx-item ${item.disabled ? 'disabled' : ''}`}
            role="menuitem"
            aria-disabled={item.disabled}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
