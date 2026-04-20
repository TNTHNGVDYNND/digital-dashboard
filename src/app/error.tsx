"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600 dark:bg-red-900/20">
          ⚠️
        </div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
          We apologize for the inconvenience. An unexpected error occurred while processing your request.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Reload Page
          </button>
          <button
            onClick={() => reset()}
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </main>
  );
}
