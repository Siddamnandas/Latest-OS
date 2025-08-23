# Operations Guide

## Nightly Database Backups

Use `scripts/backup-db.sh` to create a nightly dump of the production database and store it in object storage.

1. Ensure `pg_dump` and the AWS CLI are installed.
2. Set the following environment variables:
   - `DATABASE_URL` – connection string for the database.
   - `S3_BUCKET` – destination bucket for backups.
3. Schedule the script via cron:
   ```cron
   0 2 * * * /path/to/repo/scripts/backup-db.sh
   ```
   This example runs the backup at 02:00 every day.

Backups are stored in `s3://$S3_BUCKET/db-backups/` with a timestamped filename.

## Restoring from Backup

`scripts/restore-db.sh` retrieves a dump from S3 and pipes it into the database.

```bash
scripts/restore-db.sh                     # restore the latest backup
scripts/restore-db.sh 20240101120000.sql.gz  # restore a specific backup
```

## Media Upload Versioning

Media uploads should be stored in an object storage bucket with versioning enabled.

1. Create a bucket for media uploads and enable versioning:
   ```bash
   aws s3api put-bucket-versioning --bucket "$MEDIA_BUCKET" --versioning-configuration Status=Enabled
   ```
2. Configure the application to upload media to `s3://$MEDIA_BUCKET/`.
3. Keeping versioning enabled protects against accidental deletions or overwrites.

## Recovery Tests

On the first business day of each month:

1. Download the most recent backup using `scripts/restore-db.sh` into a staging environment.
2. Verify the application runs correctly against the restored data.
3. Document the test results for audit purposes.

Regular recovery tests ensure backups are valid and the restore process is reliable.

## Additional Resources

- [Outage Runbook](./outage-runbook.md)
- [On-call & Incident Response](./on-call.md)
