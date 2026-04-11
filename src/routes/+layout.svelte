<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import TopBar from '$lib/components/TopBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="layout">
	<Sidebar />
	<div class="main-area">
		<TopBar />
		<main class="content">
			{@render children()}
		</main>
	</div>
</div>

<style>
	.layout {
		display: flex;
		min-height: 100vh;
	}

	.main-area {
		flex: 1;
		margin-left: var(--sidebar-width);
		min-width: 0;
	}

	.content {
		min-height: 100vh;
	}

	@media (max-width: 768px) {
		.main-area {
			margin-left: 0;
		}
	}
</style>
