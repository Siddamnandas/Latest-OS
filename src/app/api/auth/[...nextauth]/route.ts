import { registry } from "@/lib/openapi";
registry.registerPath({ method: "get", path: "/api/auth/{nextauth}", responses: { 200: { description: "Success" } } });
registry.registerPath({ method: "post", path: "/api/auth/{nextauth}", responses: { 200: { description: "Success" } } });

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
