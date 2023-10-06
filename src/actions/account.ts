'use server';

import { revalidatePath } from 'next/cache';

import { authOptions } from '@/app/api/auth/options';

export async function unlinkAccount(provider: string, providerAccountId: string) {
  authOptions.adapter?.unlinkAccount?.({
    provider,
    providerAccountId,
  });

  revalidatePath('/link-accounts');
}
