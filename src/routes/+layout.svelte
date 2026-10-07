<script lang="ts">
	import '#lib/styles/tokens.css';
	import '#lib/styles/base.css';
	// Latin, Cyrillic, Arabic and Devanagari faces: tiny per-subset stylesheets
	// whose unicode-range keeps a Latin visitor from downloading other scripts.
	import '@fontsource/shippori-mincho/latin-400.css';
	import '@fontsource/shippori-mincho/latin-700.css';
	import '@fontsource/noto-serif/latin-400.css';
	import '@fontsource/noto-serif/latin-700.css';
	import '@fontsource/noto-serif/latin-ext-400.css';
	import '@fontsource/noto-serif/latin-ext-700.css';
	import '@fontsource/noto-serif/cyrillic-400.css';
	import '@fontsource/noto-serif/cyrillic-700.css';
	import '@fontsource/noto-naskh-arabic/arabic-400.css';
	import '@fontsource/noto-naskh-arabic/arabic-700.css';
	import '@fontsource/noto-serif-devanagari/devanagari-400.css';
	import '@fontsource/noto-serif-devanagari/devanagari-700.css';
	// CJK stylesheets are large (hundreds of sliced @font-face rules), so they
	// load as a <link> only for their own locale.
	import jp400 from '@fontsource/noto-serif-jp/400.css?url';
	import jp700 from '@fontsource/noto-serif-jp/700.css?url';
	import sc400 from '@fontsource/noto-serif-sc/400.css?url';
	import sc700 from '@fontsource/noto-serif-sc/700.css?url';
	import kr400 from '@fontsource/noto-serif-kr/400.css?url';
	import kr700 from '@fontsource/noto-serif-kr/700.css?url';
	import shipporiJa400 from '@fontsource/shippori-mincho/japanese-400.css?url';
	import shipporiJa700 from '@fontsource/shippori-mincho/japanese-700.css?url';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getLocale, locales } from '#lib/paraglide/runtime.js';
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
	const cjk: Record<string, string[]> = {
		ja: [jp400, jp700, shipporiJa400, shipporiJa700],
		'zh-Hans': [sc400, sc700],
		ko: [kr400, kr700]
	};
	const extraStyles = $derived(cjk[locale] ?? []);
	const languageName = (tag: string) =>
		new Intl.DisplayNames([tag], { type: 'language' }).of(tag) ?? tag;
	const isHome = $derived(page.route.id === '/');
</script>

<svelte:head>
	<link rel="icon" href={favicon} sizes="any" />
	{#each extraStyles as sheet (sheet)}
		<link rel="stylesheet" href={sheet} />
	{/each}
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
							href={href(page.url.pathname, tag)}
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
		background: var(--cover);
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
