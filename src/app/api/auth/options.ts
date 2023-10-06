import 'server-only';

import { type NextAuthOptions, getServerSession as getServerSessionInternal } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import TwitterProvider from 'next-auth/providers/twitter';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';

import { env } from '@/env.mjs';
import { prisma } from '@/server/db';

import { SIWEAdapter } from './adapter';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  adapter: SIWEAdapter(),
  providers: [
    CredentialsProvider({
      id: 'siwe',
      name: 'siwe',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'));

          const nonce = await getCsrfToken({ req: { headers: req.headers } });

          const result = await siwe.verify({
            signature: credentials?.signature || '',
            domain: env.VERIFIED_DOMAIN,
            nonce,
          });

          if (result.success) {
            const user = await prisma.user.upsert({
              where: {
                id: siwe.address,
              },
              update: {},
              create: {
                id: siwe.address,
              },
              select: {
                id: true,
                role: true,
              },
            });

            return user;
          } else {
            return null;
          }
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: '2.0',
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Persist the data to the token right after authentication
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.iat = token.iat;
      session.exp = token.exp;
      return session;
    },
  },
  events: {
    // after an account has been linked to a user
    // store the name and image from the provider
    linkAccount: async ({ account, profile }) => {
      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
        data: {
          name: profile.name,
          image: profile.image,
        },
      });
    },
  },
  pages: {
    signIn: '/siwe',
  },
};

export async function getServerSession() {
  const session = await getServerSessionInternal(authOptions);

  return session;
}
