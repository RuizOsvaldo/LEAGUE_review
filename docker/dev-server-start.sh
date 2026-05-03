#!/bin/sh
set -e

echo "Running migrations..."
npx drizzle-kit migrate

echo "Starting dev server..."
exec npx ts-node-dev --respawn --transpile-only --poll src/index.ts
