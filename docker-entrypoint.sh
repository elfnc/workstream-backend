#!/bin/sh
set -e

echo "Running database migrations..."
bun run db:push

echo "Starting backend..."
exec bun run src/server.ts
