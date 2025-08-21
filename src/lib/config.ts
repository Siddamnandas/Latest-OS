1 import envsafe, { str, url } from 'envsafe';
2 import { z } from 'zod';
3 import { UnleashClient } from 'unleash-proxy-client';
4 ​
5 // Validate and parse environment variables
6 const rawEnv = envsafe({
7   DATABASE_URL: url({
8     desc: 'Database connection string',
9   }),
10   NEXTAUTH_SECRET: str({
11     desc: 'Secret used by NextAuth',
12   }),
13   UNLEASH_URL: str({
14     desc: 'URL of the Unleash proxy',
15     default: '',
16     allowEmpty: true,
17   }),
18   UNLEASH_CLIENT_KEY: str({
19     desc: 'Client key for the Unleash proxy',
20     default: '',
21     allowEmpty: true,
22   }),
23   SENTRY_DSN: str({
24     desc: 'Sentry DSN for error tracking',
25     allowEmpty: true,
26     default: '',
27   }),
28 });
29 ​
30 const envSchema = z.object({
31   DATABASE_URL: z.string().url(),
32   NEXTAUTH_SECRET: z.string().min(1),
33   UNLEASH_URL: z.string().optional(),
34   UNLEASH_CLIENT_KEY: z.string().optional(),
35   SENTRY_DSN: z.string().url().optional().or(z.literal('')),
36 });
37 ​
38 export const env = envSchema.parse(rawEnv);
39 ​
40 export const featureClient =
41   env.UNLEASH_URL && env.UNLEASH_CLIENT_KEY
42     ? new UnleashClient({
43         url: env.UNLEASH_URL,
44         clientKey: env.UNLEASH_CLIENT_KEY,
45         appName: 'latest-os',
46       })
47     : undefined;
48 ​
49 featureClient?.start();