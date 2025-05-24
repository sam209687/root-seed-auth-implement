// src/app/cashier/layout.tsx
import { CashierSidebar } from './_components/CashierSidebar';
import  AuthProvider  from '@/app/(auth)/AuthProvider'; // Assuming you have this

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider> {/* Ensure AuthProvider wraps content if session is needed */}
      <div className="flex min-h-screen"> {/* Use min-h-screen for full height */}
        <CashierSidebar />
        <main className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}