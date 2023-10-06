'use client';

import { signIn } from 'next-auth/react';

import { Button } from '../ui/button';

export const Login: React.FC<{ provider: string }> = ({ provider }) => {
  function handleLogin() {
    signIn(provider);
  }

  return (
    <Button onClick={handleLogin} variant="outline" size="lg">
      Link {provider}
    </Button>
  );
};
