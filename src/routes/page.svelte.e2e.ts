import { expect, test } from '@playwright/test';

test('the root redirects to a locale-prefixed URL', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/\/en\/?$/);
	await expect(page.locator('h1')).toBeVisible();
});

test('an unprefixed page redirects rather than rendering', async ({ page }) => {
	await page.goto('/about');
	await expect(page).toHaveURL(/\/en\/about$/);
});

test('html carries lang and dir for an LTR locale', async ({ page }) => {
	await page.goto('/ja/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
	await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

test('html carries lang and dir for the RTL locale', async ({ page }) => {
	await page.goto('/ar/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
	await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('internal links keep the locale prefix', async ({ page }) => {
	await page.goto('/ja/');
	const hrefs = await page
		.locator('main a[href^="/"], header a[href^="/"]')
		.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
	expect(hrefs.length).toBeGreaterThan(0);
	for (const h of hrefs) expect(h).toMatch(/^\/[a-z]{2}(-[A-Za-z]{4})?(\/|$)/);
});

test('pages ship no client-side JavaScript', async ({ page }) => {
	await page.goto('/en/performances/PRF-01');
	expect(await page.locator('script[src], script[type="module"]').count()).toBe(0);
});

test('a performance page renders from the archive manifest', async ({ page }) => {
	await page.goto('/en/performances/PRF-01');
	await expect(page.locator('h1')).toHaveText('Dai-Kaku-Ji temple');
	await expect(page.getByText('Taro Nordberg')).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Forty Minutes Above the Pond' })).toBeVisible();
});

test('the about page renders the approved text', async ({ page }) => {
	await page.goto('/en/about');
	await expect(page.locator('h1')).toHaveText('Hitotoki Collective');
	await expect(page.getByText('economics of culture')).toBeVisible();
});

test('a missing translation falls back to English and says so', async ({ page }) => {
	await page.goto('/ja/about');
	await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
	await expect(page.getByRole('note')).toBeVisible();
});

test('every page carries canonical, hreflang for all locales and JSON-LD', async ({ page }) => {
	await page.goto('/ja/performances/PRF-01');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		/\/ja\/performances\/PRF-01$/
	);
	expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(13); // 12 + x-default
	await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
		'href',
		/\/en\/performances\/PRF-01$/
	);
	const ld = JSON.parse(
		(await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}'
	);
	const types = ld['@graph'].map((n: { '@type': string }) => n['@type']);
	expect(types).toEqual(['Organization', 'Event']);
	expect(ld['@graph'][1].performer.map((p: { name: string }) => p.name)).toContain('Taro Nordberg');
});

test('choosing a language is remembered on the next visit to the root', async ({
	page,
	context
}) => {
	await page.goto('/en/');
	await page.getByRole('navigation', { name: 'Language' }).locator('summary').click();
	await page.getByRole('link', { name: '日本語' }).click();
	// /en/locale/ja?to=/ sets the cookie and redirects
	await expect(page).toHaveURL(/\/ja\/?$/);
	const cookie = (await context.cookies()).find((c) => c.name === 'PARAGLIDE_LOCALE');
	expect(cookie?.value).toBe('ja');
	await page.goto('/');
	await expect(page).toHaveURL(/\/ja\/?$/);
});

test('machine-readable files are served at the root and per locale', async ({ request }) => {
	const robots = await request.get('/robots.txt');
	expect(robots.status()).toBe(200);
	expect(await robots.text()).toContain('User-agent: GPTBot');
	const sitemap = await request.get('/sitemap.xml');
	expect(await sitemap.text()).toContain('hreflang="x-default"');
	const llms = await request.get('/llms.txt');
	expect(await llms.text()).toContain('# Hitotoki Collective');
	const feed = await request.get('/ja/feed.json');
	expect((await feed.json()).items.length).toBeGreaterThan(0);
});

test('an unknown performance code is a 404', async ({ page }) => {
	const response = await page.goto('/en/performances/PRF-99');
	expect(response?.status()).toBe(404);
});
