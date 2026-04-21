import type { DefaultSession } from 'next-auth';

// Extend the built-in session type so session.user.id is available in TS
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
