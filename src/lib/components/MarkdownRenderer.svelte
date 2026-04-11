<script lang="ts">
	import { onMount } from 'svelte';

	let { source = '' }: { source?: string } = $props();

	function renderDropdown(md: string): string {
		// 들여쓰기된 >>> ... <<< 블록 파싱
		function parseDropdownBlocks(text: string, indentLevel = 0): string {
			const prefix = indentLevel > 0 ? `(?:  |\t){${indentLevel}}` : '';
			const pattern = new RegExp(`^${prefix}>>>\\s*(.+)\\n([\\s\\S]*?)^${prefix}<<<\\s*$`, 'gm');
			return text.replace(pattern, (_, question: string, answer: string) => {
				// 내부에 들여쓰기된 하위 블록이 있으면 먼저 처리
				let body = parseDropdownBlocks(answer, indentLevel + 1);
				// 나머지 텍스트를 <p>로 감싸기 (이미 HTML 태그인 줄은 건너뜀)
				body = body
					.split('\n')
					.map((line) => {
						const l = line.trim();
						if (!l || l.startsWith('<div class="md-dropdown')) return l;
						return `<p>${l}</p>`;
					})
					.join('');
				const depth = indentLevel > 0 ? ` md-dropdown-nested` : '';
				return `<div class="md-dropdown${depth}"><div class="md-dropdown-header">${question.trim()}<span class="md-dropdown-chevron"></span></div><div class="md-dropdown-body">${body}</div></div>`;
			});
		}
		return parseDropdownBlocks(md);
	}

	let container: HTMLDivElement;

	onMount(() => {
		container.querySelectorAll('.md-dropdown-header').forEach((header) => {
			header.addEventListener('click', () => {
				header.parentElement?.classList.toggle('open');
			});
		});
	});

	type ListNode = { depth: number; text: string; type: 'ul' | 'ol'; continuation: string[] };

	function parseListLine(line: string): { depth: number; text: string; type: 'ul' | 'ol' } | null {
		const ul = line.match(/^(\s*)- (.+)$/);
		if (ul) {
			return { depth: Math.floor(ul[1].replace(/\t/g, '  ').length / 2), text: ul[2], type: 'ul' };
		}
		const ol = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
		if (ol) {
			return { depth: Math.floor(ol[1].replace(/\t/g, '  ').length / 2), text: ol[3], type: 'ol' };
		}
		return null;
	}

	function isContinuationLine(line: string): boolean {
		// 들여쓰기된 비리스트 줄 (이미지, 텍스트 등)은 이전 항목에 이어붙임
		return /^\s{2,}\S/.test(line) && !parseListLine(line);
	}

	function buildListHtml(
		items: ListNode[],
		idx: number,
		currentDepth: number,
	): { html: string; nextIdx: number } {
		const tag = items[idx].type;
		let out = `<${tag}>`;
		let j = idx;
		while (j < items.length && items[j].depth >= currentDepth) {
			if (items[j].depth === currentDepth) {
				const cont =
					items[j].continuation.length > 0 ? '\n' + items[j].continuation.join('\n') : '';
				out += `<li>${items[j].text}${cont}`;
				j++;
				if (j < items.length && items[j].depth > currentDepth) {
					const child = buildListHtml(items, j, items[j].depth);
					out += child.html;
					j = child.nextIdx;
				}
				out += '</li>';
			} else {
				break;
			}
		}
		out += `</${tag}>`;
		return { html: out, nextIdx: j };
	}

	function preprocessLists(md: string): string {
		const lines = md.split('\n');
		const result: string[] = [];
		let i = 0;

		while (i < lines.length) {
			const item = parseListLine(lines[i]);
			if (item) {
				const items: ListNode[] = [];
				while (i < lines.length) {
					const parsed = parseListLine(lines[i]);
					if (parsed) {
						items.push({ ...parsed, continuation: [] });
						i++;
					} else if (items.length > 0 && isContinuationLine(lines[i])) {
						// 들여쓰기된 줄은 마지막 리스트 항목에 이어붙임
						items[items.length - 1].continuation.push(lines[i].trim());
						i++;
					} else {
						break;
					}
				}
				const { html } = buildListHtml(items, 0, 0);
				result.push(html);
			} else {
				result.push(lines[i]);
				i++;
			}
		}

		return result.join('\n');
	}

	function renderMarkdown(md: string | undefined | null): string {
		const safeMd = md ?? '';
		// 드랍다운 블록을 먼저 렌더링 (내부에 일반 텍스트뿐만 아니라 리스트, 이미지 등 다양한 요소가 포함될 수 있기 때문)
		const preprocessed = renderDropdown(safeMd);
		// 그 다음 리스트 렌더링
		const withLists = preprocessLists(preprocessed);

		let html = md
			? withLists
					// Link Button : [>텍스트](url)
					.replace(/\[>([^\]]+)\]\(([^)]+)\)/g, (_, text: string, url: string) => {
						return `<a href="${url.trim()}" class="md-btn-link" target="_blank" rel="noopener noreferrer"><span class="md-btn-text">${text.trim()}</span><svg class="md-btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`;
					})
					// Code blocks
					.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
					// Inline code
					.replace(/`([^`]+)`/g, '<code>$1</code>')
					// Headers
					.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
					.replace(/^### (.+)$/gm, '<h3>$1</h3>')
					.replace(/^## (.+)$/gm, '<h2>$1</h2>')
					// Bold
					.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
					// Underline
					.replace(/__(.+?)__/g, '<u>$1</u>')
					// Color chip: {#HEX 텍스트}
					.replace(
						/\{(#[0-9A-Fa-f]{3,8})\s+([^}]+)\}/g,
						'<span class="md-color-chip"><span class="md-color-dot" style="background:$1"></span><span style="color:$1">$2</span></span>',
					)
					// Inline icon images (in tables - small icons)
					.replace(/!\[([^\]]*)\]\((icons\/[^)]+)\)/g, '<img src="/$2" alt="$1" class="md-icon" />')
					// Images
					.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
					// Links
					.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
					// Tables
					.replace(/^\|(.+)\|$/gm, (match) => {
						const cells = match.split('|').filter((c) => c.trim());
						return `<tr>${cells
							.map((c) => {
								const trimmed = c.trim();
								if (/^[-:]+$/.test(trimmed)) return '';
								return `<td>${trimmed}</td>`;
							})
							.join('')}</tr>`;
					})
					// Paragraphs
					.replace(
						/^(?!<[htulolp]|<li|<pre|<tr|<img|<div|<\/div|<a class="md-btn)(.+)$/gm,
						'<p>$1</p>',
					)
			: '';

		// 테이블 래핑 및 빈 행 제거
		html = html.replace(/(<tr>[\s\S]*?<\/tr>(\s*<tr>[\s\S]*?<\/tr>)*)/g, (match) => {
			// 빈 <tr> 제거 후 내용이 남아있으면 테이블로 감싸기
			const cleaned = match.replace(/<tr><\/tr>/g, '');
			if (!cleaned.trim()) return '';
			const rows = cleaned.split('</tr>').filter((r) => r.trim());
			if (rows.length === 0) return '';
			const header = rows[0] + '</tr>';
			const body = rows
				.slice(1)
				.map((r) => (r.trim() ? r + '</tr>' : ''))
				.join('');
			return `<div class="md-table-wrap"><table><thead>${header.replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')}</thead><tbody>${body}</tbody></table></div>`;
		});

		// 빈 <p> 제거
		html = html.replace(/<p>\s*<\/p>/g, '');

		return html;
	}
