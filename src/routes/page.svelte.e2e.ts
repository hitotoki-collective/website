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

test('an unknown performance code is a 404', async ({ page }) => {
	const response = await page.goto('/en/performances/PRF-99');
	expect(response?.status()).toBe(404);
});
