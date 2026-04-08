import type { Action } from 'svelte/action';

export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface ResizableOptions {
	/** Size of the invisible grab zone in px */
	edgeSize?: number;
	/** Minimum width */
	minWidth?: number;
	/** Minimum height */
	minHeight?: number;
	/** Called during resize with new bounds */
	onResize?: (x: number, y: number, w: number, h: number) => void;
	/** Disabled when maximized */
	disabled?: boolean;
}

const CURSORS: Record<ResizeEdge, string> = {
	n: 'ns-resize', s: 'ns-resize',
	e: 'ew-resize', w: 'ew-resize',
	ne: 'nesw-resize', sw: 'nesw-resize',
	nw: 'nwse-resize', se: 'nwse-resize',
};

/**
 * Svelte action: adds invisible edge/corner resize zones to a positioned element.
 * The element must have `position: absolute` and explicit `left/top/width/height`.
 */
export const resizable: Action<HTMLElement, ResizableOptions> = (
	node: HTMLElement,
	options: ResizableOptions = {}
) => {
	let opts = options;
	let edge: ResizeEdge | null = null;
	let startX = 0, startY = 0;
	let origLeft = 0, origTop = 0, origW = 0, origH = 0;

	const sz = () => opts.edgeSize ?? 6;
	const minW = () => opts.minWidth ?? 200;
	const minH = () => opts.minHeight ?? 100;

	function detectEdge(e: MouseEvent): ResizeEdge | null {
		const rect = node.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const s = sz();
		const atN = y < s;
		const atS = y > rect.height - s;
		const atW = x < s;
		const atE = x > rect.width - s;
		if (atN && atW) return 'nw';
		if (atN && atE) return 'ne';
		if (atS && atW) return 'sw';
		if (atS && atE) return 'se';
		if (atN) return 'n';
		if (atS) return 's';
		if (atW) return 'w';
		if (atE) return 'e';
		return null;
	}

	function onMouseMove(e: MouseEvent) {
		if (opts.disabled) return;

		if (edge) {
			// Currently resizing
			const dx = e.clientX - startX;
			const dy = e.clientY - startY;
			let newX = origLeft, newY = origTop, newW = origW, newH = origH;

			if (edge.includes('e')) newW = Math.max(minW(), origW + dx);
			if (edge.includes('s')) newH = Math.max(minH(), origH + dy);
			if (edge.includes('w')) {
				const dw = Math.min(dx, origW - minW());
				newX = origLeft + dw;
				newW = origW - dw;
			}
			if (edge.includes('n')) {
				const dh = Math.min(dy, origH - minH());
				newY = origTop + dh;
				newH = origH - dh;
			}

			node.style.left = `${newX}px`;
			node.style.top = `${newY}px`;
			node.style.width = `${newW}px`;
			node.style.height = `${newH}px`;
			opts.onResize?.(newX, newY, newW, newH);
			return;
		}

		// Hover — update cursor
		const detected = detectEdge(e);
		node.style.cursor = detected ? CURSORS[detected] : '';
	}

	function onMouseDown(e: MouseEvent) {
		if (opts.disabled) return;
		const detected = detectEdge(e);
		if (!detected) return;

		// Don't start resize if target is inside the window content
		const target = e.target as HTMLElement;
		if (target.closest('.window-content') || target.closest('.title-bar')) return;

		edge = detected;
		startX = e.clientX;
		startY = e.clientY;
		origLeft = node.offsetLeft;
		origTop = node.offsetTop;
		origW = node.offsetWidth;
		origH = node.offsetHeight;

		document.body.style.cursor = CURSORS[edge];
		window.addEventListener('mousemove', onGlobalMove);
		window.addEventListener('mouseup', onMouseUp);
		e.preventDefault();
		e.stopPropagation();
	}

	function onGlobalMove(e: MouseEvent) {
		if (!edge) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		let newX = origLeft, newY = origTop, newW = origW, newH = origH;

		if (edge.includes('e')) newW = Math.max(minW(), origW + dx);
		if (edge.includes('s')) newH = Math.max(minH(), origH + dy);
		if (edge.includes('w')) {
			const dw = Math.min(dx, origW - minW());
			newX = origLeft + dw;
			newW = origW - dw;
		}
		if (edge.includes('n')) {
			const dh = Math.min(dy, origH - minH());
			newY = origTop + dh;
			newH = origH - dh;
		}

		node.style.left = `${newX}px`;
		node.style.top = `${newY}px`;
		node.style.width = `${newW}px`;
		node.style.height = `${newH}px`;
		opts.onResize?.(newX, newY, newW, newH);
	}

	function onMouseUp() {
		edge = null;
		document.body.style.cursor = '';
		window.removeEventListener('mousemove', onGlobalMove);
		window.removeEventListener('mouseup', onMouseUp);
	}

	// Edge hover detection on the window frame itself
	node.addEventListener('mousemove', onMouseMove);
	node.addEventListener('mousedown', onMouseDown);

	return {
		update(newOpts: ResizableOptions) { opts = newOpts; },
		destroy() {
			node.removeEventListener('mousemove', onMouseMove);
			node.removeEventListener('mousedown', onMouseDown);
			window.removeEventListener('mousemove', onGlobalMove);
			window.removeEventListener('mouseup', onMouseUp);
		}
	};
};
