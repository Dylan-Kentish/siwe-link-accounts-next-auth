/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Adapter } from 'next-auth/adapters';

import { prisma } from '@/server/db';

// Although the Adapter documentation says that all sign-in flows require almost
// all methods to be implemented, this is not true for the CredentialsProvider.
// The Adapter is not used for the CredentialsProvider, and therefore only used
// by oauth providers, when linking accounts.
export function SIWEAdapter(): Adapter {
  return {
    // @ts-ignore next-auth/adapters AdapterUser email, emailVerified
    async getUser(userId) {
      const userData = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (!userData) return null;

      return userData;
    },
    // @ts-ignore next-auth/adapters AdapterUser email, emailVerified
    async getUserByAccount(provider_providerAccountId) {
      const accountData = await prisma.account.findUnique({
        where: {
          provider_providerAccountId,
        },
        select: {
          user: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });

      if (!accountData) return null;

      return accountData.user;
    },
    async linkAccount({ userId, provider, providerAccountId }) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          accounts: {
            create: {
              provider,
              providerAccountId,
            },
          },
        },
      });
    },
  };
}
