<script lang="ts">
	import { page } from '$app/stores';
	import { NAV_ITEMS, SITE } from '$lib/data/site';
	import logoImg from '$lib/assets/logo-white.png';
	import { sidebarOpen } from '$lib/stores/sidebar';

	const icons: Record<string, string> = {
		home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
		book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
		'file-text': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
		shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
		'alert-triangle': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
		mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
	};

	function closeMobile() {
		sidebarOpen.set(false);
	}
</script>

<!-- Mobile overlay -->
{#if $sidebarOpen}
	<button class="overlay" onclick={closeMobile} aria-label="사이드바 닫기"></button>
{/if}

<aside class="sidebar" class:open={$sidebarOpen}>
	<div class="sidebar-header">
		<a href="/" class="logo" onclick={closeMobile}>
			<img class="logo-icon" src={logoImg} alt="Logo" />
			<span class="logo-text">{SITE.botName}</span>
		</a>
	</div>

	<nav class="sidebar-nav">
		{#each NAV_ITEMS as item}
			{@const active =
				item.href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(item.href)}
			<a href={item.href} class="nav-item" class:active onclick={closeMobile}>
				{#if item.icon && icons[item.icon]}
					<span class="nav-icon">{@html icons[item.icon]}</span>
				{/if}
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>

	<div class="sidebar-footer">
		<a href={SITE.botInviteUrl} class="invite-btn"> 봇 초대하기 </a>
	</div>
</aside>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 90;
		border: none;
		cursor: pointer;
		display: none;
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: var(--sidebar-width);
		background: var(--sidebar-bg);
		border-right: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		z-index: 100;
		overflow-y: auto;
	}

	.sidebar-header {
		padding: 20px 20px 16px;
		border-bottom: 1px solid var(--border);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: inherit;
	}

	.logo-icon {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-sm);
		object-fit: contain;
	}

	.logo-text {
		font-weight: 600;
		font-size: 16px;
		color: var(--text-primary);
	}

	.sidebar-nav {
		flex: 1;
		padding: 12px 10px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 12px;
		border-radius: var(--radius-sm);
		color: var(--text-secondary);
		font-size: 14px;
		font-weight: 400;
		text-decoration: none;
		transition:
			background var(--transition),
			color var(--transition);
	}

	.nav-item:hover {
		background: var(--bg-hover);
		color: var(--text-primary);
	}

	.nav-item.active {
		background: var(--accent-subtle);
		color: var(--accent-text);
		font-weight: 500;
	}

	.nav-icon {
		display: flex;
		align-items: center;
		opacity: 0.7;
	}
	.nav-item.active .nav-icon {
		opacity: 1;
	}

	.sidebar-footer {
		padding: 16px;
		border-top: 1px solid var(--border);
	}

	.invite-btn {
		display: block;
		text-align: center;
		padding: 10px;
		background: var(--accent);
		color: white;
		border-radius: var(--radius-sm);
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
		transition: background var(--transition);
	}
	.invite-btn:hover {
		background: var(--accent-hover);
		color: white;
	}

	@media (max-width: 768px) {
		.overlay {
			display: block;
		}

		.sidebar {
			transform: translateX(-100%);
		}
		.sidebar.open {
			transform: translateX(0);
		}
	}
</style>
