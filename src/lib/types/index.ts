export interface TeamMember {
	name: string;
	role: string;
	avatar: string;
	description: string;
	links?: { icon: string; url: string; label: string }[];
}

export interface Feature {
	title: string;
	description: string;
}

export interface VersionedDocument {
	version: string;
	date: string;
	label?: string;
	body: string;
}

export interface GuideItem {
	id: string;
	title: string;
	icon?: string;
	type: 'folder' | 'page';
	order?: number;
	children?: GuideItem[];
	content?: GuideContent;
}

export interface GuideContent {
	title: string;
	description?: string;
	body: string;
}

export interface GuideMeta {
	title: string;
	icon?: string;
	order?: number;
}

export interface NavItem {
	label: string;
	href: string;
	icon?: string;
}

export interface NewsEntry {
	tag: 'notice' | 'update' | 'event' | 'maintenance' | 'general';
	title: string;
	date: string;
	href: string;
}
