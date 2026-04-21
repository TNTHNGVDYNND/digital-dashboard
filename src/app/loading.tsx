export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-gray-800" />
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );
}
