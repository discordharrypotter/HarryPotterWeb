<script lang="ts">
	import { SITE, FEATURES, TEAM } from '$lib/data/site';
	import type { NewsEntry } from '$lib/types';
	import { onMount } from 'svelte';

	const TAG_LABEL: Record<string, string> = {
		event: '이벤트',
		notice: '공지',
		update: '업데이트',
		maintenance: '점검',
		general: '소식',
	};

	let news = $state<NewsEntry[]>([]);
	let newsLoaded = $state(false);

	let observer: IntersectionObserver;

	function observeAll() {
		document.querySelectorAll('[data-reveal]:not(.visible)').forEach((el) => observer.observe(el));
	}

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					}
				}
			},
			{ threshold: 0.08 },
		);

		observeAll();

		fetch('/api/news')
			.then((r) => r.json())
			.then((data: NewsEntry[]) => {
				news = data;
				// 다음 틱에서 새로 생긴 data-reveal 요소 관찰
				requestAnimationFrame(observeAll);
			})
			.catch(() => {});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>{SITE.botName}</title>
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="hero-row">
		<div class="hero-inner">
			<h1 class="hero-title" data-reveal>해리포터 봇</h1>
			<p class="hero-sub" data-reveal>
				해리포터 세계관을 기반으로 한 RPG 디스코드 봇.<br />퀘스트, 마법, 전투 - 당신만의 모험이
				시작됩니다.
			</p>
			<div class="hero-cta" data-reveal>
				<a href={SITE.botInviteUrl} class="cta-primary">봇 추가하기</a>
				<a href={SITE.supportServerUrl} class="cta-secondary">서포트 서버</a>
			</div>
			<div class="hero-stats" data-reveal>
				<div class="stat"><strong>1.4M</strong><span>서버</span></div>
				<div class="stat"><strong>4.4M</strong><span>누적 가입자</span></div>
				<div class="stat"><strong>99%</strong><span>업타임</span></div>
			</div>
		</div>
		{#if news.length > 0}
			<div class="news-panel" data-reveal>
				<div class="news-head">
					<span class="news-label">소식</span>
					<a href={SITE.naverCafeUrl} class="news-more" target="_blank" rel="noopener noreferrer"
						>더보기 →</a
					>
				</div>
				<div class="news-list">
					{#each news as item}
						<a class="news-item" href={item.href} target="_blank" rel="noopener noreferrer">
							<span class="news-tag {item.tag}">{TAG_LABEL[item.tag] ?? item.tag}</span>
							<span class="news-item-title">{item.title}</span>
							<span class="news-date">{item.date}</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Features: one row per feature, alternating -->
<section class="feat-section">
	{#each FEATURES as feature, i}
		<div class="feat-row" class:feat-reverse={i % 2 === 1} data-reveal>
			<div class="feat-num">{String(i + 1).padStart(2, '0')}</div>
			<div class="feat-body">
				<h3>{feature.title}</h3>
				<p>{feature.description}</p>
			</div>
		</div>
	{/each}
</section>

<!-- Team -->
<section class="team-section">
	<div class="team-header" data-reveal>
		<h2>팀원 소개</h2>
		<p>해리포터 봇을 함께 가꾸어가고 있습니다.</p>
	</div>
	<div class="team-list">
		{#each TEAM as member, i}
			<div class="t-card" data-reveal style="transition-delay:{i * 40}ms">
				<div class="t-avatar">
					{#if member.avatar}
						<img src={member.avatar} alt={member.name} />
					{:else}
						<img src="/harry.png" alt={member.name} />
					{/if}
					{#if member.description}
						<div class="t-bubble">{member.description}</div>
					{/if}
				</div>
				<div class="t-info">
					<strong>@{member.name}</strong>
					<small>{member.role}</small>
				</div>
				{#if member.links}
					<div class="t-links">
						{#each member.links as link}
							<a href={link.url} title={link.label} aria-label={link.label}>
								{#if link.icon === 'github'}
									<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
										><path
											d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
										/></svg
									>
								{:else if link.icon === 'web'}
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path
											d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
										/></svg
									>
								{:else if link.icon === 'email'}
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path
											d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
										/><polyline points="22,6 12,13 2,6" /></svg
									>
								{/if}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<div class="team-cta" data-reveal>
		<a href="https://careers.1soom.xyz" target="_blank" rel="noopener noreferrer">
			저희와 함께하고 싶으신가요?
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg
			>
		</a>
	</div>
</section>

<!-- Footer -->
<footer class="ft">
	<div class="ft-links">
		<a href="/terms">이용약관</a>
		<a href="/privacy">개인정보 처리 방침</a>
		<a href="/punishment">제재 규정</a>
		<a href="/guide">가이드</a>
	</div>
	<p>2021-{new Date().getFullYear()} 1soom 팀. All rights reserved.</p>
</footer>

<style>
	/* ─── Reveal ─── */
	:global([data-reveal]) {
		opacity: 0;
		transform: translateY(32px);
		transition:
			opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1),
			transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);
	}
	:global([data-reveal].visible) {
		opacity: 1;
		transform: none;
	}

	/* ─── Hero ─── */
	.hero {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 56px;
	}

	.hero-row {
		display: flex;
		gap: 56px;
		align-items: stretch;
	}

	.hero-inner {
		flex: 1;
		min-width: 0;
	}

	.hero-title {
		font-size: 2.8em;
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.04em;
		color: var(--text-primary);
		margin-bottom: 18px;
		word-break: keep-all;
	}

	.hero-sub {
		font-size: 0.93em;
		color: var(--text-tertiary);
		line-height: 1.75;
		margin-bottom: 32px;
		word-break: keep-all;
	}

	.hero-cta {
		display: flex;
		gap: 10px;
	}

	.cta-primary {
		display: inline-flex;
		align-items: center;
		padding: 11px 22px;
		color: var(--text-primary);
		border: 1px solid var(--text-primary);
		border-radius: 0;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		letter-spacing: 0.02em;
		position: relative;
		overflow: hidden;
		z-index: 0;
		transition: color 0.3s ease;
		background: transparent;
	}
	.cta-primary::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--text-primary);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: -1;
	}
	.cta-primary:hover {
		color: var(--bg-primary);
	}
	.cta-primary:hover::before {
		transform: scaleX(1);
	}

	.cta-secondary {
		display: inline-flex;
		align-items: center;
		padding: 11px 22px;
		color: var(--text-tertiary);
		border: 1px solid var(--border);
		border-radius: 0;
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
		letter-spacing: 0.02em;
		position: relative;
		overflow: hidden;
		z-index: 0;
		transition: color 0.3s ease;
		background: transparent;
	}
	.cta-secondary::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--border);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: -1;
	}
	.cta-secondary:hover {
		color: var(--text-primary);
	}
	.cta-secondary:hover::before {
		transform: scaleX(1);
	}

	/* Stats */
	.hero-stats {
		display: flex;
		gap: 32px;
		margin-top: 40px;
		padding-top: 24px;
		border-top: 1px solid var(--border);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.stat strong {
		font-size: 1.3em;
		font-weight: 800;
		color: var(--text-primary);
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.stat span {
		font-size: 12px;
		color: var(--text-tertiary);
		letter-spacing: 0.02em;
	}

	/* ─── News Panel ─── */
	.news-panel {
		width: 320px;
		flex-shrink: 0;
		border-left: 1px solid var(--border);
		padding-left: 32px;
		display: flex;
		flex-direction: column;
	}

	.news-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--border);
	}

	.news-label {
		font-size: 11px;
		font-weight: 700;
		color: var(--text-tertiary);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.news-more {
		font-size: 11px;
		color: var(--text-tertiary);
		text-decoration: none;
		opacity: 0.5;
		transition: opacity 0.2s ease;
	}
	.news-more:hover {
		opacity: 1;
	}

	.news-list {
		display: flex;
		flex-direction: column;
		max-height: 280px;
		overflow-y: auto;
		mask-image: linear-gradient(to bottom, #000 85%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, #000 85%, transparent 100%);
		scrollbar-width: none;
	}
	.news-list::-webkit-scrollbar {
		display: none;
	}

	.news-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 0;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}
	.news-item:hover {
		opacity: 0.6;
	}

	.news-tag {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	.news-tag.update {
		color: #7cb3ff;
	}
	.news-tag.event {
		color: #a78bfa;
	}
	.news-tag.notice {
		color: #6ee7b7;
	}
	.news-tag.maintenance {
		color: #fbbf24;
	}
	.news-tag.general {
		color: var(--text-tertiary);
	}

	.news-item-title {
		font-size: 0.85em;
		font-weight: 600;
		color: var(--text-primary);
		line-height: 1.45;
		word-break: keep-all;
		letter-spacing: -0.01em;
	}

	.news-date {
		font-size: 11px;
		color: var(--text-secondary);
		opacity: 0.7;
	}

	/* ─── Features ─── */
	.feat-section {
		max-width: 600px;
		margin: 0 auto;
		padding: 80px 32px;
	}

	.feat-row {
		display: flex;
		align-items: flex-start;
		gap: 24px;
		padding: 40px 0;
		border-bottom: 1px solid var(--border);
	}

	.feat-row:last-child {
		border-bottom: none;
	}

	.feat-num {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-tertiary);
		padding-top: 3px;
		flex-shrink: 0;
		width: 28px;
		font-variant-numeric: tabular-nums;
	}

	.feat-body h3 {
		font-size: 1.15em;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 8px;
		letter-spacing: -0.01em;
	}

	.feat-body p {
		font-size: 0.9em;
		color: var(--text-secondary);
		line-height: 1.7;
	}

	/* ─── Team ─── */
	.team-section {
		padding: 80px 32px;
		max-width: 720px;
		margin: 0 auto;
	}

	.team-header {
		text-align: center;
		margin-bottom: 48px;
	}

	.team-header h2 {
		font-size: 1.6em;
		font-weight: 700;
		margin-bottom: 8px;
		letter-spacing: -0.02em;
	}

	.team-header p {
		color: var(--text-tertiary);
		font-size: 0.95em;
	}

	.team-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: var(--border);
		border: 1px solid var(--border);
		border-radius: 12px;
	}
	.team-list .t-card:first-child {
		border-radius: 12px 12px 0 0;
	}
	.team-list .t-card:last-child {
		border-radius: 0 0 12px 12px;
	}

	.t-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 16px 20px;
		background: var(--bg-primary);
		transition: background var(--transition);
	}
	.t-card:hover {
		background: var(--bg-secondary);
	}

	.t-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: visible;
		background: var(--bg-elevated);
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.t-avatar img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.t-info {
		flex: 1;
		min-width: 0;
	}

	.t-info strong {
		display: block;
		font-size: 0.9em;
		font-weight: 600;
		color: var(--text-primary);
	}

	.t-info small {
		font-size: 0.78em;
		color: var(--text-tertiary);
	}

	.t-bubble {
		position: absolute;
		bottom: calc(100% + 10px);
		left: 50%;
		transform: translateX(-50%) translateY(4px);
		background: var(--bg-hover);
		border: 1px solid var(--border);
		color: var(--text-primary);
		font-size: 12px;
		line-height: 1.4;
		padding: 8px 14px;
		border-radius: 8px;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
		z-index: 10;
	}
	.t-bubble::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: var(--border);
	}
	.t-card:hover .t-bubble {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
	}

	.t-links {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.t-links a {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-tertiary);
		border-radius: 6px;
		transition: color var(--transition);
	}
	.t-links a:hover {
		color: var(--text-primary);
	}

	/* Team CTA */
	.team-cta {
		text-align: center;
		margin-top: 32px;
	}

	.team-cta a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.9em;
		color: var(--text-tertiary);
		text-decoration: none;
		transition: color var(--transition);
	}
	.team-cta a:hover {
		color: var(--text-primary);
	}

	/* ─── Footer ─── */
	.ft {
		padding: 32px;
		text-align: center;
		border-top: 1px solid var(--border);
	}

	.ft-links {
		display: flex;
		gap: 20px;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 12px;
	}

	.ft-links a {
		font-size: 13px;
		color: var(--text-tertiary);
	}
	.ft-links a:hover {
		color: var(--text-primary);
	}

	.ft p {
		font-size: 12px;
		color: var(--text-tertiary);
	}

	/* ─── Responsive ─── */
	@media (max-width: 900px) {
		.hero-row {
			flex-direction: column;
			gap: 40px;
		}
		.news-panel {
			width: 100%;
			border-left: none;
			padding-left: 0;
			border-top: 1px solid var(--border);
			padding-top: 24px;
		}
	}

	@media (max-width: 768px) {
		.hero {
			padding: 0 24px;
		}
		.hero-title {
			font-size: 2.2em;
		}
		.hero-cta {
			flex-direction: column;
		}
		.cta-primary,
		.cta-secondary {
			width: 100%;
			justify-content: center;
		}
		.hero-stats {
			gap: 24px;
			margin-top: 36px;
		}
		.stat strong {
			font-size: 1.2em;
		}
		.feat-section {
			padding: 48px 20px;
		}
		.feat-row {
			padding: 28px 0;
		}
		.team-section {
			padding: 48px 20px;
		}
	}
</style>
