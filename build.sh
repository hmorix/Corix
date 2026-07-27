#!/bin/bash
set -e
./node_modules/.bin/vite build
./node_modules/.bin/esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
./node_modules/.bin/esbuild api/index.ts --platform=node --packages=external --bundle --format=esm --outfile=api/index.js
