import type { Action } from 'svelte/action';

export interface DraggableOptions {
	/** CSS selector for the drag handle within the node (defaults to the node itself) */
	handle?: string;
	/** Called when a drag begins */
	onDragStart?: (x: number, y: number) => void;
	/** Called during drag with the current position */
	onDrag?: (x: number, y: number) => void;
	/** Called when a drag ends with the final position */
	onDragEnd?: (x: number, y: number) => void;
	/** Disables dragging when true */
	disabled?: boolean;
}

/**
 * Svelte action that makes an absolutely-positioned element draggable.
 *
 * @example
 * ```svelte
 * <div use:draggable={{ handle: '.title-bar', onDragEnd: (x, y) => wm.move(id, x, y) }}>
 *   <div class="title-bar">Drag me</div>
 *   <div class="content">...</div>
 * </div>
 * ```
 */
export const draggable: Action<HTMLElement, DraggableOptions> = (
	node: HTMLElement,
	options: DraggableOptions = {}
) => {
	let currentOptions = options;
	let startX = 0;
	let startY = 0;
	let origLeft = 0;
	let origTop = 0;
	let isDragging = false;

	function getHandle(): HTMLElement {
		if (currentOptions.handle) {
			return node.querySelector(currentOptions.handle) ?? node;
		}
		return node;
	}

	function onMouseDown(e: MouseEvent) {
		if (currentOptions.disabled) return;
		const target = e.target as HTMLElement;
		if (target.closest('button') || target.closest('input') || target.closest('select')) return;

		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;
		origLeft = node.offsetLeft;
		origTop = node.offsetTop;

		currentOptions.onDragStart?.(origLeft, origTop);

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		e.preventDefault();
	}

	function onMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		const newX = origLeft + (e.clientX - startX);
		const newY = origTop + (e.clientY - startY);
		node.style.left = `${newX}px`;
		node.style.top = `${newY}px`;
		currentOptions.onDrag?.(newX, newY);
	}

	function onMouseUp(e: MouseEvent) {
		if (!isDragging) return;
		isDragging = false;
		const finalX = origLeft + (e.clientX - startX);
		const finalY = origTop + (e.clientY - startY);
		currentOptions.onDragEnd?.(finalX, finalY);
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
	}

	let handle = getHandle();
	handle.addEventListener('mousedown', onMouseDown);

	return {
		update(newOptions: DraggableOptions) {
			handle.removeEventListener('mousedown', onMouseDown);
			currentOptions = newOptions;
			handle = getHandle();
			handle.addEventListener('mousedown', onMouseDown);
		},
		destroy() {
			handle.removeEventListener('mousedown', onMouseDown);
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		}
	};
};
