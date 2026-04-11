<script lang="ts">
	import DocumentPage from '$lib/components/DocumentPage.svelte';
	import { TERMS_VERSIONS } from '$lib/data/terms';
</script>

<svelte:head>
	<title>이용약관 - 해리포터 봇</title>
</svelte:head>

<DocumentPage title="이용약관" versions={TERMS_VERSIONS} />
