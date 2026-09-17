# Archive Media Manifest Schema

Status: **draft proposal**. This schema describes a file that lives in the
`hitotoki-collective/archive` repository, which this repository consumes read-only.
It must be agreed and merged upstream before the website can depend on it.

## Why a separate file

`MANIFEST.md` is hand-written editorial prose — provenance narrative, shot lists,
subtitle caveats. Media identifiers are the opposite: machine-generated on upload,
rewritten whenever an asset is re-ingested, and needing strict validation.

Putting identifiers in `MANIFEST.md` means upload tooling rewrites a prose document
it cannot safely parse. So media identifiers go in a sibling file:

```
performances/PERF-01-JP-KYO/
  MANIFEST.md      # prose, human-authored, unchanged
  media.yaml       # identifiers, tool-maintained, schema-validated
```

`MANIFEST.md` gains one line under `## Links` pointing at `media.yaml`. Nothing else
in it changes.

## Storage placement

Per the decision to use Cloudflare Stream for the larger videos and R2 for the others:

| Asset class | Size range | Stream | R2 |
| --- | --- | --- | --- |
| Masters (`VID-00.mp4`) | 950 MB – 2.8 GB | delivery | preservation |
| Segments (`*-SEG-*`) | 24 – 36 MB | — | delivery |
| Montages (`*-MON-*`) | 7.7 – 59 MB | — | delivery |

Note the masters appear in **both** columns. Cloudflare Stream re-encodes on ingest and
will not return the original file, so Stream alone is a delivery copy, not an archival
one. `storage` is therefore a map, not a single value: an asset may legitimately exist
in several places at once, and the preservation copy is tracked separately from
whatever the player hits.

Short cuts are served as plain MP4 from R2 — they are small, already encoded for
delivery, and do not need adaptive bitrate.

## Schema

```yaml
schemaVersion: 1          # integer; bump on breaking change
performance: PERF-01-JP-KYO   # must equal the containing directory name

assets:
  - id: VID-00                      # stable; the filename stem, no extension
    kind: source                    # source | segment | montage
    aspect: 16x9                    # 16x9 | 9x16
    derivedFrom: null               # asset id, or null for source material
    regenerable: false              # true if reproducible from derivedFrom + timecode

    # Intrinsic properties. Recorded once, never changed by re-upload.
    bytes: 996147200
    sha256: "<64 hex chars>"        # of the ORIGINAL file, pre-transcode
    durationSeconds: 548.0
    width: 3840
    height: 2160

    # Where copies live. At least one entry required.
    storage:
      r2:
        bucket: hitotoki-archive
        key: PERF-01-JP-KYO/video/VID-00.mp4
        class: preservation         # preservation | delivery
        public: false
      stream:
        uid: "<32 hex chars>"       # Cloudflare Stream video UID
        playback: signed            # public | signed
        class: delivery
        readyToStream: true
      lfs:
        path: video/VID-00.mp4      # present only until the LFS export runs
        class: preservation

    # Optional presentation metadata.
    poster: images/IMG-00.jpeg      # repo-relative, or null
    subtitles:
      - lang: en
        path: subtitles/VID-00-SUB-en.vtt
        kind: ocr                   # ocr | translated | combined | authored
        proofed: false

    # Carried from the MANIFEST provenance table. Required — the archive is
    # CC BY-NC-SA 4.0 and every served asset must be attributable.
    authoredBy: "Sam King (director, DP, editor); performances by the Artists"
    supplied: false                 # true when the archive did not produce it
                                    # and cannot reproduce it

  - id: VID-00-SEG-01-16x9
    kind: segment
    aspect: 16x9
    derivedFrom: VID-00
    regenerable: true
    startSeconds: 5.8               # required when regenerable
    durationSeconds: 30.0
    bytes: 30408704
    sha256: "<64 hex chars>"
    width: 3840
    height: 2160
    storage:
      r2:
        bucket: hitotoki-archive
        key: PERF-01-JP-KYO/video/VID-00-SEG-01-16x9.mp4
        class: delivery
        public: true
    poster: null
    subtitles: []
    authoredBy: "archive; a verbatim slice, no editorial change"
    supplied: false
```

### The supplied-asset case

`PERF-02`'s `MON-01` came from a subtitle-free source the archive did not produce and
cannot regenerate. It is the reason `supplied` and `regenerable` are separate fields —
it is a montage, it is not a slice of the master, and losing it means losing it:

