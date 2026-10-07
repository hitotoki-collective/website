import { getLocale } from '#lib/paraglide/runtime.js';
import { listEntries } from '#lib/server/content/index.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	posts: listEntries('journal', getLocale())
		.map(({ entry, fallback }) => ({
			slug: entry.slug,
			title: entry.data.title,
			date: entry.data.date,
			summary: entry.data.summary,
			fallback
		}))
		.sort((a, b) => b.date.localeCompare(a.date))
});
