<script lang="ts">
	import { resolve } from '$app/paths';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { href } from '#lib/i18n/href.js';
	import * as m from '#lib/paraglide/messages.js';
	import Stamp from '#lib/components/Stamp.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const locale = $derived(getLocale());
	const pad = (n: number) => String(n).padStart(2, '0');
	const label = $derived(m.performance_label({ number: pad(data.number) }));
	const start = $derived(new Date(`${data.date}T${data.time}:00+09:00`));
	const when = $derived(
		new Intl.DateTimeFormat(locale, {
			dateStyle: 'long',
			timeStyle: 'short',
			timeZone: 'Asia/Tokyo'
		}).format(start)
	);
	const incomplete = (section: (typeof data.incomplete)[number]) =>
		data.incomplete.includes(section);
	const lead = $derived(data.stills[0]);
	const rest = $derived(data.stills.slice(1));
	const stillAlt = (index: number) =>
		m.still_alt({ index: pad(index), performance: label, place: data.host.name });
	const toPage = (code: string) => href(resolve('/performances/[code=code]', { code }));
</script>

<svelte:head>
	<title>{data.host.name} · {label} · {m.site_name()}</title>
	<meta
		name="description"
		content="{label}: {data.host.name}, {data.location}, {data.country}. {when}."
	/>
</svelte:head>

