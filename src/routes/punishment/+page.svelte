<script lang="ts">
	import DocumentPage from '$lib/components/DocumentPage.svelte';
	import { punishment_VERSIONS } from '$lib/data/punishment';
</script>

<svelte:head>
	<title>제재 규정 - 해리포터 봇</title>
</svelte:head>

<DocumentPage title="봇 제재 규정" versions={punishment_VERSIONS} />
