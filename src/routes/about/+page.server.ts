import { error } from '@sveltejs/kit';
import { getLocale } from '#lib/paraglide/runtime.js';
import { loadEntry } from '#lib/server/content/index.js';
import { renderToHtml } from '#lib/server/render.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const about = loadEntry('pages', 'about', getLocale());
	if (!about) error(404);
	return {
		title: about.entry.data.title,
		description: about.entry.data.description,
		fallback: about.fallback,
		html: renderToHtml(about.component)
	};
};
