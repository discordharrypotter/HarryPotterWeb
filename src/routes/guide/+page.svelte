<script lang="ts">
	import { GUIDE_TREE, findGuideItem, buildBreadcrumb, searchGuide } from '$lib/data/guide';
	import type { GuideItem } from '$lib/types';
	import GuideTree from '$lib/components/GuideTree.svelte';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

	let activeId = $state('getting-started/introduction');
	let searchQuery = $state('');
	let searchResults = $derived(searchQuery.length >= 2 ? searchGuide(GUIDE_TREE, searchQuery) : []);
	let activeItem = $derived(findGuideItem(GUIDE_TREE, activeId));
	let breadcrumb = $derived(buildBreadcrumb(GUIDE_TREE, activeId) ?? []);
	let guideSidebarOpen = $state(false);

	function handleSelect(item: GuideItem) {
		if (item.type === 'page') {
			activeId = item.id;
			searchQuery = '';
			guideSidebarOpen = false;
		}
	}
</script>

<svelte:head>
	<title>가이드 - 해리포터 봇</title>
</svelte:head>

<div class="guide-layout">
	<!-- Guide sidebar toggle (mobile) -->
	<button class="guide-sidebar-toggle" onclick={() => (guideSidebarOpen = !guideSidebarOpen)}>
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
			<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
		</svg>
		가이드 목차
	</button>

	{#if guideSidebarOpen}
		<button class="guide-overlay" onclick={() => (guideSidebarOpen = false)} aria-label="닫기"
		></button>
	{/if}

	<!-- Guide sidebar -->
	<aside class="guide-sidebar" class:open={guideSidebarOpen}>
		<div class="guide-sidebar-header">
			<h3>가이드</h3>
		</div>

		<!-- Search -->
		<div class="search-box">
			<svg
				class="search-icon"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
			<input type="text" placeholder="가이드 검색..." bind:value={searchQuery} />
			{#if searchQuery}
				<button class="search-clear" onclick={() => (searchQuery = '')} aria-label="검색 초기화">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
					>
				</button>
			{/if}
		</div>

		{#if searchQuery.length >= 2}
			<div class="search-results">
				{#if searchResults.length === 0}
					<p class="no-results">검색 결과가 없습니다.</p>
				{:else}
					<p class="results-count">{searchResults.length}개의 결과</p>
					{#each searchResults as result}
						<button class="search-result-item" onclick={() => handleSelect(result)}>
							<span class="result-title">{result.title}</span>
							{#if result.content?.description}
								<span class="result-desc">{result.content.description}</span>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		{:else}
			<div class="tree-container">
				<GuideTree items={GUIDE_TREE} {activeId} onselect={handleSelect} />
			</div>
		{/if}
	</aside>

	<!-- Guide content -->
	<div class="guide-content">
		{#if breadcrumb.length > 0}
			<nav class="breadcrumb" aria-label="경로">
				{#each breadcrumb as crumb, i}
					{#if i > 0}
						<svg
							class="breadcrumb-sep"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg
						>
					{/if}
					{#if i === breadcrumb.length - 1}
						<span class="breadcrumb-current">{crumb.title}</span>
					{:else}
						<button
							class="breadcrumb-link"
							onclick={() => {
								if (crumb.type === 'page') handleSelect(crumb);
							}}>{crumb.title}</button
						>
					{/if}
				{/each}
			</nav>
		{/if}

		{#if activeItem?.content}
			{#key activeId}
				<div class="guide-article">
					{#if activeItem.content.description}
						<p class="guide-desc">{activeItem.content.description}</p>
					{/if}
					<MarkdownRenderer source={activeItem.content.body} />
				</div>
			{/key}
		{:else}
			<div class="guide-empty">
				<p>왼쪽 목차에서 항목을 선택하세요.</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.guide-layout {
		display: flex;
		min-height: 100vh;
		position: relative;
	}

	/* Guide sidebar toggle */
	.guide-sidebar-toggle {
		display: none;
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 60;
		padding: 10px 16px;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		align-items: center;
		gap: 8px;
	}

	.guide-overlay {
		display: none;
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 70;
		border: none;
		cursor: pointer;
	}

	/* Guide sidebar */
	.guide-sidebar {
		width: 280px;
		min-width: 280px;
		border-right: 1px solid var(--border);
		background: var(--bg-secondary);
		display: flex;
		flex-direction: column;
		height: 100vh;
		position: sticky;
		top: 0;
		overflow-y: auto;
	}

	.guide-sidebar-header {
		padding: 20px 20px 12px;
		border-bottom: 1px solid var(--border);
	}
	.guide-sidebar-header h3 {
		font-size: 15px;
		font-weight: 600;
		color: var(--text-primary);
	}

	/* Search */
	.search-box {
		position: relative;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.search-icon {
		position: absolute;
		left: 28px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-tertiary);
		pointer-events: none;
	}

	.search-box input {
		width: 100%;
		padding: 8px 12px 8px 34px;
		background: var(--bg-tertiary);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-family: var(--font-sans);
		font-size: 13px;
		outline: none;
	}
	.search-box input::placeholder {
		color: var(--text-tertiary);
	}
	.search-box input:focus {
		border-color: var(--accent);
	}

	.search-clear {
		position: absolute;
		right: 28px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: var(--text-tertiary);
		cursor: pointer;
		padding: 2px;
		display: flex;
	}

	/* Search results */
	.search-results {
		padding: 8px 12px;
		overflow-y: auto;
		flex: 1;
	}

	.no-results {
		text-align: center;
		color: var(--text-tertiary);
		font-size: 13px;
		padding: 20px 0;
	}

	.results-count {
		font-size: 11px;
		color: var(--text-tertiary);
		padding: 4px 8px 8px;
		font-weight: 500;
	}

	.search-result-item {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 10px 12px;
		background: none;
		border: none;
		border-radius: var(--radius-sm);
		color: var(--text-secondary);
		cursor: pointer;
		font-family: var(--font-sans);
		text-align: left;
		transition:
			background var(--transition),
			color var(--transition);
	}
	.search-result-item:hover {
		background: var(--bg-hover);
		color: var(--text-primary);
	}

	.result-title {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-primary);
	}

	.result-desc {
		font-size: 12px;
		color: var(--text-tertiary);
		margin-top: 2px;
	}

	/* Tree container */
	.tree-container {
		padding: 12px;
		flex: 1;
		overflow-y: auto;
	}

	/* Guide content */
	.guide-content {
		flex: 1;
		min-width: 0;
		padding: 32px 40px 80px;
		max-width: 800px;
	}

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.breadcrumb-link {
		font-size: 13px;
		color: var(--text-tertiary);
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-sans);
		padding: 0;
		transition: color var(--transition);
	}
	.breadcrumb-link:hover {
		color: var(--text-primary);
	}

	.breadcrumb-sep {
		color: var(--text-tertiary);
		opacity: 0.5;
	}

	.breadcrumb-current {
		font-size: 13px;
		color: var(--text-primary);
		font-weight: 500;
	}

	.guide-desc {
		font-size: 0.95em;
		color: var(--text-secondary);
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border);
	}

	.guide-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 300px;
		color: var(--text-tertiary);
		font-size: 14px;
	}

	@media (max-width: 900px) {
		.guide-sidebar-toggle {
			display: flex;
		}

		.guide-overlay {
			display: block;
		}

		.guide-sidebar {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			z-index: 80;
			transform: translateX(-100%);
		}
		.guide-sidebar.open {
			transform: translateX(0);
		}

		.guide-content {
			padding: 24px 20px 80px;
		}
	}
</style>
