<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import Head from '#lib/components/Head.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Head
	title="{data.title} · {m.site_name()}"
	description={data.description ?? m.cover_line()}
	type="article"
/>

<article>
	<h1>{data.title}</h1>
	{#if data.fallback}
		<p role="note">{m.fallback_notice()}</p>
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-rendered from our own Markdown -->
	{@html data.html}
</article>