<article class="leaf">
	<!-- fold margin: the stamp, then the way to the neighbouring pages -->
	<aside class="margin">
		<Stamp number={data.number} date={data.date} time={data.time} />
		<nav class="folds" aria-label={m.home_pages()}>
			{#if data.newer}
				<a href={toPage(data.newer.code)} rel="next">
					<span class="dir">{m.leaf_next()}</span>
					<span class="to">{data.newer.host}</span>
				</a>
			{/if}
			{#if data.older}
				<a href={toPage(data.older.code)} rel="prev">
					<span class="dir">{m.leaf_previous()}</span>
					<span class="to">{data.older.host}</span>
				</a>
			{/if}
		</nav>
	</aside>

	<div class="page">
		<header class="head">
			<h1 class="place">{data.host.name}</h1>
			<p class="where">
				{data.location}, {data.country} ·
				<time datetime={start.toISOString()}>{when}</time>
			</p>
		</header>

		{#if lead}
			<figure class="lead">
				<enhanced:img
					src={lead.picture}
					alt={m.still_lead_alt({ performance: label, place: data.host.name })}
					sizes="(min-width: 80rem) 72rem, 94vw"
					loading="eager"
					fetchpriority="high"
				/>
			</figure>
		{/if}

		<div class="columns">
			<div class="reading">
				{#if data.space}
					<section aria-labelledby="space">
						<h2 id="space">{m.performance_place()}</h2>
						<p>{data.space}</p>
					</section>
				{/if}

				<section aria-labelledby="artists">
					<h2 id="artists">{m.performance_artists()}</h2>
					<ul class="people">
						{#each data.participants.artists as a (a.name)}
							<li>
								<span class="name">{a.name}</span>
								<span class="role"
									>{m.performance_instrument({ type: a.type, instrument: a.instrument })}</span
								>
							</li>
						{/each}
						{#if incomplete('artists')}<li class="others">{m.performance_and_others()}</li>{/if}
					</ul>
				</section>

				{#each data.texts as t (t.id)}
					<section class="text" aria-labelledby="text-{t.id}">
						<h2 id="text-{t.id}" class="visually-hidden">{m.performance_texts()}</h2>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-rendered from the archive's own Markdown -->
						<div class="prose">{@html t.html}</div>
						<p role="note">{m.performance_text_caveat()}</p>
					</section>
				{/each}

				{#if rest.length}
					<section class="stills" aria-labelledby="stills">
						<h2 id="stills">{m.performance_stills()}</h2>
						<ol class="pasted">
							{#each rest as s, i (s.id)}
								<li>
									<figure>
										<enhanced:img
											src={s.picture}
											alt={stillAlt(i + 1)}
											sizes="(min-width: 64rem) 36rem, 94vw"
											loading="lazy"
										/>
									</figure>
								</li>
							{/each}
						</ol>
						<p class="count">{m.performance_stills_count({ count: data.stillCount })}</p>
					</section>
				{/if}
			</div>

			<aside class="credits" aria-labelledby="credits">
				<h2 id="credits">{m.performance_credits()}</h2>

				<h3>{m.performance_crew()}</h3>
				{#if !data.crewVerified}
					<p role="note">{m.performance_crew_unverified()}</p>
				{/if}
				<ul class="people compact">
					{#each data.participants.crew as c (c.name)}
						<li><span class="name">{c.name}</span> <span class="role">{c.role}</span></li>
					{/each}
					{#if incomplete('crew')}<li class="others">{m.performance_and_others()}</li>{/if}
				</ul>

				<h3>{m.performance_executive_producers()}</h3>
				<ul class="people compact">
					{#each data.participants.executiveProducers as p (p.name)}<li>{p.name}</li>{/each}
					{#if incomplete('executiveProducers')}<li class="others">
							{m.performance_and_others()}
						</li>{/if}
				</ul>

				{#if data.participants.assistants.length || incomplete('assistants')}
					<h3>{m.performance_assistants()}</h3>
					<ul class="people compact">
						{#each data.participants.assistants as p (p.name)}<li>{p.name}</li>{/each}
						{#if incomplete('assistants')}<li class="others">{m.performance_and_others()}</li>{/if}
					</ul>
				{/if}

				{#if data.participants.guests.length || incomplete('guests')}
					<h3>{m.performance_guests()}</h3>
					<ul class="people compact">
						{#each data.participants.guests as p (p.name)}<li>{p.name}</li>{/each}
						{#if incomplete('guests')}<li class="others">{m.performance_and_others()}</li>{/if}
					</ul>
				{/if}

				<h3>{m.performance_links()}</h3>
				<ul class="links">
					{#if data.links.film}
						<li><a href={data.links.film} rel="external">{m.performance_watch()}</a></li>
					{/if}
					{#if data.links.stills}
						<li><a href={data.links.stills} rel="external">{m.performance_stills_link()}</a></li>
					{/if}
					{#if data.host.links.website}
						<li>
							<a href={data.host.links.website} rel="external">{m.performance_host_website()}</a>
						</li>
					{/if}
					{#if data.host.links.wikipedia}
						<li>
							<a href={data.host.links.wikipedia} rel="external">{m.performance_host_wikipedia()}</a
							>
						</li>
					{/if}
					{#if data.host.links.googleMaps}
						<li>
							<a href={data.host.links.googleMaps} rel="external">{m.performance_host_map()}</a>
						</li>
					{/if}
				</ul>
			</aside>
		</div>
	</div>
</article>

<style>
	.visually-hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	.leaf {
		display: grid;
		grid-template-columns: var(--fold) minmax(0, 1fr);
		max-width: 84rem;
		margin-inline: auto;
		padding-block: var(--space-5) var(--space-6);
		padding-inline-end: var(--gutter);
	}

	/* ---- fold margin ---- */
	.margin {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-5);
		padding-block-start: var(--space-3);
		border-inline-end: 1px solid var(--crease);
		box-shadow: inset -18px 0 22px -24px rgb(0 0 0 / 0.5);
	}
	.folds {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		writing-mode: vertical-rl;
		font-family: var(--font-display);
		font-size: var(--step-0);
	}
	.folds a {
		text-decoration: none;
		display: inline-flex;
		gap: var(--space-1);
		padding-inline: var(--space-2);
		min-inline-size: 24px;
	}
	.folds .dir {
		color: var(--ink-soft);
		letter-spacing: 0.08em;
	}
	.folds a:hover .to {
		text-decoration: underline;
	}

	/* ---- the page ---- */
	.page {
		padding-inline-start: var(--space-5);
		min-inline-size: 0;
	}
	.head {
		margin-block-end: var(--space-5);
	}
	.place {
		font-size: var(--step-4);
		font-weight: 400;
		line-height: 1.02;
		letter-spacing: -0.02em;
		margin-block-end: var(--space-3);
	}
	.where {
		font-size: var(--step-0);
		color: var(--ink-soft);
		margin: 0;
	}

	.lead {
		margin: 0 0 var(--space-6);
		background: var(--page-deep);
	}
	.lead :global(img) {
		inline-size: 100%;
		block-size: auto;
	}

	.columns {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(14rem, 20rem);
		gap: var(--space-6);
		align-items: start;
	}
	.reading > section {
		margin-block-end: var(--space-6);
	}
	.reading h2 {
		font-size: var(--step--1);
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin-block-end: var(--space-3);
	}

	.people {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-2);
	}
	.people li {
		display: grid;
		grid-template-columns: minmax(10rem, max-content) 1fr;
		gap: var(--space-3);
		padding-block-end: var(--space-2);
		border-block-end: 1px solid var(--rule);
	}
	.people .name {
		font-family: var(--font-display);
	}
	.people .role,
	.people .others {
		color: var(--ink-soft);
	}
	.people.compact li {
		grid-template-columns: 1fr;
		gap: 0;
	}

	.text .prose :global(h2) {
		font-family: var(--font-display);
		font-size: var(--step-2);
		letter-spacing: -0.01em;
		text-transform: none;
		color: var(--ink);
		margin-block-end: var(--space-4);
	}
	.text .prose :global(p) {
		font-size: var(--step-1);
		line-height: 1.6;
	}
	.text .prose :global(p:first-of-type)::first-letter {
		font-family: var(--font-display);
		font-size: 2.8em;
		float: inline-start;
		line-height: 0.85;
		padding-inline-end: 0.08em;
		color: var(--ink);
	}
	.text .prose :global(hr) {
		border: 0;
		border-block-start: 1px solid var(--rule);
		margin-block: var(--space-5);
		inline-size: 6rem;
	}
	.text .prose :global(hr ~ p) {
		font-size: var(--step--1);
		color: var(--ink-soft);
	}

	/* stills pasted between passages, alternating offset like photographs kept in a book */
	.pasted {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--space-5);
	}
	.pasted li:nth-child(even) {
		padding-inline-start: 12%;
	}
	.pasted li:nth-child(odd) {
		padding-inline-end: 12%;
	}
	.pasted figure {
		margin: 0;
		background: var(--page-deep);
		box-shadow: 0 10px 24px -16px rgb(0 0 0 / 0.45);
	}
	.pasted :global(img) {
		inline-size: 100%;
		block-size: auto;
	}
	.count {
		margin-block-start: var(--space-3);
		font-size: var(--step--1);
		color: var(--ink-soft);
	}

	.credits {
		position: sticky;
		inset-block-start: var(--space-4);
		font-size: var(--step-0);
	}
	.credits h2 {
		font-size: var(--step--1);
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin-block-end: var(--space-3);
	}
	.credits h3 {
		font-size: var(--step-0);
		margin-block: var(--space-4) var(--space-2);
	}
	.credits h3:first-of-type {
		margin-block-start: 0;
	}
	.links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-2);
	}

	@media (max-width: 64rem) {
		.columns {
			grid-template-columns: 1fr;
		}
		.credits {
			position: static;
			padding-block-start: var(--space-4);
			border-block-start: 1px solid var(--rule);
		}
	}

	@media (max-width: 48rem) {
		.leaf {
			grid-template-columns: 1fr;
			padding-inline: var(--gutter);
		}
		.margin {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-inline-end: 0;
			box-shadow: none;
			padding-block: 0 var(--space-4);
			margin-block-end: var(--space-4);
			border-block-end: 1px solid var(--crease);
		}
		.folds {
			writing-mode: horizontal-tb;
			flex-direction: row;
		}
		.folds a {
			flex-direction: column;
			gap: 0;
			text-align: end;
		}
		.page {
			padding-inline-start: 0;
		}
		.pasted li:nth-child(even),
		.pasted li:nth-child(odd) {
			padding-inline: 0;
		}
	}
</style>
