import { envsafe, str, url } from 'envsafe';
import { z } from 'zod';
import { UnleashClient } from 'unleash-proxy-client';

// Validate and parse environment variables
const rawEnv = envsafe({
  DATABASE_URL: url({
    desc: 'Database connection string',
    default: 'postgresql://postgres:postgres@localhost:5432/latest_os?schema=public',
    allowEmpty: false,
  }),
  NEXTAUTH_SECRET: str({
    desc: 'Secret used by NextAuth',
    default: 'development-secret-key-not-for-production',
    allowEmpty: false,
  }),
  UNLEASH_URL: str({
    desc: 'URL of the Unleash proxy',
    default: '',
    allowEmpty: true,
  }),
  UNLEASH_CLIENT_KEY: str({
    desc: 'Client key for the Unleash proxy',
    default: '',
    allowEmpty: true,
  }),
  SENTRY_DSN: str({
    desc: 'Sentry DSN for error tracking',
    allowEmpty: true,
    default: '',
  }),
});

const envSchema = z.object({
  DATABASE_URL: z.string().min(1), // Allow any non-empty string for development
  NEXTAUTH_SECRET: z.string().min(1),
  UNLEASH_URL: z.string().optional(),
  UNLEASH_CLIENT_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional().or(z.literal('')),
});

export const env = envSchema.parse(rawEnv);

export const featureClient =
  env.UNLEASH_URL && env.UNLEASH_CLIENT_KEY
    ? new UnleashClient({
        url: env.UNLEASH_URL,
        clientKey: env.UNLEASH_CLIENT_KEY,
        appName: 'latest-os',
      })
    : undefined;

featureClient?.start();