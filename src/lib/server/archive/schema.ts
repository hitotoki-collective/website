import { z } from 'zod';

// Typed shape of a PRF-<NN>-MANIFEST.md once parsed. The manifest is hand-written
// prose (see src/content/archive/CLAUDE.md); this is the subset the site reads.
// Anything the manifest leaves as TODO is dropped from the lists and named in
// `incomplete`, so a page can say "and others" instead of inventing a name.

export const performanceCode = z.string().regex(/^PRF-\d{2}$/);

const name = z.string().trim().min(1);

export const artist = z.object({
	name,
	type: z.string().min(1),
	instrument: z.string().min(1)
});

export const crewMember = z.object({
	name,
	role: z.string().min(1)
});

export const person = z.object({ name });

export const hostLinks = z.object({
	googleMaps: z.url().optional(),
	website: z.url().optional(),
	wikipedia: z.url().optional()
});

export const segment = z.object({
	id: z.string().regex(/^SEG-\d{2}$/),
	startSeconds: z.number().nonnegative(),
	content: z.string().min(1)
});

export const montage = z.object({
	id: z.string().regex(/^MON-\d{2}$/),
	title: z.string().optional(),
	// null when the montage was supplied from elsewhere and has no audio offset
	audioFromSeconds: z.number().nonnegative().nullable()
});

export const performanceManifest = z.object({
	code: performanceCode,
	number: z.number().int().min(1).max(99),
	title: z.string().min(1),
	date: z.iso.date(),
	time: z.string().regex(/^\d{2}:\d{2}$/),
	country: z.string().min(1),
	location: z.string().min(1),
	host: z.object({
		name: z.string().min(1),
		links: hostLinks
	}),
	space: z.string().optional(),
	participants: z.object({
		artists: z.array(artist).min(1),
		crew: z.array(crewMember),
		executiveProducers: z.array(person),
		assistants: z.array(person),
		guests: z.array(person)
	}),
	// Crew lists are OCR'd from closing credits and marked unverified upstream.
	crewVerified: z.boolean(),
	// Participant sections that still carry a TODO placeholder.
	incomplete: z.array(z.enum(['artists', 'crew', 'executiveProducers', 'assistants', 'guests'])),
	links: z.object({
		film: z.url().optional(),
		stills: z.url().optional()
	}),
	segments: z.array(segment),
	montages: z.array(montage)
});

export type PerformanceManifest = z.infer<typeof performanceManifest>;
export type Artist = z.infer<typeof artist>;
export type CrewMember = z.infer<typeof crewMember>;
export type Segment = z.infer<typeof segment>;
export type Montage = z.infer<typeof montage>;
