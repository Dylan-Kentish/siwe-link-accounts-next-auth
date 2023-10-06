// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

type Role = 'ADMIN' | 'USER';

declare module 'next-auth/adapters' {
  interface AdapterUser {
    id: string;
    address: string;
  }
}

declare module 'next-auth' {
  interface User {
    id: string;
    address: string;
    role: Role;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    address: string;
    role: Role;
    iat: number;
    exp: number;
  }
}
