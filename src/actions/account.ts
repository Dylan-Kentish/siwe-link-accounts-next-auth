'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/server/db';

export async function unlinkAccount(provider: string, providerAccountId: string) {
  await prisma.account.delete({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
  });

  revalidatePath('/link-accounts');
}
