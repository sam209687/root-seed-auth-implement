// src/app/dashboard/page.tsx
import { auth, signOut } from '@/lib/auth'; // Import auth and signOut helpers
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  // If no session, redirect to login (homepage)
  if (!session) {
    redirect('/');
  }

  // Display user information from the session
  const userEmail = session.user?.email || 'Guest';
  const userRole = session.user?.role || 'Unknown Role';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
        <p className="text-lg mb-2">You are logged in as: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{userEmail}</span></p>
        <p className="text-md mb-6">Your role: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{userRole.toUpperCase()}</span></p>

        {/* Example: Basic navigation based on role */}
        {userRole === 'admin' && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            You have admin privileges. Access <a href="/admin/dashboard" className="text-blue-600 hover:underline dark:text-blue-400">Admin Dashboard</a>.
          </p>
        )}
        {userRole === 'cashier' && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            You have cashier privileges. Access <a href="/cashier/dashboard" className="text-blue-600 hover:underline dark:text-blue-400">Cashier Dashboard</a>.
          </p>
        )}

        {/* Logout Form */}
        <form
          action={async () => {
            'use server'; // This makes the signOut call execute on the server
            await signOut({ redirectTo: '/' }); // Redirect to homepage after logout
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}