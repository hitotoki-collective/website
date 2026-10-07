<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.title} · {m.site_name()}</title>
	{#if data.description}
		<meta name="description" content={data.description} />
	{/if}
</svelte:head>

<article>
	<h1>{data.title}</h1>
	{#if data.fallback}
		<p role="note">{m.fallback_notice()}</p>
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-rendered from our own Markdown -->
	{@html data.html}
</article>
