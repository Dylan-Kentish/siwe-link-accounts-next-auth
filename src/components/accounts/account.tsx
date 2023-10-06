'use client';

import { useTransition } from 'react';

import { type Account as dbAccount } from '@prisma/client';

import { unlinkAccount } from '@/actions/account';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const Account: React.FC<{ account: dbAccount }> = ({ account }) => {
  const [isPending, startTransition] = useTransition();

  function handleUnlink() {
    startTransition(() => unlinkAccount(account.provider, account.providerAccountId));
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 p-2" size="lg" disabled={isPending}>
          <Avatar className="aspect-square h-full w-auto">
            {account.image && <AvatarImage src={account.image} alt={account.name ?? ''} />}
            <AvatarFallback>{account.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{account.name}</span>
          <span className="text-muted-foreground">({account.provider})</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently unlink your {account.provider}{' '}
            account from your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnlink}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
