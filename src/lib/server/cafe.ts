const CLUB_ID = 30587958;
const CAFE_URL = 'discordharrypotter';
const MENU_IDS = [4, 30]; // 공지사항, 패치노트 게시판 ID
const PER_PAGE = 5;
const CACHE_TTL = 5 * 60 * 1000; // 5분 주기 캐싱

const API_BASE = 'https://apis.naver.com/cafe-web/cafe2/ArticleListV2dot1.json';

interface CafeArticle {
	articleId: number;
	subject: string;
	writeDateTimestamp: number;
	menuName: string;
}

import type { NewsEntry } from '$lib/types';
export type { NewsEntry };

const TAG_MAP: Record<string, NewsEntry['tag']> = {
	공지: 'notice',
	업데이트: 'update',
	이벤트: 'event',
	점검: 'maintenance',
};

function parseTag(subject: string): { tag: NewsEntry['tag']; title: string } {
	const m = subject.match(/^\[(.+?)\]\s*/);
	if (m) {
		const tag = TAG_MAP[m[1]] ?? 'general';
		return { tag, title: subject.slice(m[0].length) };
	}
	return { tag: 'general', title: subject };
}

function formatDate(ts: number): string {
	const d = new Date(ts);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}.${m}.${day}`;
}

let cache: { data: NewsEntry[]; ts: number } | null = null;

async function fetchBoard(menuId: number): Promise<CafeArticle[]> {
	const url = `${API_BASE}?search.clubid=${CLUB_ID}&search.menuid=${menuId}&search.page=1&search.perPage=${PER_PAGE}&search.queryType=lastArticle`;
	const res = await fetch(url, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			Referer: `https://cafe.naver.com/${CAFE_URL}`,
		},
	});
	if (!res.ok) return [];
	const json = await res.json();
	return json?.message?.result?.articleList ?? [];
}

export async function getNews(): Promise<NewsEntry[]> {
	if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data;

	const boards = await Promise.all(MENU_IDS.map(fetchBoard));
	const all = boards.flat();

	all.sort((a, b) => b.writeDateTimestamp - a.writeDateTimestamp);
	const merged = all.slice(0, 10);

	const entries: NewsEntry[] = merged.map((a) => {
		const { tag, title } = parseTag(a.subject);
		return {
			tag,
			title,
			date: formatDate(a.writeDateTimestamp),
			href: `https://cafe.naver.com/${CAFE_URL}/${a.articleId}`,
		};
	});

	cache = { data: entries, ts: Date.now() };
	return entries;
}
