export interface Notification {
	id: number;
	title: string;
	message: string;
	icon?: string;
}

class NotificationManager {
	notifications = $state<Notification[]>([]);
	#nextId = 0;

	/** Show a balloon notification. Auto-dismisses after 8 seconds. */
	show(title: string, message: string, icon?: string): number {
		const id = this.#nextId++;
		this.notifications.push({ id, title, message, icon });
		return id;
	}

	/** Dismiss a notification by ID */
	dismiss(id: number) {
		const idx = this.notifications.findIndex((n) => n.id === id);
		if (idx !== -1) this.notifications.splice(idx, 1);
	}

	/** Dismiss all notifications */
	clear() {
		this.notifications.splice(0, this.notifications.length);
	}
}

export const notifications = new NotificationManager();
