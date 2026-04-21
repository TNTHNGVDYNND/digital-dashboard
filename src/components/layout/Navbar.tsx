import Link from 'next/link';
import { auth } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200/20 bg-white/10 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Digital Dashboard
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/campaigns"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Create Campaign
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400"
              >
                Dashboard
              </Link>
              <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                {session.user?.name || session.user?.email}
              </div>
              <LogoutButton />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
