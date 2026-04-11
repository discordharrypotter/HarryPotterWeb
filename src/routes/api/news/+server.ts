import { json } from '@sveltejs/kit';
import { getNews } from '$lib/server/cafe';

export const prerender = false;

export async function GET() {
	const news = await getNews();
	return json(news, {
		headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
	});
}
