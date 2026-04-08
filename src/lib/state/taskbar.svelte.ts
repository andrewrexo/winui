class TaskbarState {
	startMenuOpen = $state(false);

	toggleStartMenu() {
		this.startMenuOpen = !this.startMenuOpen;
	}

	closeStartMenu() {
		this.startMenuOpen = false;
	}
}

export const taskbar = new TaskbarState();
