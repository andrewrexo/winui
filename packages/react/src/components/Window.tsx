import React, { useState, useEffect, useRef } from 'react';
import { TitleBar } from './TitleBar';
import { wm } from '../state/windows';
import { theme } from '../state/theme';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';

interface WindowProps {
  id: string;
  title: string;
  icon?: string;
  active?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  z?: number;
  minimized?: boolean;
  maximized?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Window({
  id,
  title,
  icon = '',
  active = false,
  x = 100,
  y = 100,
  width = 500,
  height = 380,
  z = 100,
  minimized = false,
  maximized = false,
  className = '',
  children,
}: WindowProps) {
  const [animating, setAnimating] = useState<'minimize' | 'restore' | null>(null);
  const wasMinimized = useRef(minimized);
  const version = theme.version;

  useEffect(() => {
    if (minimized && !wasMinimized.current) {
      setAnimating('minimize');
      const timer = setTimeout(() => setAnimating(null), 200);
      return () => clearTimeout(timer);
    } else if (!minimized && wasMinimized.current) {
      setAnimating('restore');
      const timer = setTimeout(() => setAnimating(null), 200);
      return () => clearTimeout(timer);
    }
    wasMinimized.current = minimized;
  }, [minimized]);

  const shouldRender = !minimized || animating === 'minimize';

  const dragRef = useDraggable({
    handle: '.title-bar',
    disabled: maximized,
    onDragEnd: (nx, ny) => wm.move(id, nx, ny),
  });

  const resizeRef = useResizable({
    disabled: maximized,
    onResize: (nx, ny, nw, nh) => wm.resize(id, nx, ny, nw, nh),
  });

  // Merge refs
  const mergedRef = (el: HTMLDivElement | null) => {
    (dragRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    (resizeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  if (!shouldRender) return null;

  const classes = [
    'xp-window',
    className,
    active && 'active',
    maximized && 'maximized',
    animating === 'minimize' && 'minimizing',
    animating === 'restore' && 'restoring',
    version,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={mergedRef}
      className={classes}
      style={{ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px`, zIndex: z }}
      role="dialog"
      aria-label={title}
      onMouseDown={() => wm.activate(id)}
    >
      <TitleBar
        title={title}
        icon={icon}
        active={active}
        onMinimize={() => wm.minimize(id)}
        onMaximize={() => wm.toggleMaximize(id)}
        onClose={() => wm.close(id)}
      />
      <div className="window-content">
        {children}
      </div>
    </div>
  );
}
