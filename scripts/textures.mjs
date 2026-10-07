#!/usr/bin/env node
// Generates the two material tiles the goshuinchō world is built on, so they
// are reproducible and carry no third-party licence:
//   washi.png   — warm-white paper with long, randomly laid fibres
//   brocade.png — indigo cloth, a fine twill weave with thread-level variation
// Both tiles wrap seamlessly. Run from the repository root:
//   node scripts/textures.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'src/lib/assets/textures';
await mkdir(OUT, { recursive: true });

// Deterministic PRNG so a re-run yields the same pixels.
function rng(seed) {
	let s = seed >>> 0;
	return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function canvas(size, [r, g, b]) {
	const px = new Float32Array(size * size * 3);
	for (let i = 0; i < size * size; i++) {
		px[i * 3] = r;
		px[i * 3 + 1] = g;
		px[i * 3 + 2] = b;
	}
	return px;
}

// Blend a colour into a wrapped pixel.
function dab(px, size, x, y, [r, g, b], a) {
	const xi = ((Math.round(x) % size) + size) % size;
	const yi = ((Math.round(y) % size) + size) % size;
	const i = (yi * size + xi) * 3;
	px[i] += (r - px[i]) * a;
	px[i + 1] += (g - px[i + 1]) * a;
	px[i + 2] += (b - px[i + 2]) * a;
}

async function write(name, px, size) {
	const buf = Buffer.alloc(size * size * 3);
	for (let i = 0; i < buf.length; i++) buf[i] = Math.max(0, Math.min(255, Math.round(px[i])));
	await sharp(buf, { raw: { width: size, height: size, channels: 3 } })
		.png({ compressionLevel: 9 })
		.toFile(`${OUT}/${name}.png`);
}

// ---- washi -----------------------------------------------------------------
{
	const size = 768;
	const base = [245, 240, 230];
	const px = canvas(size, base);
	const rand = rng(20251007);
	// soft mottling: the uneven thickness of hand-laid pulp
	for (let n = 0; n < 2200; n++) {
		const cx = rand() * size,
			cy = rand() * size,
			rad = 10 + rand() * 40;
		const tone = rand() < 0.5 ? [238, 231, 218] : [250, 246, 238];
		for (let k = 0; k < rad * 6; k++) {
			const ang = rand() * Math.PI * 2,
				d = Math.sqrt(rand()) * rad;
			dab(px, size, cx + Math.cos(ang) * d, cy + Math.sin(ang) * d, tone, 0.035);
		}
	}
	// long fibres, mostly pale, a few darker kozo strands
	for (let n = 0; n < 1400; n++) {
		const len = 20 + rand() * 140;
		const ang = rand() * Math.PI;
		let x = rand() * size,
			y = rand() * size;
		const dark = rand() < 0.12;
		const tone = dark ? [205, 196, 180] : [252, 250, 244];
		const alpha = dark ? 0.16 : 0.3;
		const wobble = (rand() - 0.5) * 0.02;
		for (let t = 0; t < len; t++) {
			x += Math.cos(ang + wobble * t);
			y += Math.sin(ang + wobble * t);
			dab(px, size, x, y, tone, alpha);
		}
	}
	await write('washi', px, size);
}

// ---- brocade ---------------------------------------------------------------
{
	const size = 512;
	const base = [29, 39, 64];
	const px = canvas(size, base);
	const rand = rng(1004);
	const light = [46, 58, 90];
	const shade = [20, 27, 46];
	// 2/2 twill: diagonal ribs of warp over weft, four threads per repeat
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const rib = (x + y) % 4;
			const tone = rib === 0 ? light : rib === 2 ? shade : null;
			if (tone) dab(px, size, x, y, tone, 0.32);
			// thread-level grain along the warp
			if (x % 2 === 0) dab(px, size, x, y, light, 0.08 + rand() * 0.06);
		}
	}
	// slubs: the occasional thicker thread of silk
	for (let n = 0; n < 160; n++) {
		const vertical = rand() < 0.5;
		const pos = Math.floor(rand() * size);
		const start = rand() * size,
			len = 10 + rand() * 50;
		for (let t = 0; t < len; t++) {
			if (vertical) dab(px, size, pos, start + t, light, 0.25);
			else dab(px, size, start + t, pos, light, 0.25);
		}
	}
	await write('brocade', px, size);
}

console.log(`wrote ${OUT}/washi.png and ${OUT}/brocade.png`);
