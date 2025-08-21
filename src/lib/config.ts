import envsafe, { str, url } from 'envsafe';
import { z } from 'zod';

// Validate and parse environment variables
const rawEnv = envsafe({
  DATABASE_URL: url({
    desc: 'Database connection string',
  }),
  NEXTAUTH_SECRET: str({
    desc: 'Secret used by NextAuth',
  }),
  SENTRY_DSN: str({
    desc: 'Sentry DSN for error tracking',
    allowEmpty: true,
    default: '',
  }),
});

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),
});

export const env = envSchema.parse(rawEnv);
