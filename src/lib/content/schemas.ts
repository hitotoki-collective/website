import { z } from 'zod';

// Front matter schemas for site-authored content under src/content/<type>/.
// A file that fails its schema fails the build (see report-plugin.ts).

export const page = z.object({
	title: z.string().min(1),
	description: z.string().min(1).optional()
});

export const journal = z.object({
	title: z.string().min(1),
	date: z.iso.date(),
	summary: z.string().min(1)
});

export const collections = {
	pages: page,
	journal
} as const;

export type CollectionName = keyof typeof collections;
export type Frontmatter<T extends CollectionName> = z.infer<(typeof collections)[T]>;

export function isCollectionName(s: string): s is CollectionName {
	return Object.hasOwn(collections, s);
}
