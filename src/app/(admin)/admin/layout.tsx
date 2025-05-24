// src/app/admin/layout.tsx
import { ThemeProvider } from "next-themes";
import { AdminSidebar } from './_components/AdminSidebar';
import  AuthProvider  from '@/app/(auth)/AuthProvider'; // Assuming you have this

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider> {/* Ensure AuthProvider wraps content if session is needed */}
    <ThemeProvider>
      <div className="flex min-h-screen"> {/* Use min-h-screen for full height */}
        <AdminSidebar />
        <main className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
          {children}
        </main>
      </div>
      </ThemeProvider>
    </AuthProvider>
  );
}