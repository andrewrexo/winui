import React from 'react';

interface DesktopIconProps {
  label: string;
  icon: string;
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export function DesktopIcon({
  label,
  icon,
  selected = false,
  onClick,
  onDoubleClick,
  onContextMenu,
}: DesktopIconProps) {
  return (
    <button
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(e); }}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu?.(e); }}
      aria-label={label}
    >
      <span className="icon-img">{icon}</span>
      <span className={`icon-label ${selected ? 'selected' : ''}`}>{label}</span>
    </button>
  );
}
