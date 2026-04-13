<script lang="ts">
	interface Props {
		label: string;
		icon: string;
		selected?: boolean;
		onclick?: (e: MouseEvent) => void;
		ondblclick?: (e: MouseEvent) => void;
		oncontextmenu?: (e: MouseEvent) => void;
	}

	let {
		label,
		icon,
		selected = false,
		onclick,
		ondblclick,
		oncontextmenu
	}: Props = $props();

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		onclick?.(e);
	}

	function handleDblClick(e: MouseEvent) {
		e.stopPropagation();
		ondblclick?.(e);
	}

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		oncontextmenu?.(e);
	}
</script>

<button
	class="desktop-icon"
	class:selected
	onclick={handleClick}
	ondblclick={handleDblClick}
	oncontextmenu={handleContextMenu}
	aria-label={label}
>
	<span class="icon-img">{icon}</span>
	<span class="icon-label" class:selected>{label}</span>
</button>

<style>
	.desktop-icon {
		width: 74px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 4px;
		border-radius: 2px;
		cursor: pointer;
		border: none;
		background: transparent;
		font-family: inherit;
		font-size: inherit;
	}

	.desktop-icon:hover {
		background: rgba(0, 0, 0, 0.08);
	}

	.desktop-icon.selected {
		background: rgba(49, 106, 197, 0.4);
	}

	.icon-img {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
		filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.4));
	}

	.icon-label {
		color: white;
		text-align: center;
		font-size: var(--font-size, 11px);
		text-shadow:
			1px 1px 2px rgba(0, 0, 0, 0.8),
			0 0 4px rgba(0, 0, 0, 0.5);
		line-height: 1.3;
		word-wrap: break-word;
		max-width: 72px;
	}

	.icon-label.selected {
		background: var(--selection-bg, #316ac5);
		color: var(--selection-color, white);
		padding: 1px 2px;
		text-shadow: none;
	}
</style>
