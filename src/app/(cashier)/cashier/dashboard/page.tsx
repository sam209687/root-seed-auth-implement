// src/app/(cashier)/cashier/dashboard/page.tsx

import { auth } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "../../../../components/ui/sonner";
import { Sidebar, cashierNavItems } from '../../../../components/re-useable-componants/Sidebar';
import { UserRole, User } from '../../../../lib/models/User'; // Ensure User is imported
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { ShoppingCart } from "lucide-react";

export default async function CashierDashboardPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== UserRole.Cashier) {
    redirect("/login");
  }

  // Use a type assertion for session.user if isDefaultCashier is not automatically inferred
  const currentUser = session.user as User;

  if (currentUser.isDefaultCashier) {
    redirect("/cashier/change-password");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        header="Cashier POS"
        navItems={cashierNavItems}
        currentUserEmail={currentUser.email || "Cashier"}
        // Change currentUserRole to use the enum member
        currentUserRole={UserRole.Cashier} // <-- FIX THIS LINE
      />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto lg:ml-64">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Cashier Dashboard</h1>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>POS System</CardTitle>
                <CardDescription>Start processing transactions here.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Future POS features will be implemented here.
                </p>
                <div className="mt-4 p-4 border rounded-md border-dashed text-center text-muted-foreground">
                    <ShoppingCart className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-600 mb-2" />
                    <p>Your Point-of-Sale interface will appear here.</p>
                    <p className="text-sm">Ready for Phase 3!</p>
                </div>
            </CardContent>
        </Card>

      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}