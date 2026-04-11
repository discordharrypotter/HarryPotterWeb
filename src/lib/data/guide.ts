import type { GuideItem, GuideMeta } from '$lib/types';
import { parseFrontmatter } from '$lib/content/parser';

// ──────────────────────────────────────────────
// 가이드 - content/guide/ 디렉토리 구조에서 자동 로드
//
// 폴더 추가 : content/guide/{폴더명}/_meta.json 생성
//   { "title": "표시 이름", "icon": "...", "order": 0 }
//
// 페이지 추가 : content/guide/{폴더명}/{파일명}.md 생성
//   frontmatter에 title, description, order 지정
// ──────────────────────────────────────────────

const mdModules = import.meta.glob('/content/guide/**/*.md', {
	query: '?raw',
	eager: true,
});
const metaModules = import.meta.glob('/content/guide/**/_meta.json', {
	eager: true,
});

/** 파일 경로에서 가이드 트리를 구성합니다 */
function buildGuideTree(): GuideItem[] {
	// 1. 메타 정보 수집 (폴더별)
	const folderMeta = new Map<string, GuideMeta>();
	for (const [path, mod] of Object.entries(metaModules)) {
		// "/content/guide/commands/moderation/_meta.json" → "commands/moderation"
		const relative = path.replace('/content/guide/', '').replace('/_meta.json', '');
		if (relative === '_meta.json') continue; // 루트 _meta.json 제외
		const meta = mod as GuideMeta;
		folderMeta.set(relative, meta);
	}

	// 2. 페이지 수집
	interface PageEntry {
		dirPath: string;
		id: string;
		title: string;
		description?: string;
		order: number;
		body: string;
	}
	const pages: PageEntry[] = [];

	for (const [path, mod] of Object.entries(mdModules)) {
		const raw = (mod as { default: string }).default;
		const { meta, body } = parseFrontmatter(raw);

		// "/content/guide/commands/moderation/ban.md" → dir="commands/moderation", id="commands/moderation/ban"
		const relative = path.replace('/content/guide/', '').replace(/\.md$/, '');
		const parts = relative.split('/');
		parts.pop(); // filename
		const dirPath = parts.join('/');

		pages.push({
			dirPath,
			id: relative,
			title: meta.title ?? relative,
			description: meta.description,
			order: parseInt(meta.order ?? '999', 10),
			body,
		});
	}

	// 3. 모든 폴더 경로를 수집
	const allDirs = new Set<string>();
	for (const dir of folderMeta.keys()) allDirs.add(dir);
	for (const page of pages) {
		if (page.dirPath) allDirs.add(page.dirPath);
	}

	// 4. 트리 구성
	const root: Map<string, GuideItem> = new Map();

	// 폴더 노드 생성 (부모 경로를 재귀적으로 보장)
	function ensureFolder(dirPath: string): GuideItem {
		if (root.has(dirPath)) return root.get(dirPath)!;

		const parts = dirPath.split('/');
		const folderName = parts.pop()!;
		const parentPath = parts.join('/');
		const meta = folderMeta.get(dirPath);

		const folder: GuideItem = {
			id: dirPath,
			title: meta?.title ?? folderName,
			icon: meta?.icon,
			type: 'folder',
			order: meta?.order ?? 999,
			children: [],
		};

		root.set(dirPath, folder);

		if (parentPath) {
			const parent = ensureFolder(parentPath);
			if (!parent.children!.some((c) => c.id === folder.id)) {
				parent.children!.push(folder);
			}
		}

		return folder;
	}

	// 모든 폴더 보장
	for (const dir of allDirs) {
		ensureFolder(dir);
	}

	// 페이지를 폴더에 추가
	for (const page of pages) {
		const item: GuideItem = {
			id: page.id,
			title: page.title,
			type: 'page',
			order: page.order,
			content: {
				title: page.title,
				description: page.description,
				body: page.body,
			},
		};

		if (page.dirPath) {
			const parent = root.get(page.dirPath);
			if (parent) {
				parent.children!.push(item);
			}
		}
	}

	// 5. 정렬 (order → title)
	function sortItems(items: GuideItem[]): GuideItem[] {
		items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));
		for (const item of items) {
			if (item.children) sortItems(item.children);
		}
		return items;
	}

	// 6. 최상위 폴더만 수집
	const topLevel: GuideItem[] = [];
	for (const [dirPath, folder] of root.entries()) {
		if (!dirPath.includes('/')) {
			topLevel.push(folder);
		}
	}

	return sortItems(topLevel);
}

export const GUIDE_TREE: GuideItem[] = buildGuideTree();

// ──────────────────────────────────────────────
// 가이드 유틸리티 함수
// ──────────────────────────────────────────────

/** ID로 가이드 항목을 재귀적으로 찾습니다 */
export function findGuideItem(items: GuideItem[], id: string): GuideItem | null {
	for (const item of items) {
		if (item.id === id) return item;
		if (item.children) {
			const found = findGuideItem(item.children, id);
			if (found) return found;
		}
	}
	return null;
}

/** ID로 breadcrumb 경로를 생성합니다 */
export function buildBreadcrumb(
	items: GuideItem[],
	targetId: string,
	path: GuideItem[] = [],
): GuideItem[] | null {
	for (const item of items) {
		const newPath = [...path, item];
		if (item.id === targetId) return newPath;
		if (item.children) {
			const result = buildBreadcrumb(item.children, targetId, newPath);
			if (result) return result;
		}
	}
	return null;
}

/** 가이드 트리에서 검색합니다 */
export function searchGuide(items: GuideItem[], query: string): GuideItem[] {
	const results: GuideItem[] = [];
	const q = query.toLowerCase();

	function search(list: GuideItem[]) {
		for (const item of list) {
			if (item.type === 'page') {
				const titleMatch = item.title.toLowerCase().includes(q);
				const bodyMatch = item.content?.body?.toLowerCase().includes(q);
				const descMatch = item.content?.description?.toLowerCase().includes(q);
				if (titleMatch || bodyMatch || descMatch) {
					results.push(item);
				}
			}
			if (item.children) search(item.children);
		}
	}

	search(items);
	return results;
}
