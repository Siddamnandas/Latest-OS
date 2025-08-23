import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { db } from './db';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        totp: { label: 'Auth code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          include: { couple: true },
        });
        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) {
          return null;
        }

        // Check TOTP if enabled
        if (user.totp_enabled) {
          if (!credentials.totp || !user.totp_secret) {
            return null;
          }
          const verified = authenticator.verify({ token: credentials.totp, secret: user.totp_secret });
          if (!verified) {
            return null;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          coupleId: user.couple_id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.coupleId = user.coupleId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.coupleId = token.coupleId;
      }
      return session;
    },
  },
};