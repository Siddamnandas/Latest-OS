#!/usr/bin/env bash
set -euo pipefail

# Restore the production database from a backup stored in S3
# Usage: restore-db.sh [backup-file]
# If no file is provided, the most recent backup is restored.

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

if [[ -z "${S3_BUCKET:-}" ]]; then
  echo "S3_BUCKET is required" >&2
  exit 1
fi

key=${1:-latest}

tmpfile="/tmp/db-restore.sql.gz"

if [[ "$key" == "latest" ]]; then
  key=$(aws s3 ls "s3://$S3_BUCKET/db-backups/" | sort | tail -n 1 | awk '{print $4}')
fi

aws s3 cp "s3://$S3_BUCKET/db-backups/$key" "$tmpfile"
gunzip -c "$tmpfile" | psql "$DATABASE_URL"
rm "$tmpfile"
