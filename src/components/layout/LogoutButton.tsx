'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/', redirect: true })}
      className="rounded-full bg-red-600/10 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-600/20"
    >
      Sign Out
    </button>
  );
}
