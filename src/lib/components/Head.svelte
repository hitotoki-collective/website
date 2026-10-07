<script lang="ts">
	import { page } from '$app/state';
	import { baseLocale, deLocalizeUrl, getLocale, locales } from '#lib/paraglide/runtime.js';
	import { href } from '#lib/i18n/href.js';
	import { SITE_NAME, SITE_ORIGIN, absolute } from '#lib/site.js';
	import seal from '/src/content/archive/core/seal/seal.svg?url';

	// Per-page document head: title, description, canonical, hreflang for every
	// locale plus x-default, Open Graph and Twitter cards, a per-locale feed link,
	// and JSON-LD. The Organization node rides on every page; pages add their own.
	let {
		title,
		description,
		image = '/og.png',
		imageAlt = SITE_NAME,
		type = 'website',
		schema = [],
		preloadImage
	}: {
		title: string;
		description: string;
		image?: string;
		imageAlt?: string;
		type?: 'website' | 'article';
		schema?: Record<string, unknown>[];
		/** The page's largest image, fetched before the parser reaches it. */
		preloadImage?: { srcset: string; sizes: string; type: string; media?: string }[];
	} = $props();

	const locale = $derived(getLocale());
	const path = $derived(deLocalizeUrl(page.url.href).pathname);
	const canonical = $derived(absolute(href(path)));
	const alternates = $derived(locales.map((tag) => ({ tag, url: absolute(href(path, tag)) })));
	const ogLocale = (tag: string) => tag.replace('-', '_');

	const organization = {
		'@type': 'Organization',
		'@id': `${SITE_ORIGIN}/#organization`,
		name: SITE_NAME,
		alternateName: '一時',
		url: SITE_ORIGIN + '/',
		logo: absolute(seal),
		email: 'contact@hitotoki-collective.org'
	};
	// Serialised here with the closing tag split: a literal closing script tag
	// inside a Svelte file would end the surrounding script block.
	const jsonLd = $derived(
		'<script type="application/ld+json">' +
			JSON.stringify({
				'@context': 'https://schema.org',
				'@graph': [organization, ...schema]
			}).replace(/</g, '\\u003c') +
			'</scr' +
			'ipt>'
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#each preloadImage ?? [] as pre (pre.media ?? 'all')}
		<link
			rel="preload"
			as="image"
			imagesrcset={pre.srcset}
			imagesizes={pre.sizes}
			type={pre.type}
			media={pre.media}
			fetchpriority="high"
		/>
	{/each}
	{#each alternates as alt (alt.tag)}
		<link rel="alternate" hreflang={alt.tag} href={alt.url} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={absolute(href(path, baseLocale))} />
	<link
		rel="alternate"
		type="application/feed+json"
		href={absolute(href('/feed.json'))}
		title={SITE_NAME}
	/>

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={absolute(image)} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta property="og:locale" content={ogLocale(locale)} />
	{#each alternates.filter((a) => a.tag !== locale) as alt (alt.tag)}
		<meta property="og:locale:alternate" content={ogLocale(alt.tag)} />
	{/each}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={absolute(image)} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD is data, not executed -->
	{@html jsonLd}
</svelte:head>
