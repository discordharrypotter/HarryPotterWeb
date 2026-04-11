/**
 * 마크다운 파일의 YAML frontmatter를 파싱합니다.
 */
export function parseFrontmatter(raw: string): {
	meta: Record<string, string>;
	body: string;
} {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) return { meta: {}, body: raw.trim() };

	const meta: Record<string, string> = {};
	for (const line of match[1].split('\n')) {
		const idx = line.indexOf(':');
		if (idx === -1) continue;
		const key = line.slice(0, idx).trim();
		const value = line
			.slice(idx + 1)
			.trim()
			.replace(/^["']|["']$/g, '');
		if (key) meta[key] = value;
	}

	return { meta, body: match[2].trim() };
}

/**
 * 버전 문자열을 비교 가능한 숫자 배열로 변환합니다.
 * "2.1.0" → [2, 1, 0]
 */
function parseVersion(v: string): number[] {
	return v.split('.').map(Number);
}

/**
 * 두 버전을 비교합니다. (내림차순 정렬용)
 * 반환 : 양수면 a가 앞, 음수면 b가 앞
 */
export function compareVersionsDesc(a: string, b: string): number {
	const pa = parseVersion(a);
	const pb = parseVersion(b);
	for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
		const diff = (pb[i] ?? 0) - (pa[i] ?? 0);
		if (diff !== 0) return diff;
	}
	return 0;
}
