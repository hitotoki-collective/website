import { redirect } from '@sveltejs/kit';
import { cookieMaxAge, cookieName, isLocale, localizeHref } from '#lib/paraglide/runtime.js';
import type { RequestHandler } from './$types';

// Remembers an explicit language choice without client-side JavaScript: the
// language menu links here, the Worker sets Paraglide's locale cookie, then
// redirects to the chosen page. The cookie beats Accept-Language on the next
// visit to `/`. Functional cookie only; no consent banner is needed.
export const prerender = false;

export const GET: RequestHandler = ({ params, url, cookies }) => {
	const tag = params.tag;
	if (!isLocale(tag)) redirect(303, '/');
	// Only same-site paths: never bounce to another origin.
	const to = url.searchParams.get('to') ?? '/';
	const path = to.startsWith('/') && !to.startsWith('//') ? to : '/';
	cookies.set(cookieName, tag, { path: '/', maxAge: cookieMaxAge, sameSite: 'lax' });
	redirect(303, localizeHref(path, { locale: tag }));
};
