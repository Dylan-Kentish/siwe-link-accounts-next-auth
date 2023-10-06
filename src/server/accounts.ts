import 'server-only';
import { prisma } from './db';

export async function getAccount(userId: string, provider: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider,
    },
  });
  return account;
}
