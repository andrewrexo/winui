export interface DesktopIconConfig {
	id: string;
	label: string;
	icon: string;
	appId: string;
}

class DesktopState {
	selectedIconId = $state<string | null>(null);
	contextMenu = $state<{ x: number; y: number } | null>(null);

	selectIcon(id: string) {
		this.selectedIconId = id;
	}

	clearSelection() {
		this.selectedIconId = null;
	}

	showContextMenu(x: number, y: number) {
		this.contextMenu = { x, y };
	}

	hideContextMenu() {
		this.contextMenu = null;
	}
}

export const desktop = new DesktopState();
