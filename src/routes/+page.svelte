<script lang="ts">
	import { resolve } from '$app/paths';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { href } from '#lib/i18n/href.js';
	import * as m from '#lib/paraglide/messages.js';
	import Seal from '#lib/components/Seal.svelte';
	import Stamp from '#lib/components/Stamp.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const locale = $derived(getLocale());
	const listFormat = $derived(new Intl.ListFormat(locale, { type: 'conjunction' }));
	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<svelte:head>
	<title>{m.site_name()} · {m.site_name_ja()}</title>
	<meta name="description" content={m.cover_line()} />
</svelte:head>

<!-- The closed book. Scrolling opens it: the pages below slide over the cover. -->
<section class="cover" aria-labelledby="cover-title">
	<div class="cover-inner">
		<Seal size="clamp(6rem, 24vmin, 12rem)" />
		<h1 id="cover-title">{m.site_name()}</h1>
		<p class="line">{m.cover_line()}</p>
	</div>
	<a class="open" href="#pages">{m.cover_open()}</a>
</section>

<!-- The accordion of leaves, newest first, folding sideways in the reading direction. -->
<section class="book" id="pages" aria-labelledby="pages-title">
	<h2 id="pages-title" class="visually-hidden">{m.home_pages()}</h2>
	<ol class="leaves">
		{#each data.leaves as leaf, i (leaf.code)}
			<li class="leaf" class:even={i % 2 === 1}>
				<article>
					<div class="margin">
						<Stamp number={leaf.number} date={leaf.date} time={leaf.time} />
					</div>
					<div class="body">
						<h3 class="place">
							<a href={href(resolve('/performances/[code=code]', { code: leaf.code }))}>
								{leaf.host}
							</a>
						</h3>
						<p class="where">{leaf.location}, {leaf.country}</p>
						{#if leaf.lead}
							<a
								class="photo"
								href={href(resolve('/performances/[code=code]', { code: leaf.code }))}
								tabindex="-1"
								aria-hidden="true"
							>
								<enhanced:img
									src={leaf.lead}
									alt=""
									sizes="(min-width: 64rem) 44vw, 92vw"
									loading={i === 0 ? 'eager' : 'lazy'}
									fetchpriority={i === 0 ? 'high' : 'auto'}
								/>
							</a>
						{/if}
						<p class="artists">{listFormat.format(leaf.artists)}</p>
						<p class="enter">
							<a href={href(resolve('/performances/[code=code]', { code: leaf.code }))}>
								{m.leaf_open()}
								<span aria-hidden="true">→</span>
							</a>
						</p>
					</div>
				</article>
			</li>
		{/each}
	</ol>
	<p class="count">
		{m.performance_label({ number: pad(data.leaves.length) })}
	</p>
</section>

{#if data.inscription}
	<!-- The inscription page: the collective's own words, from the approved text. -->
	<section class="inscription" aria-labelledby="inscription-title">
		<h2 id="inscription-title">{m.home_inscription()}</h2>
		{#if data.inscription.fallback}
			<p role="note">{m.fallback_notice()}</p>
		{/if}
		<div class="prose">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-rendered from our own Markdown -->
			{@html data.inscription.html}
		</div>
		<p class="more"><a href={href(resolve('/about'))}>{m.home_read_more()}</a></p>
	</section>
{/if}

<style>
	.visually-hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	/* ---- cover ---- */
	.cover {
		position: sticky;
		inset-block-start: 0;
		min-block-size: 100svh;
		display: grid;
		place-items: center;
		background:
			radial-gradient(
				120% 80% at 50% 120%,
				color-mix(in oklab, var(--cover) 70%, black) 0%,
				transparent 60%
			),
			var(--cover);
		color: var(--cover-ink);
		text-align: center;
		padding: var(--space-6) var(--gutter);
		z-index: 0;
	}
	.cover-inner {
		display: grid;
		justify-items: center;
		gap: var(--space-4);
	}
	.cover h1 {
		font-size: var(--step-1);
		font-weight: 400;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		margin: 0;
	}
	.cover .line {
		font-size: var(--step-0);
		color: var(--cover-ink-soft);
		max-width: 34ch;
		margin: 0;
	}
	.open {
		position: absolute;
		inset-block-end: var(--space-5);
		inset-inline-start: 50%;
		translate: -50% 0;
		font-family: var(--font-display);
		font-size: var(--step--1);
		letter-spacing: 0.1em;
		text-decoration: none;
		color: var(--cover-ink-soft);
		padding: var(--space-2) var(--space-3);
		border: 1px solid color-mix(in oklab, var(--cover-ink) 35%, transparent);
	}
	.open:hover {
		color: var(--cover-ink);
		border-color: currentColor;
	}

	/* ---- the book ---- */
	.book {
		position: relative;
		z-index: 1;
		background: var(--page);
		padding-block: var(--space-6) var(--space-5);
		box-shadow: 0 -18px 40px -24px rgb(0 0 0 / 0.6);
	}
	.leaves {
		list-style: none;
		margin: 0;
		padding: 0 var(--gutter);
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: min(88vw, 56rem);
		gap: 0;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: var(--gutter);
		scrollbar-width: thin;
		padding-block-end: var(--space-4);
	}
	.leaf {
		scroll-snap-align: start;
		position: relative;
		background: var(--page);
		/* the crease between leaves */
		border-inline-end: 1px solid var(--crease);
		box-shadow: inset -24px 0 28px -30px rgb(0 0 0 / 0.55);
	}
	.leaf.even {
		background: color-mix(in oklab, var(--page) 94%, var(--page-deep));
	}
	.leaf:last-child {
		border-inline-end: 0;
		box-shadow: none;
	}
	.leaf article {
		display: grid;
		grid-template-columns: var(--fold) 1fr;
		gap: var(--space-4);
		padding: var(--space-5) var(--space-5) var(--space-5) 0;
		block-size: 100%;
		align-content: start;
	}
	.margin {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-block-start: var(--space-2);
		overflow: visible;
	}
	.body {
		min-inline-size: 0;
	}
	.place {
		font-size: var(--step-3);
		font-weight: 400;
		margin-block-end: var(--space-1);
	}
	.place a {
		text-decoration: none;
	}
	.place a:hover {
		text-decoration: underline;
	}
	.where {
		color: var(--ink-soft);
		margin-block-end: var(--space-4);
	}
	.photo {
		display: block;
		margin-block-end: var(--space-3);
		background: var(--page-deep);
	}
	.photo :global(img) {
		inline-size: 100%;
		block-size: auto;
	}
	.artists {
		font-family: var(--font-display);
		font-size: var(--step-0);
		margin-block-end: var(--space-2);
	}
	.enter {
		margin: 0;
		font-size: var(--step--1);
	}
	.enter a {
		text-decoration: none;
		color: var(--stamp);
	}
	.enter a:hover {
		text-decoration: underline;
	}
	.count {
		font-family: var(--font-display);
		font-size: var(--step--1);
		color: var(--ink-soft);
		padding-inline: var(--gutter);
		margin: 0;
	}

	/* ---- inscription ---- */
	.inscription {
		position: relative;
		z-index: 1;
		background: var(--page);
		padding: var(--space-6) var(--gutter) 0;
		max-width: none;
	}
	.inscription > * {
		max-width: 40rem;
		margin-inline: auto;
	}
	.inscription h2 {
		font-size: var(--step--1);
		font-weight: 400;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.prose :global(h2) {
		font-size: var(--step-2);
	}
	.prose :global(p) {
		font-size: var(--step-1);
		line-height: 1.55;
		max-width: none;
	}
	.prose :global(p:first-of-type)::first-letter {
		font-family: var(--font-display);
		font-size: 2.6em;
		float: inline-start;
		line-height: 0.85;
		padding-inline-end: 0.08em;
		color: var(--stamp);
	}
	.more {
		margin-block-start: var(--space-4);
	}

	@media (max-width: 48rem) {
		.leaves {
			grid-auto-columns: 92vw;
		}
		.leaf article {
			grid-template-columns: 1fr;
			padding: var(--space-4);
		}
		.margin {
			justify-content: flex-start;
			padding: 0;
		}
	}
</style>
