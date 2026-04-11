<script lang="ts">
	import DocumentPage from '$lib/components/DocumentPage.svelte';
	import { PRIVACY_VERSIONS } from '$lib/data/privacy';
</script>

<svelte:head>
	<title>개인정보 처리 방침 - 해리포터 봇</title>
</svelte:head>

<DocumentPage title="개인정보 처리 방침" versions={PRIVACY_VERSIONS} />
