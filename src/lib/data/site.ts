import type { TeamMember, Feature, NavItem } from '$lib/types';

// ──────────────────────────────────────────────
// 사이트 기본 정보
// ──────────────────────────────────────────────

export const SITE = {
	botName: '디스코드 해리포터 봇',
	botInviteUrl:
		'https://discord.com/oauth2/authorize?client_id=947376659533824090&permissions=5629776559983680&scope=bot',
	supportServerUrl: 'https://discord.gg/UzB7Kn58ZA',
	naverCafeUrl: 'https://cafe.naver.com/discordharrypotter',
	githubUrl: 'https://github.com/discordharrypotter',
};

export const NAV_ITEMS: NavItem[] = [
	{ label: '홈', href: '/', icon: 'home' },
	{ label: '가이드', href: '/guide', icon: 'book' },
	{ label: '이용약관', href: '/terms', icon: 'file-text' },
	{ label: '개인정보 처리 방침', href: '/privacy', icon: 'shield' },
	{ label: '제재 규정', href: '/punishment', icon: 'alert-triangle' },
	{ label: '문의하기', href: '/contact', icon: 'mail' },
];

export const FEATURES: Feature[] = [
	{
		title: '마법 습득 시스템',
		description:
			'사용자가 다양한 마법을 습득하고 사용할 수 있는 시스템으로, 각 마법은 고유한 효과를 가지고 있습니다.',
	},
	{
		title: '퀘스트',
		description: '초기 퀘스트를 제공하여, 더욱 재미있고 몰입감 있는 경험을 제공합니다.',
	},
	{
		title: '지팡이 및 로브',
		description:
			'자신의 지팡이와 로브를 만들어 더욱 강력해질 수 있습니다. 다양한 재료를 모아 나만의 아이템을 만들어보세요.',
	},
	{
		title: '보물 시스템',
		description: '다양한 효과를 가진 보물을 수집하여 더욱 수월하게 게임을 진행할 수 있습니다.',
	},
	{
		title: '전투 시스템',
		description:
			'마법을 사용하여 마법 전투를 진행할 수 있으며, 여러 전략적인 요소가 가미되어 있습니다.',
	},
	{
		title: '다양한 이벤트',
		description:
			'꾸준히 업데이트되는 콘텐츠와 이벤트를 통해 해리포터 봇을 더욱 재미있게 즐길 수 있습니다.',
	},
];

export const TEAM: TeamMember[] = [
	{
		name: 'kang87y',
		role: '총괄 및 개발자',
		avatar:
			'https://cdn.discordapp.com/avatars/577022814209703936/e0ebe1b7d3c07d36a0dfbf3c96a77057.webp?size=512',
		description: '잠은 죽어서 자는 것이다 - Prof.',
		links: [
			{ icon: 'github', url: 'https://github.com/kang87y', label: 'GitHub' },
			{ icon: 'email', url: 'mailto:contact@kang87y.com', label: 'Email' },
			{ icon: 'web', url: 'https://kang87y.com', label: 'Web' },
		],
	},
	{
		name: 'hutsol',
		role: '기획자',
		avatar:
			'https://cdn.discordapp.com/avatars/706474127804072018/119334893dc4134e189288059ffd2c29.webp?size=512',
		description: '해리포터봇을 즐겨주셔서 감사합니다!',
		links: [{ icon: 'email', url: 'mailto:nonec060512@gmail.com', label: 'Email' }],
	},
	{
		name: '_.sstar._',
		role: '커뮤니티 매니저',
		avatar:
			'https://cdn.discordapp.com/avatars/552132248783290409/7ffc2964946f8eccdb0864ff767268a6.webp?size=512',
		description: 'ee',
		links: [{ icon: 'email', url: 'mailto:sstarr621@naver.com', label: 'Email' }],
	},
	{
		name: '614project',
		role: '개발자',
		avatar: '',
		description: '안녕하세요!',
		links: [],
	},
	{
		name: 'vlzi',
		role: '개발자',
		avatar:
			'https://cdn.discordapp.com/avatars/835538261853732904/771b67ae8ec37e54114cfd710cce246d.webp?size=512',
		description: '현생에서 헤르미온느 중',
		links: [{ icon: 'web', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', label: 'Web' }],
	},
	{
		name: 'saintliy',
		role: '개발자',
		avatar: '',
		description: '안녕하세요!',
		links: [{ icon: 'email', url: 'mailto:saintliy4@gmail.com', label: 'Email' }],
	},
	{
		name: 'hongharam',
		role: '일러스트레이터',
		avatar: '',
		description: '안녕하세요!',
		links: [],
	},
	{
		name: 'liru__',
		role: '일러스트레이터',
		avatar: '',
		description: '안녕하세요!',
		links: [],
	},
	{
		name: '1231321235464321',
		role: '일러스트레이터',
		avatar:
			'https://cdn.discordapp.com/avatars/326692007558774787/9b63cb13dc9909d151ee517700f65e53.webp?size=512',
		description: '문어의 다리 중 두개가...',
		links: [{ icon: 'email', url: 'mailto:bumy0ng95@gmail.com', label: 'Email' }],
	},
];
