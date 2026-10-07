<script lang="ts">
	import '#lib/styles/tokens.css';
	import '#lib/styles/base.css';
	// Latin, Cyrillic, Arabic and Devanagari faces: tiny per-subset stylesheets
	// whose unicode-range keeps a Latin visitor from downloading other scripts.
	// One weight per face: the site sets no bold (font budget < 150 KB per locale).
	import '@fontsource/shippori-mincho/latin-400.css';
	import '@fontsource/noto-serif/latin-400.css';
	// CJK stylesheets are large (hundreds of sliced @font-face rules), so they
	// load as a <link> only for their own locale.
	import latinExt from '@fontsource/noto-serif/latin-ext-400.css?url';
	import cyrillic from '@fontsource/noto-serif/cyrillic-400.css?url';
	import arabic from '@fontsource/noto-naskh-arabic/arabic-400.css?url';
	import devanagari from '@fontsource/noto-serif-devanagari/devanagari-400.css?url';
	import sc400 from '@fontsource/noto-serif-sc/400.css?url';
	import kr400 from '@fontsource/noto-serif-kr/400.css?url';
	// Shippori's `japanese-*.css` points at one 1.4 MB file; `400.css` is the
	// sliced set with unicode-range, so a page downloads only the glyph blocks it uses.
	import shipporiJa400 from '@fontsource/shippori-mincho/400.css?url';
	import shipporiLatin400 from '@fontsource/shippori-mincho/files/shippori-mincho-latin-400-normal.woff2?url';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { deLocalizeUrl, getLocale, locales } from '#lib/paraglide/runtime.js';
	import { href } from '#lib/i18n/href.js';
	import * as m from '#lib/paraglide/messages.js';
	import Seal from '#lib/components/Seal.svelte';
	import favicon from '/src/content/archive/core/favicon.ico?url';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const nav = [
		{ href: '/performances', label: m.nav_performances },
		{ href: '/about', label: m.nav_about },
		{ href: '/journal', label: m.nav_journal }
	] as const;

	const locale = $derived(getLocale());
	// Script-specific stylesheets, one set per locale, so a page only declares
	// the faces its own script needs (and never fetches another script's).
	const perLocale: Record<string, string[]> = {
		fr: [latinExt],
		de: [latinExt],
		it: [latinExt],
		pt: [latinExt],
		es: [latinExt],
		ru: [cyrillic],
		ar: [arabic],
		hi: [devanagari],
		ja: [shipporiJa400],
		'zh-Hans': [sc400],
		ko: [kr400]
	};
	const extraStyles = $derived(perLocale[locale] ?? []);
	// Latin-script locales paint their first heading in this file; fetch it first.
	const preloadDisplay = $derived(!['ja', 'zh-Hans', 'ko', 'ar', 'hi'].includes(locale));
	const languageName = (tag: string) =>
		new Intl.DisplayNames([tag], { type: 'language' }).of(tag) ?? tag;
	const isHome = $derived(page.route.id === '/');
	// An explicit choice must outlive this visit and beat Accept-Language next
	// time: the link goes through /locale/<tag>, which sets the cookie server-side
	// and redirects to the same page in that language. No JavaScript involved.
	const choose = (tag: string) =>
		href(`/locale/${tag}?to=${encodeURIComponent(deLocalizeUrl(page.url.href).pathname)}`);
</script>

