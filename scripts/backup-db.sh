#!/usr/bin/env bash
set -euo pipefail

# Dump the production database and upload to S3
# Requires: pg_dump, aws cli, DATABASE_URL, and S3_BUCKET env vars

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

if [[ -z "${S3_BUCKET:-}" ]]; then
  echo "S3_BUCKET is required" >&2
  exit 1
fi

timestamp=$(date +%Y%m%d%H%M%S)
backup_file="/tmp/db-$timestamp.sql.gz"

pg_dump "$DATABASE_URL" | gzip > "$backup_file"
aws s3 cp "$backup_file" "s3://$S3_BUCKET/db-backups/$timestamp.sql.gz"
rm "$backup_file"
