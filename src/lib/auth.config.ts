import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe auth config — NO Node.js imports allowed here.
 * This file is used by proxy.ts (Edge Runtime).
 * Providers that need Node.js (bcrypt, mongoose) live in auth.ts only.
 */
export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth }) {
      // Called by the proxy to decide whether to let the request through.
      // Returns true → allow, false → redirect to signIn page.
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // No providers here — CredentialsProvider (bcrypt + mongoose) is added in auth.ts
  providers: [],
};
