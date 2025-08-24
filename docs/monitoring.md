# Monitoring

This project uses [Sentry](https://sentry.io/) for error tracking.

## Environment Variables

- `SENTRY_DSN`: The DSN provided by Sentry. If this variable is set, the SDK
  will be initialized both on the server and within the Next.js app layout.

## Usage

The Sentry client is configured in `src/lib/sentry.ts` and loaded by
`src/app/layout.tsx` and `server.ts`. Set `SENTRY_DSN` in your environment to
enable error monitoring.

## Metrics & Dashboards

Operational metrics (request latency and error rate) are collected via
OpenTelemetry and exported to Datadog. Terraform configuration for monitors and
dashboards lives in `infra/datadog.tf`. Apply it with the `datadog_api_key` and
`datadog_app_key` variables to provision dashboards and alerting rules.
