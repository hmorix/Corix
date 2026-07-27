#!/bin/bash
set -e
node ./node_modules/vite/bin/vite.js build
node ./node_modules/esbuild/bin/esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
node ./node_modules/esbuild/bin/esbuild api/index.ts --platform=node --packages=external --bundle --format=esm --outfile=api/index.js
