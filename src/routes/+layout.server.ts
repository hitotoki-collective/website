import type { LayoutServerLoad } from './$types';

// Every route is static content; prerender the whole tree. The archive and the
// site content are read at build time, so nothing here needs a request.
export const prerender = true;
// No hydration: every route is legible and operable as plain HTML and CSS
// (requirement), and the JS budget is spent nowhere. Re-enable per route
// when a component genuinely needs it.
export const csr = false;

export const load: LayoutServerLoad = () => ({});