<svelte:head>
	<link rel="icon" href={favicon} sizes="any" />
	{#each extraStyles as sheet (sheet)}
		<link rel="stylesheet" href={sheet} />
	{/each}
	{#if preloadDisplay}
		<link
			rel="preload"
			as="font"
			type="font/woff2"
			href={shipporiLatin400}
			crossorigin="anonymous"
		/>
	{/if}
	<meta name="theme-color" content="#1d2740" />
</svelte:head>

<a class="skip" href="#content">{m.skip_to_content()}</a>

<header class="cloth" class:on-cover={isHome}>
	<a href={href(resolve('/'))} class="brand" aria-label={m.site_name()}>
		<Seal size="1.75rem" decorative />
		<span>{m.site_name()}</span>
	</a>
	<nav aria-label={m.nav_home()}>
		<ul>
			{#each nav as item (item.href)}
				<li>
					<a
						href={href(resolve(item.href))}
						aria-current={page.url.pathname.includes(item.href) ? 'page' : undefined}
					>
						{item.label()}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<nav aria-label={m.nav_language()} class="languages">
		<details>
			<summary><span lang={locale}>{languageName(locale)}</span></summary>
			<ul>
				{#each locales as tag (tag)}
					<li>
						<a
							href={choose(tag)}
							hreflang={tag}
							lang={tag}
							aria-current={tag === locale ? 'true' : undefined}
						>
							{languageName(tag)}
						</a>
					</li>
				{/each}
			</ul>
		</details>
	</nav>
</header>

<main id="content">
	{@render children()}
</main>

<footer class="cloth colophon">
	<div class="colophon-inner">
		<Seal size="2.5rem" decorative />
		<div>
			<p class="name">{m.site_name()} <span lang="ja">{m.site_name_ja()}</span></p>
			<p>
				<a href="mailto:contact@hitotoki-collective.org">{m.colophon_contact()}</a>
			</p>
			<p class="small">{m.colophon_licence()}</p>
		</div>
	</div>
</footer>

<style>
	.cloth {
		background: var(--texture-cover) var(--cover);
		color: var(--cover-ink);
	}

	header {
		border-block-end: 1px solid color-mix(in oklab, var(--cover-ink) 14%, transparent);
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3) var(--gutter);
		font-family: var(--font-display);
		font-size: var(--step--1);
	}
	/* On the home page the header sits over the cover and is the same cloth. */
	header.on-cover {
		position: absolute;
		inset-inline: 0;
		inset-block-start: 0;
		background: transparent;
		border-block-end: 0;
		z-index: 2;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		text-decoration: none;
		margin-inline-end: auto;
		letter-spacing: 0.04em;
	}

	nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: var(--space-4);
	}
	nav a {
		text-decoration: none;
		padding-block: var(--space-1);
		border-block-end: 1px solid transparent;
	}
	nav a:hover,
	nav a[aria-current] {
		border-block-end-color: currentColor;
	}

	.languages {
		position: relative;
	}
	.languages summary {
		cursor: pointer;
		list-style: none;
		padding-block: var(--space-1);
		min-block-size: 24px;
	}
	.languages summary::-webkit-details-marker {
		display: none;
	}
	.languages summary::after {
		content: '';
		display: inline-block;
		inline-size: 0.45em;
		block-size: 0.45em;
		margin-inline-start: 0.5em;
		border-inline-end: 1px solid currentColor;
		border-block-end: 1px solid currentColor;
		rotate: 45deg;
		translate: 0 -0.2em;
	}
	.languages ul {
		/* Twelve scripts in one list: the system font, so the menu never pulls
		   Cyrillic, Arabic or Devanagari webfonts onto a page that has none. */
		font-family: system-ui, sans-serif;
		position: absolute;
		inset-inline-end: 0;
		inset-block-start: calc(100% + var(--space-2));
		display: grid;
		grid-template-columns: repeat(2, max-content);
		gap: var(--space-1) var(--space-4);
		padding: var(--space-3) var(--space-4);
		background: var(--page);
		color: var(--ink);
		border: 1px solid var(--rule);
		box-shadow: 0 10px 30px -12px rgb(0 0 0 / 0.45);
		z-index: 5;
	}
	.languages ul a[aria-current] {
		color: var(--stamp);
	}

	main {
		min-height: 60svh;
	}

	.colophon {
		margin-block-start: var(--space-7);
		padding: var(--space-6) var(--gutter) var(--space-7);
	}
	.colophon-inner {
		display: flex;
		gap: var(--space-4);
		align-items: flex-start;
		max-width: 72rem;
		margin-inline: auto;
	}
	.colophon p {
		margin-block-end: var(--space-2);
	}
	.colophon .name {
		font-family: var(--font-display);
		font-size: var(--step-1);
		letter-spacing: 0.04em;
	}
	.colophon .name span {
		margin-inline-start: var(--space-2);
		color: var(--cover-ink-soft);
	}
	.colophon .small {
		font-size: var(--step--1);
		color: var(--cover-ink-soft);
	}

	@media (max-width: 40rem) {
		header {
			flex-wrap: wrap;
			gap: var(--space-3);
		}
		.brand span {
			position: absolute;
			inline-size: 1px;
			block-size: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
		nav ul {
			gap: var(--space-3);
		}
	}
</style>
