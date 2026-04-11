<script lang="ts">
	import type { VersionedDocument } from '$lib/types';

	let {
		versions,
		selectedIndex = $bindable(0),
	}: {
		versions: VersionedDocument[];
		selectedIndex: number;
	} = $props();

	let open = $state(false);

	function select(index: number) {
		selectedIndex = index;
		open = false;
	}

	function handleKeydown(e: KeyboardEvent, index: number) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			select(index);
		}
	}
</script>

<div class="version-dropdown">
	<button
		class="dropdown-trigger"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-haspopup="listbox"
	>
		<div class="version-info">
			<span class="version-label">
				v{versions[selectedIndex].version}
				{#if versions[selectedIndex].label}
					<span class="version-badge">{versions[selectedIndex].label}</span>
				{/if}
			</span>
		</div>
		<svg
			class="chevron"
			class:rotated={open}
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	</button>

	{#if open}
		<div class="dropdown-menu" role="listbox">
			{#each versions as version, i}
				<button
					class="dropdown-item"
					class:active={i === selectedIndex}
					onclick={() => select(i)}
					onkeydown={(e) => handleKeydown(e, i)}
					role="option"
					aria-selected={i === selectedIndex}
				>
					<span class="item-version">
						v{version.version}
						{#if version.label}
							<span class="version-badge">{version.label}</span>
						{/if}
					</span>
					<span class="item-date">{version.date}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.version-dropdown {
		position: relative;
		width: fit-content;
		min-width: 240px;
	}

	.dropdown-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		gap: 12px;
		padding: 10px 14px;
		background: var(--bg-tertiary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 14px;
		transition:
			background var(--transition),
			border-color var(--transition);
	}
	.dropdown-trigger:hover {
		border-color: var(--accent);
		background: var(--bg-elevated);
	}

	.version-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
	}

	.version-label {
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.version-badge {
		font-size: 10px;
		font-weight: 600;
		padding: 2px 6px;
		background: var(--accent);
		color: white;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.chevron {
		color: var(--text-tertiary);
		flex-shrink: 0;
	}
	.chevron.rotated {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
		z-index: 20;
	}

	.dropdown-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 10px 14px;
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 14px;
		text-align: left;
		transition:
			background var(--transition),
			color var(--transition);
	}
	.dropdown-item:hover {
		background: var(--bg-hover);
		color: var(--text-primary);
	}
	.dropdown-item.active {
		background: var(--accent-subtle);
		color: var(--accent-text);
	}
	.dropdown-item + .dropdown-item {
		border-top: 1px solid var(--border-subtle);
	}

	.item-version {
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.item-date {
		font-size: 12px;
		color: var(--text-tertiary);
	}
</style>
