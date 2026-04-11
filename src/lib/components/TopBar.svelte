<script lang="ts">
	import { sidebarOpen } from '$lib/stores/sidebar';

	let { title = '' }: { title?: string } = $props();
</script>

<header class="topbar">
	<button class="menu-btn" onclick={() => sidebarOpen.update((v) => !v)} aria-label="메뉴 열기">
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	</button>
	{#if title}
		<span class="topbar-title">{title}</span>
	{/if}
</header>

<style>
	.topbar {
		display: none;
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		padding: 12px 16px;
		align-items: center;
		gap: 12px;
	}

	.menu-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		border-radius: var(--radius-sm);
		transition:
			background var(--transition),
			color var(--transition);
	}
	.menu-btn:hover {
		background: var(--bg-hover);
		color: var(--text-primary);
	}

	.topbar-title {
		font-size: 14px;
		font-weight: 500;
		color: var(--text-primary);
	}

	@media (max-width: 768px) {
		.topbar {
			display: flex;
		}
	}
</style>
