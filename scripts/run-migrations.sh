#!/usr/bin/env bash
set -euo pipefail

# Run database migrations in production
npx prisma migrate deploy
