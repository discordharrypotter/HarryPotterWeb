<script lang="ts">
	import type { VersionedDocument } from '$lib/types';
	import VersionDropdown from './VersionDropdown.svelte';
	import MarkdownRenderer from './MarkdownRenderer.svelte';

	let {
		title,
		versions,
	}: {
		title: string;
		versions: VersionedDocument[];
	} = $props();

	let selectedIndex = $state(0);
	let currentDoc = $derived(versions[selectedIndex]);
</script>

<div class="document-page">
	<div class="doc-header">
		<h1>{title}</h1>
		<p class="doc-subtitle">
			마지막 업데이트 : {currentDoc.date} / 버전 {currentDoc.version}
		</p>
		<VersionDropdown {versions} bind:selectedIndex />
	</div>

	{#key currentDoc.version}
		<div class="doc-body">
			<MarkdownRenderer source={currentDoc.body} />
		</div>
	{/key}
</div>

<style>
	.document-page {
		max-width: 780px;
		margin: 0 auto;
		padding: 40px 32px 80px;
	}

	.doc-header {
		margin-bottom: 40px;
	}

	h1 {
		font-size: 1.8em;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 8px;
	}

	.doc-subtitle {
		font-size: 13px;
		color: var(--text-tertiary);
		margin-bottom: 16px;
	}

	@media (max-width: 768px) {
		.document-page {
			padding: 24px 16px 60px;
		}
		h1 {
			font-size: 1.4em;
		}
	}
</style>
