import { defineParams } from '@sveltejs/kit/params';
import { z } from 'zod';

// SvelteKit loads this file with Node directly, outside Vite, so it cannot use
// the #lib import map. Keep it self-contained.
export const params = defineParams({
	/** A performance code as the archive names its folders: `PRF-01` … `PRF-99`. */
	code: z.string().regex(/^PRF-\d{2}$/)
});
