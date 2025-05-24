// src/app/(cashier)/cashier/change-password/page.tsx
import { CashierChangePasswordForm } from '../_components/CashierChangePasswordForm';
import { Toaster } from "../../../../components/ui/sonner";
import { auth } from "../../../../lib/auth";
import { redirect } from 'next/navigation';
import { UserRole, User } from '../../../../lib/models/User'; // Import User type

export default async function CashierChangePasswordPage() {
  const session = await auth();

  // Type assertion for session.user
  const currentUser = session?.user as User | undefined; // Add this line

  // Ensure user is authenticated, is a cashier, and is using default password
  // Use currentUser for type safety
  if (!currentUser || currentUser.role !== UserRole.Cashier || !currentUser.isDefaultCashier) {
    // If not authenticated as default cashier, redirect to login or cashier dashboard
    if (currentUser?.role === UserRole.Cashier && !currentUser.isDefaultCashier) {
         redirect("/cashier/dashboard");
    } else {
         redirect("/login");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <CashierChangePasswordForm />
      <Toaster richColors position="bottom-right" />
    </main>
  );
}