<script lang="ts">
	import type { GuideItem } from '$lib/types';
	import GuideTree from './GuideTree.svelte';

	let {
		items,
		activeId = '',
		depth = 0,
		onselect,
	}: {
		items: GuideItem[];
		activeId?: string;
		depth?: number;
		onselect: (item: GuideItem) => void;
	} = $props();

	let expanded = $state<Record<string, boolean>>({});

	function toggle(id: string) {
		expanded[id] = !expanded[id];
	}

	function isParentOfActive(item: GuideItem, targetId: string): boolean {
		if (item.id === targetId) return true;
		if (item.children) {
			return item.children.some((c) => isParentOfActive(c, targetId));
		}
		return false;
	}

	// activeId가 변경될 때마다 해당 페이지가 보이도록 부모 폴더 자동 확장
	$effect(() => {
		if (activeId) {
			for (const item of items) {
				if (item.type === 'folder' && isParentOfActive(item, activeId)) {
					expanded[item.id] = true;
				}
			}
		}
	});
</script>

<ul class="tree" class:root={depth === 0}>
	{#each items as item}
		<li class="tree-item">
			{#if item.type === 'folder'}
				<button
					class="tree-btn folder"
					class:expanded={expanded[item.id]}
					onclick={() => toggle(item.id)}
				>
					<svg
						class="chevron"
						class:rotated={expanded[item.id]}
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
					{#if item.icon}
						<span class="item-icon">{item.icon}</span>
					{:else}
						<svg
							class="folder-icon"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							{#if expanded[item.id]}
								<path
									d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
								/>
							{:else}
								<path
									d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
								/>
							{/if}
						</svg>
					{/if}
					<span class="item-label">{item.title}</span>
				</button>
				{#if expanded[item.id] && item.children}
					<div class="children" style="animation-delay: 0ms">
						<GuideTree items={item.children} {activeId} depth={depth + 1} {onselect} />
					</div>
				{/if}
			{:else}
				<button
					class="tree-btn page"
					class:active={activeId === item.id}
					onclick={() => onselect(item)}
				>
					<svg
						class="page-icon"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
						<polyline points="14 2 14 8 20 8" />
					</svg>
					<span class="item-label">{item.title}</span>
				</button>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.tree {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.tree.root {
		padding: 0;
	}

	.tree-item {
		position: relative;
	}

	.children {
		padding-left: 16px;
		border-left: 1px solid var(--border-subtle);
		margin-left: 11px;
	}

	.tree-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 6px 10px;
		border: none;
		background: none;
		color: var(--text-secondary);
		font-family: var(--font-sans);
		font-size: 13.5px;
		cursor: pointer;
		border-radius: var(--radius-sm);
		text-align: left;
		transition:
			background var(--transition),
			color var(--transition);
	}

	.tree-btn:hover {
		background: var(--bg-hover);
		color: var(--text-primary);
	}

	.tree-btn.active {
		background: var(--accent-subtle);
		color: var(--accent-text);
	}

	.chevron {
		flex-shrink: 0;
		color: var(--text-tertiary);
	}
	.chevron.rotated {
		transform: rotate(90deg);
	}

	.item-icon {
		font-size: 14px;
		flex-shrink: 0;
	}

	.folder-icon,
	.page-icon {
		flex-shrink: 0;
		opacity: 0.5;
	}

	.item-label {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.folder .item-label {
		font-weight: 500;
	}
</style>
