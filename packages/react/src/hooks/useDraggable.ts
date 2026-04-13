import { useEffect, useRef } from 'react';

export interface DraggableOptions {
  handle?: string;
  onDragStart?: (x: number, y: number) => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  disabled?: boolean;
}

export function useDraggable(options: DraggableOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let startX = 0, startY = 0, origLeft = 0, origTop = 0;
    let isDragging = false;

    function getHandle(): HTMLElement {
      if (optsRef.current.handle) {
        return node!.querySelector(optsRef.current.handle) ?? node!;
      }
      return node!;
    }

    function onMouseDown(e: MouseEvent) {
      if (optsRef.current.disabled) return;
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('select')) return;
      isDragging = true;
      startX = e.clientX; startY = e.clientY;
      origLeft = node!.offsetLeft; origTop = node!.offsetTop;
      optsRef.current.onDragStart?.(origLeft, origTop);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      const newX = origLeft + (e.clientX - startX);
      const newY = origTop + (e.clientY - startY);
      node!.style.left = `${newX}px`;
      node!.style.top = `${newY}px`;
      optsRef.current.onDrag?.(newX, newY);
    }

    function onMouseUp(e: MouseEvent) {
      if (!isDragging) return;
      isDragging = false;
      const finalX = origLeft + (e.clientX - startX);
      const finalY = origTop + (e.clientY - startY);
      optsRef.current.onDragEnd?.(finalX, finalY);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    const handle = getHandle();
    handle.addEventListener('mousedown', onMouseDown);

    return () => {
      handle.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [options.handle, options.disabled]);

  return ref;
}