</script>

<div class="doc-content markdown" bind:this={container}>
	{@html renderMarkdown(source)}
</div>

<style>
	.markdown {
		line-height: 1.8;
	}

	.markdown :global(h2) {
		font-size: 1.4em;
		font-weight: 780;
		margin: 32px 0 12px;
		padding-bottom: 8px;
		border-bottom: 2px solid var(--border);
		color: var(--text-primary);
	}
	.markdown :global(h3) {
		font-size: 1.15em;
		font-weight: 600;
		margin: 24px 0 8px;
		padding-top: 16px;
		border-top: 1px solid var(--border-subtle);
		color: var(--text-primary);
	}
	.markdown :global(h2 + h3),
	.markdown :global(h3:first-child) {
		border-top: none;
		padding-top: 0;
	}
	.markdown :global(h4) {
		font-size: 1em;
		font-weight: 600;
		margin: 20px 0 6px;
		color: var(--text-secondary);
	}
	.markdown :global(p) {
		margin: 6px 0;
		color: var(--text-secondary);
	}
	.markdown :global(ul) {
		padding-left: 22px;
		margin: 6px 0;
		list-style: disc;
	}
	.markdown :global(ol) {
		padding-left: 22px;
		margin: 6px 0;
		list-style: decimal;
	}
	.markdown :global(li) {
		margin: 4px 0;
		color: var(--text-secondary);
	}
	.markdown :global(li > ul),
	.markdown :global(li > ol) {
		margin: 2px 0;
	}
	.markdown :global(ul ul) {
		list-style: circle;
	}
	.markdown :global(ul ul ul) {
		list-style: square;
	}
	.markdown :global(strong) {
		color: var(--text-primary);
		font-weight: 600;
	}
	.markdown :global(a) {
		color: var(--accent-text);
		text-decoration: none;
	}
	.markdown :global(a:hover) {
		text-decoration: underline;
	}
	.markdown :global(.md-table-wrap) {
		overflow-x: auto;
		margin: 12px 0;
		-webkit-overflow-scrolling: touch;
	}
	.markdown :global(table) {
		min-width: 100%;
		width: max-content;
		border-collapse: collapse;
		font-size: 0.93em;
	}
	.markdown :global(th),
	.markdown :global(td) {
		padding: 10px 14px;
		text-align: left;
		border-bottom: 1px solid var(--border);
	}
	.markdown :global(th) {
		white-space: nowrap;
	}
	.markdown :global(th) {
		color: var(--text-secondary);
		font-weight: 500;
		font-size: 0.85em;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: var(--bg-tertiary);
	}
	.markdown :global(pre) {
		background: var(--bg-tertiary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 16px 20px;
		overflow-x: auto;
		margin: 12px 0;
	}
	.markdown :global(pre code) {
		background: none;
		border: none;
		padding: 0;
		font-size: 0.85em;
	}
	.markdown :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: var(--radius-md);
		margin: 12px 0;
	}
	.markdown :global(code) {
		font-family: var(--font-mono);
		font-size: 0.88em;
		background: var(--bg-tertiary);
		padding: 2px 6px;
		border-radius: 4px;
		border: 1px solid var(--border-subtle);
	}

	/* Dropdown Accordion */
	.markdown :global(.md-dropdown) {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		margin: 8px 0;
		overflow: hidden;
	}
	.markdown :global(.md-dropdown + .md-dropdown) {
		margin-top: -1px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	.markdown :global(.md-dropdown:has(+ .md-dropdown)) {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	.markdown :global(.md-dropdown-header) {
		padding: 14px 18px;
		cursor: pointer;
		font-weight: 500;
		color: var(--text-primary);
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		gap: 10px;
		transition: background var(--transition);
		user-select: none;
	}
	.markdown :global(.md-dropdown-header:hover) {
		background: var(--bg-tertiary);
	}
	.markdown :global(.md-dropdown-chevron) {
		margin-left: auto;
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		position: relative;
	}
	.markdown :global(.md-dropdown-chevron::before),
	.markdown :global(.md-dropdown-chevron::after) {
		content: '';
		position: absolute;
		background: var(--text-tertiary);
		border-radius: 1px;
		transition: transform 0.2s ease;
	}
	.markdown :global(.md-dropdown-chevron::before) {
		width: 10px;
		height: 1.5px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.markdown :global(.md-dropdown-chevron::after) {
		width: 1.5px;
		height: 10px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.markdown :global(.md-dropdown.open .md-dropdown-chevron::after) {
		transform: translate(-50%, -50%) rotate(90deg);
	}
	.markdown :global(.md-dropdown-body) {
		padding: 0 18px;
		max-height: 0;
		overflow: hidden;
		background: var(--bg-primary);
		transition:
			max-height 0.25s ease,
			padding 0.25s ease;
	}
	.markdown :global(.md-dropdown.open .md-dropdown-body) {
		padding: 14px 18px;
		max-height: 500px;
		border-top: 1px solid var(--border);
	}
	.markdown :global(.md-dropdown-body p) {
		margin: 4px 0;
	}

	/* Nested Dropdown */
	.markdown :global(.md-dropdown-nested) {
		margin: 8px 0;
		border-left: 2px solid var(--border);
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
	}
	.markdown :global(.md-dropdown-nested .md-dropdown-header) {
		padding: 10px 14px;
		font-size: 0.93em;
		background: var(--bg-tertiary);
	}
	.markdown :global(.md-dropdown-nested .md-dropdown-header:hover) {
		background: var(--bg-elevated);
	}
	.markdown :global(.md-dropdown-nested.open .md-dropdown-body) {
		padding: 10px 14px;
	}

	/* Link Button */
	.markdown :global(.md-btn-link) {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 12px 18px;
		margin: 8px 10px 8px 0;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.93em;
		transition: background var(--transition);
	}
	.markdown :global(.md-btn-link:hover) {
		background: var(--bg-tertiary);
		text-decoration: none;
	}
	.markdown :global(.md-btn-text) {
		flex: 1;
	}
	.markdown :global(.md-btn-arrow) {
		color: var(--text-tertiary);
		flex-shrink: 0;
	}

	/* Color chip */
	.markdown :global(.md-color-chip) {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.markdown :global(.md-color-dot) {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* Underline */
	.markdown :global(u) {
		text-decoration: underline;
		text-decoration-color: var(--text-tertiary);
		text-underline-offset: 3px;
	}

	/* Inline icon (table cells) */
	.markdown :global(.md-icon) {
		width: 20px;
		height: 20px;
		vertical-align: middle;
		border-radius: 0;
		margin: 0;
		display: inline;
	}
</style>
