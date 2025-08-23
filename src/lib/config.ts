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
  REDIS_URL: str({
    desc: 'Redis connection string',
    default: 'redis://localhost:6379',
    allowEmpty: true,
  }),
  STRIPE_SECRET_KEY: str({
    desc: 'Secret key for Stripe API',
    default: '',
    allowEmpty: true,
  }),
  STRIPE_WEBHOOK_SECRET: str({
    desc: 'Stripe webhook signing secret',
    default: '',
    allowEmpty: true,
  }),
  SENTRY_ORG: str({
    desc: 'Sentry organization slug for API access',
    default: '',
    allowEmpty: true,
  }),
  SENTRY_PROJECT: str({
    desc: 'Sentry project slug for API access',
    default: '',
    allowEmpty: true,
  }),
  SENTRY_AUTH_TOKEN: str({
    desc: 'Authentication token for Sentry API',
    default: '',
    allowEmpty: true,
  }),
});

const envSchema = z.object({
  DATABASE_URL: z.string().min(1), // Allow any non-empty string for development
  NEXTAUTH_SECRET: z.string().min(1),
  UNLEASH_URL: z.string().optional(),
  UNLEASH_CLIENT_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional().or(z.literal('')),
  REDIS_URL: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
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
