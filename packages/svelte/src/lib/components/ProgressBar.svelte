<script lang="ts">
	interface Props {
		/** Current value (0–100) */
		value?: number;
		/** Whether to show an indeterminate animation */
		indeterminate?: boolean;
	}

	let { value = 0, indeterminate = false }: Props = $props();
</script>

<div class="progress-outer" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
	<div
		class="progress-inner"
		class:indeterminate
		style={indeterminate ? '' : `width:${Math.min(100, Math.max(0, value))}%`}
	></div>
</div>

<style>
	.progress-outer {
		width: 100%;
		height: 16px;
		background: var(--progress-bg, #fff);
		border: var(--progress-border, 1px solid #aca899);
		border-radius: var(--progress-radius, 2px);
		overflow: hidden;
	}

	.progress-inner {
		height: 100%;
		background: var(--progress-fill, linear-gradient(180deg, #56b856, #3c9e3c));
		transition: width 0.3s ease;
	}

	.indeterminate {
		width: 30% !important;
		animation: indeterminate 1.5s ease-in-out infinite;
	}

	@keyframes indeterminate {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(400%); }
	}
</style>
