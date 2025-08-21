# Monitoring

This project uses [Sentry](https://sentry.io/) for error tracking.

## Environment Variables

- `SENTRY_DSN`: The DSN provided by Sentry. If this variable is set, the SDK
  will be initialized both on the server and within the Next.js app layout.

## Usage

The Sentry client is configured in `src/lib/sentry.ts` and loaded by
`src/app/layout.tsx` and `server.ts`. Set `SENTRY_DSN` in your environment to
enable error monitoring.
