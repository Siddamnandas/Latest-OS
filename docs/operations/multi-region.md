# Multi-region Operations

This application is deployed in two AWS regions. A primary stack runs in the main region with a secondary stack in another region for disaster recovery.

## Failover procedure

1. **Detect outage.** Confirm the primary region is unavailable by checking monitoring dashboards and health checks.
2. **Promote the database replica.** In the secondary region promote the RDS read replica to master from the AWS console or with `aws rds promote-read-replica`.
3. **Update DNS if needed.** CloudFront automatically fails over to the secondary S3 origin. If application endpoints require DNS changes, update Route53 records to point to resources in the secondary region.
4. **Validate service.** Confirm the application is serving traffic from the secondary region and database writes succeed.

## Returning to primary

1. Restore the primary database from the promoted replica snapshot.
2. Re-enable replication and point DNS records back to the primary CloudFront origin.
3. Run `terraform apply` with the appropriate `tfvars` file to ensure infrastructure is back in sync.

Regularly test this process to ensure multi-region failover works as expected.
