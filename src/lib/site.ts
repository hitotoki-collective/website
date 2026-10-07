import { PUBLIC_SITE_ORIGIN } from '$app/env/public';

// Production origin for canonical URLs, hreflang alternates, the sitemap,
// feeds and JSON-LD. Declared in src/env.ts; set PUBLIC_SITE_ORIGIN in the
// environment (see .env.example). The domain is not decided yet, so the
// fallback is a deliberately unusable placeholder.
export const SITE_ORIGIN = PUBLIC_SITE_ORIGIN;

export const SITE_NAME = 'Hitotoki Collective';
export const CONTACT_EMAIL = 'contact@hitotoki-collective.org';

export function absolute(path: string): string {
	return path.startsWith('http') ? path : SITE_ORIGIN + path;
}
