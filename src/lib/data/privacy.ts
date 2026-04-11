import type { VersionedDocument } from '$lib/types';
import { parseFrontmatter, compareVersionsDesc } from '$lib/content/parser';

// ──────────────────────────────────────────────
// 개인정보 처리 방침 - content/privacy/ 디렉토리의 .md 파일에서 자동 로드
// 새 버전 추가 : content/privacy/v{버전}.md 파일 생성
// ──────────────────────────────────────────────

const modules = import.meta.glob('/content/privacy/*.md', {
	query: '?raw',
	eager: true,
});

export const PRIVACY_VERSIONS: VersionedDocument[] = Object.entries(modules)
	.map(([, mod]) => {
		const { meta, body } = parseFrontmatter((mod as { default: string }).default);
		return {
			version: meta.version ?? '0.0.0',
			date: meta.date ?? '',
			label: meta.label,
			body,
		};
	})
	.sort((a, b) => compareVersionsDesc(a.version, b.version));
