import { localizeHref, type Locale } from '#lib/paraglide/runtime.js';

/**
 * Localize an app path for the current locale. Every internal link must go
 * through this: `resolve()` alone yields an unprefixed path, and an unprefixed
 * page must never be linked, crawled or prerendered.
 */
export function href(path: string, locale?: Locale): string {
	return localizeHref(path, locale ? { locale } : undefined);
}
