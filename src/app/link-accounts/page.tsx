import { NextPage } from 'next';

import { LinkAccount } from '@/components/accounts/link-account';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Page: NextPage = async () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Accounts</CardTitle>
        <CardDescription>
          Linking external accounts extends the functionality of your account, allowing us to
          provide you with a more personalized experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 py-4">
          <LinkAccount provider="twitter" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
