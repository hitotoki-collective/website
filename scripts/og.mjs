#!/usr/bin/env node
// Generates static/og.png, the default Open Graph image: the 一時 seal on the
// brocade tile, 1200×630. No text is baked in, so one image serves every
// locale (the requirements forbid text in images). Run from the repository
// root after scripts/textures.mjs:
//   node scripts/og.mjs
import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';

const W = 1200;
const H = 630;
const tile = await sharp('src/lib/assets/textures/brocade.webp').png().toBuffer();
const { width: tw, height: th } = await sharp(tile).metadata();

const tiles = [];
for (let y = 0; y < H; y += th) {
	for (let x = 0; x < W; x += tw) tiles.push({ input: tile, left: x, top: y });
}

const sealSize = 280;
const seal = await sharp(await readFile('src/content/archive/core/seal/seal.svg'), { density: 300 })
	.resize(sealSize, sealSize)
	.png()
	.toBuffer();

await mkdir('static', { recursive: true });
await sharp({ create: { width: W, height: H, channels: 3, background: '#1d2740' } })
	.composite([
		...tiles,
		{ input: seal, left: Math.round((W - sealSize) / 2), top: Math.round((H - sealSize) / 2) }
	])
	.png({ compressionLevel: 9 })
	.toFile('static/og.png');

console.log('wrote static/og.png');
