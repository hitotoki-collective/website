import type { LayoutServerLoad } from './$types';

// Every route is static content; prerender the whole tree. The archive and the
// site content are read at build time, so nothing here needs a request.
export const prerender = true;

export const load: LayoutServerLoad = () => ({});