```yaml
  - id: VID-00-MON-01-16x9
    kind: montage
    aspect: 16x9
    derivedFrom: null               # NOT from VID-00
    regenerable: false
    supplied: true
    authoredBy: "not produced by the archive; source unrecorded"
```

An asset with `supplied: true` MUST have an R2 entry with `class: preservation`. There
is no master to fall back on.

### Unstored excerpts

The manifests list reviewed-but-unkept excerpts by timecode. Those have no file and no
identifier, so they do not appear in `media.yaml`. They stay in `MANIFEST.md` prose. An
entry in `media.yaml` means a file exists somewhere.

## Validation

```typescript
import { z } from 'zod';

const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const streamUid = z.string().regex(/^[a-f0-9]{32}$/);
const storageClass = z.enum(['preservation', 'delivery']);

const r2Location = z.object({
  bucket: z.string().min(1),
  key: z.string().min(1),
  class: storageClass,
  public: z.boolean(),
});

const streamLocation = z.object({
  uid: streamUid,
  playback: z.enum(['public', 'signed']),
  class: storageClass,
  readyToStream: z.boolean(),
});

const lfsLocation = z.object({
  path: z.string().min(1),
  class: storageClass,
});

const subtitle = z.object({
  lang: z.string().min(2),
  path: z.string().min(1),
  kind: z.enum(['ocr', 'translated', 'combined', 'authored']),
  proofed: z.boolean(),
});

const asset = z
  .object({
    id: z.string().regex(/^VID-\d{2}(-(SEG|MON)-\d{2}-(16x9|9x16))?$/),
    kind: z.enum(['source', 'segment', 'montage']),
    aspect: z.enum(['16x9', '9x16']),
    derivedFrom: z.string().nullable(),
    regenerable: z.boolean(),
    startSeconds: z.number().nonnegative().optional(),
    durationSeconds: z.number().positive(),
    bytes: z.number().int().positive(),
    sha256,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    storage: z
      .object({
        r2: r2Location.optional(),
        stream: streamLocation.optional(),
        lfs: lfsLocation.optional(),
      })
      .refine((s) => s.r2 || s.stream || s.lfs, {
        message: 'asset must exist in at least one storage location',
      }),
    poster: z.string().nullable(),
    subtitles: z.array(subtitle),
    authoredBy: z.string().min(1),
    supplied: z.boolean(),
  })
  .refine((a) => !a.regenerable || a.startSeconds !== undefined, {
    message: 'regenerable assets must record startSeconds',
  })
  .refine((a) => !a.supplied || a.storage.r2?.class === 'preservation', {
    message: 'supplied assets need an R2 preservation copy; there is no master',
  })
  .refine((a) => a.kind !== 'source' || a.storage.r2?.class === 'preservation', {
    message: 'masters need an R2 preservation copy; Stream re-encodes on ingest',
  });

export const mediaManifest = z
  .object({
    schemaVersion: z.literal(1),
    performance: z.string().regex(/^PERF-\d{2}-[A-Z]{2}-[A-Z]{3}$/),
    assets: z.array(asset).min(1),
  })
  .superRefine((m, ctx) => {
    const ids = new Set(m.assets.map((a) => a.id));
    for (const a of m.assets) {
      if (a.derivedFrom && !ids.has(a.derivedFrom)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${a.id}: derivedFrom '${a.derivedFrom}' is not an asset in this manifest`,
        });
      }
    }
  });
```

## Build integration

- The site build MUST fail on an invalid `media.yaml`, per the front-matter rule in
  [requirements](./requirements.md).
- The build MUST NOT read `.mp4` files from the submodule. Video paths resolve through
  `media.yaml` to Stream or R2 URLs. This is what keeps the sparse-checkout honest — if
  a build ever needs a real video file, the checkout policy has been broken.
- `sha256` and `bytes` are recorded before upload and are what makes the LFS export in
  step 5 of the migration safe to perform: they are the evidence that the R2 copy
  matches what LFS held.

## Open questions

- Signed vs public playback for the masters. `playback: signed` is modelled but the
  access policy is not decided.
- Whether `media.yaml` is generated by an upload script or hand-maintained and
  verified by CI. Generated is better, but the archive repo has no tooling yet.
- Per-locale poster images are not modelled. The requirements call for per-locale OG
  images; this schema has a single `poster` per asset.
