<script lang="ts">
	import seal from '/src/content/archive/core/seal/seal.svg?url';
	import * as m from '#lib/paraglide/messages.js';

	// The 一時 seal from the archive's brand assets. The same file in both
	// schemes: vermilion ground, washi glyphs. Size is the caller's.
	let { size = '3rem', decorative = false }: { size?: string; decorative?: boolean } = $props();
</script>

<img
	src={seal}
	alt={decorative ? '' : m.seal_alt()}
	width="64"
	height="64"
	style:inline-size={size}
	style:block-size={size}
	decoding="async"
/>
