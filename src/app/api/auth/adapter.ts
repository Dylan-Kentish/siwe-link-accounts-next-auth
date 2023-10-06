/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Adapter } from 'next-auth/adapters';

import { prisma } from '@/server/db';

export function SIWEAdapter(): Adapter {
  return {
    // @ts-ignore next-auth/adapters AdapterUser email, emailVerified
    createUser(user) {
      return prisma.user.create({
        data: user,
      });
    },
    // @ts-ignore next-auth/adapters AdapterUser email, emailVerified
    async getUser(userId) {
      const userData = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          address: true,
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
              address: true,
              role: true,
            },
          },
        },
      });

      if (!accountData) return null;

      return accountData.user;
    },
    // @ts-ignore next-auth/adapters AdapterUser email, emailVerified
    async updateUser({ id, ...data }) {
      const userData = await prisma.user.update({
        where: {
          id,
        },
        data,
        select: {
          id: true,
          address: true,
          role: true,
        },
      });

      return userData;
    },
    async deleteUser(userId) {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
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
    async unlinkAccount(provider_providerAccountId) {
      await prisma.account.delete({
        where: {
          provider_providerAccountId,
        },
      });
    },
    // @ts-expect-error
    createVerificationToken() {
      // Won't be called because we're not using email sign in
    },
    // @ts-expect-error
    useVerificationToken() {
      // Won't be called because we're not using email sign in
    },
    // @ts-expect-error
    async getUserByEmail() {
      // Won't be called because we're using JWT
    },
    // @ts-expect-error
    getSessionAndUser() {
      // Won't be called because we're using JWT
    },
    // @ts-expect-error
    createSession() {
      // Won't be called because we're using JWT
    },
    // @ts-expect-error
    updateSession() {
      // Won't be called because we're using JWT
    },
    // @ts-expect-error
    deleteSession() {
      // Won't be called because we're using JWT
    },
  };
}
