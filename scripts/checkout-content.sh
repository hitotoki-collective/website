#!/usr/bin/env bash
set -euo pipefail

# Check out the content archive submodule without its Git LFS video objects.
#
# The archive repository stores performance video in Git LFS. Those directories
# total roughly 4 GB (a single master file accounts for 2.8 GB of it), which is
# far more than a build needs and more than Cloudflare Pages will tolerate. This
# script checks out manifests, texts, quotes, subtitles and images, and leaves
# the video behind.
#
# Run from the repository root.

SUBMODULE_PATH="src/content/archive"

# Skip the LFS smudge filter so the initial checkout writes pointer files rather
# than downloading every media object referenced by the tree.
export GIT_LFS_SKIP_SMUDGE=1

git submodule update --init --depth 1 "$SUBMODULE_PATH"

# Non-cone mode: include everything, then subtract. Later patterns win.
git -C "$SUBMODULE_PATH" sparse-checkout set --no-cone \
  '/*' \
  '!/tmp/' \
  '!/performances/*/video/'

# Hydrate only the image objects. Everything else the build reads is plain text.
git -C "$SUBMODULE_PATH" lfs pull --include="performances/*/images/**"
