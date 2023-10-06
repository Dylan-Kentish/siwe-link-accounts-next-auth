import { getServerSession } from '@/app/api/auth/options';
import { getAccount } from '@/server/accounts';

import { Account } from './account';
import { Login } from './login';

export const LinkAccount: React.FC<{ provider: string }> = async ({ provider }) => {
  const session = await getServerSession();
  const account = await getAccount(session!.user.id, provider);

  if (account) {
    return <Account account={account} />;
  } else {
    return <Login provider={provider} />;
  }
};
