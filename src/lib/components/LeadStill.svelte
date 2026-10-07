<script lang="ts">
	import type { Picture } from '@sveltejs/enhanced-img';

	// The page's largest image, hand-built from the enhanced-img Picture so that
	// phones get a capped candidate set: a 4K still on a 3× screen would
	// otherwise pull a 1200–1440 px file for a ~380 px column and miss the LCP
	// budget. Below `phoneMax` CSS px the browser may only choose from widths up
	// to `phoneCap`; wider viewports keep the full set.
	let {
		picture,
		alt,
		sizes,
		phoneMax = '48rem',
		phoneCap = 960
	}: {
		picture: Picture;
		alt: string;
		sizes: string;
		phoneMax?: string;
		phoneCap?: number;
	} = $props();

	const candidates = (srcset: string) =>
		srcset.split(',').map((c) => {
			const [url, w] = c.trim().split(/\s+/);
			return { url, w: Number.parseInt(w) };
		});
	const join = (list: { url: string; w: number }[]) =>
		list.map((c) => `${c.url} ${c.w}w`).join(', ');
	const phone = (srcset: string) => {
		const all = candidates(srcset);
		const capped = all.filter((c) => c.w <= phoneCap);
		return join(capped.length ? capped : all.slice(0, 1));
	};
	const media = $derived(`(max-width: ${phoneMax})`);
	const formats = $derived(Object.entries(picture.sources));
</script>

<picture>
	{#each formats as [format, srcset] (format)}
		<source {media} srcset={phone(srcset)} {sizes} type="image/{format}" />
	{/each}
	{#each formats as [format, srcset] (format)}
		<source {srcset} {sizes} type="image/{format}" />
	{/each}
	<img
		src={picture.img.src}
		width={picture.img.w}
		height={picture.img.h}
		{alt}
		{sizes}
		loading="eager"
		fetchpriority="high"
		decoding="async"
	/>
</picture>

<style>
	img {
		inline-size: 100%;
		block-size: auto;
	}
</style>
