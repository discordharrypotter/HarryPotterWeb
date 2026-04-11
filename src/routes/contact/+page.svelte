<script lang="ts">
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

	let contactFrom = $state('');
	let contactSubject = $state('');
	let contactBody = $state('');

	const intro = `## 문의 채널

[>서포트 서버 내 문의 채널](https://discord.gg/Qv8rzE9ycV) [>이메일로 문의하기](mailto:team@1soom.xyz)`;
</script>

<svelte:head>
	<title>문의하기 - 해리포터 봇</title>
</svelte:head>

<div class="contact-page">
	<div class="contact-header">
		<h1>문의하기</h1>
		<p class="contact-subtitle">개발팀에 문의하거나 버그를 제보할 수 있습니다.</p>
	</div>

	<div class="contact-body">
		<MarkdownRenderer source={intro} />

		<h2 class="form-title">이메일 문의</h2>
		<p class="form-desc">아래 양식을 작성하면 기본 메일 앱으로 바로 전송할 수 있습니다.</p>

		<div class="contact-form">
			<div class="contact-field">
				<label for="contact-from">보내는 사람</label>
				<input
					id="contact-from"
					type="email"
					placeholder="harry@example.com"
					bind:value={contactFrom}
				/>
			</div>
			<div class="contact-field">
				<label for="contact-subject">제목</label>
				<input
					id="contact-subject"
					type="text"
					placeholder="문의 제목을 입력해 주세요"
					bind:value={contactSubject}
				/>
			</div>
			<div class="contact-field">
				<label for="contact-body">내용</label>
				<textarea
					id="contact-body"
					rows="6"
					placeholder="문의 내용을 작성해 주세요"
					bind:value={contactBody}
				></textarea>
			</div>
			<a
				class="contact-submit"
				href="mailto:team@1soom.xyz?subject={encodeURIComponent(
					contactSubject,
				)}&body={encodeURIComponent(
					contactBody + (contactFrom ? '\n\n보낸 사람: ' + contactFrom : ''),
				)}"
			>
				이메일 보내기
			</a>
			<p class="contact-hint">기본 메일 앱이 열리며, 작성한 내용이 자동으로 채워집니다.</p>
		</div>
	</div>
</div>

<style>
	.contact-page {
		max-width: 780px;
		margin: 0 auto;
		padding: 40px 32px 80px;
	}

	.contact-header {
		margin-bottom: 40px;
	}

	h1 {
		font-size: 1.8em;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 8px;
	}

	.contact-subtitle {
		font-size: 13px;
		color: var(--text-tertiary);
	}

	.form-title {
		font-size: 1.4em;
		font-weight: 600;
		margin: 32px 0 6px;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--border);
		color: var(--text-primary);
	}

	.form-desc {
		font-size: 0.9em;
		color: var(--text-secondary);
		margin-bottom: 20px;
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.contact-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.contact-field label {
		font-size: 0.85em;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.contact-field input,
	.contact-field textarea {
		width: 100%;
		padding: 10px 14px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-family: var(--font-sans);
		font-size: 0.9em;
		outline: none;
		resize: vertical;
	}

	.contact-field input::placeholder,
	.contact-field textarea::placeholder {
		color: var(--text-tertiary);
	}

	.contact-field input:focus,
	.contact-field textarea:focus {
		border-color: var(--accent);
	}

	.contact-submit {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		gap: 8px;
		padding: 10px 20px;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-family: var(--font-sans);
		font-size: 0.9em;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		transition: background var(--transition);
	}

	.contact-submit:hover {
		background: var(--accent-hover);
		color: white;
	}

	.contact-hint {
		font-size: 0.8em;
		color: var(--text-tertiary);
		margin: 0;
	}

	@media (max-width: 768px) {
		.contact-page {
			padding: 24px 16px 60px;
		}
		h1 {
			font-size: 1.4em;
		}
	}
</style>
