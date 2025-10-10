// Centralized URL and route definitions used across the app
// Import these in nav, footer, buttons, and sections to avoid hardcoding hrefs

// Base paths (helpful if you ever need to change domain/subpath)
export const BASE_URL = '';

// Internal app routes
export const ROUTES = Object.freeze({
	HOME: '/',
	COMMUNITY: '/#community',
	STORY: '/#story',
	RENDERS: '/#renders',
	VIBE: '/#vibe',
	FAQ: '/#faqs',
	COMING_SOON: '/#coming-soon',
});

// External URLs (update as needed)
export const EXTERNAL = Object.freeze({
	TWITTER: 'https://x.com/',
	DISCORD: 'https://discord.gg/',
	GITHUB: 'https://github.com/',
	INSTAGRAM: 'https://instagram.com/',
	REDDIT: 'https://reddit.com/',
	YOUTUBE: 'https://youtube.com/',
	PRODUCT_UNCTRL_RAGE_CONTROLLER: 'https://gameunctrl.com/products/unctrl-rage-controller?variant=50968693932352',
	COMMUNITY_PAGE: 'https://gameunctrl.com/pages/community',
	BLOG: 'https://gameunctrl.com/pages/blog',
	ABOUT_US: 'https://gameunctrl.com/pages/about-us',
	DOWNLOADS: 'https://gameunctrl.com/pages/downloads',
	SUPPORT: 'https://gameunctrl.com/pages/support',
	PRIVACY_POLICY: 'https://gameunctrl.com/pages/privacy-policy',
	TERMS_AND_CONDITIONS: 'https://gameunctrl.com/pages/terms-conditions',
	FAQS_PAGE: 'https://gameunctrl.com/pages/faqs',
	RETURNS_AND_REFUNDS: 'https://gameunctrl.com/pages/returns-refund',
	SHIPPING_POLICY: 'https://gameunctrl.com/pages/shipping-policy',
	CONTACT_US: 'https://gameunctrl.com/pages/contact',
	WARRANTY: 'https://gameunctrl.com/pages/warranty',
});

// Social links consolidated (rename or expand as needed)
export const SOCIAL_LINKS = Object.freeze({
	x: EXTERNAL.TWITTER,
	discord: EXTERNAL.DISCORD,  
	github: EXTERNAL.GITHUB,
	instagram: EXTERNAL.INSTAGRAM,
	youtube: EXTERNAL.YOUTUBE,
});

// Common navigation links (primary nav)
export const NAV_LINKS = Object.freeze([
	{ label: 'Home', href: ROUTES.HOME },
	{ label: 'Products', href: EXTERNAL.PRODUCT_UNCTRL_RAGE_CONTROLLER },
	{ label: 'About Us', href: EXTERNAL.ABOUT_US },
	{ label: 'Community', href: EXTERNAL.COMMUNITY_PAGE },
	{ label: 'Blog', href: EXTERNAL.BLOG },
]);

// Footer links (grouped by section if needed)
export const FOOTER_LINK_GROUPS = Object.freeze([
	{
		title: 'Column 1',
		links: [
			{ label: 'Instagram', href: EXTERNAL.INSTAGRAM, external: true },
			{ label: 'Reddit', href: EXTERNAL.REDDIT, external: true },
			{ label: 'Discord', href: EXTERNAL.DISCORD, external: true },
			{ label: 'Blog', href: EXTERNAL.BLOG },
		],
	},
	{
		title: 'Column 2',
		links: [
			{ label: 'Sitemap', href: '/sitemap.xml' },
			{ label: 'Downloads', href: EXTERNAL.DOWNLOADS },
			{ label: 'Join the community', href: EXTERNAL.COMMUNITY_PAGE },
		],
	},
]);

// Common buttons/CTAs used across the site (by semantic name)
export const CTA_LINKS = Object.freeze({
	joinCommunity: EXTERNAL.COMMUNITY_PAGE,
	followOnX: SOCIAL_LINKS.x,
	watchTrailer: ROUTES.VIBE,
	learnMoreStory: ROUTES.STORY,
	getStarted: ROUTES.COMMUNITY,
	orderNow: EXTERNAL.PRODUCT_UNCTRL_RAGE_CONTROLLER,
});

// Utility: get link by key from ROUTES, EXTERNAL, SOCIAL_LINKS, or CTA_LINKS
export function getLink(key) {
	if (!key) return '';
	const maps = [ROUTES, EXTERNAL, SOCIAL_LINKS, CTA_LINKS];
	for (const map of maps) {
		if (Object.prototype.hasOwnProperty.call(map, key)) return map[key];
	}
	return '';
}

// Example usage:
// import { NAV_LINKS, CTA_LINKS, ROUTES } from '@/config/links';
// <Link href={ROUTES.COMMUNITY}>Community</Link>
// <UnCtrlButton href={CTA_LINKS.joinCommunity} external>Join Discord</UnCtrlButton>


