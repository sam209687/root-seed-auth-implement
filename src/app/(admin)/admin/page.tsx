// src/app/(admin)/admin/dashboard/page.tsx // Note: The comment says dashboard, but the error points to admin/page.tsx. Assuming this is the correct file for the error.
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "../../../components/ui/sonner";
import { AdminDashboardLayout } from './_components/AdminDashboardLayout'; // Import the new layout
import { Sidebar, adminNavItems } from '../../../components/re-useable-componants/Sidebar'; // Import Sidebar and nav items
import { UserRole } from '../../../lib/models/User'; // Import UserRole

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== UserRole.Admin) {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        header="Admin Panel"
        navItems={adminNavItems}
        currentUserEmail={session.user.email || "Admin"}
        // Change currentUserRole to use the enum member
        currentUserRole={UserRole.Admin} // <-- FIX THIS LINE
      />
      <main className="flex-1 overflow-y-auto lg:ml-64"> {/* Adjust margin for sidebar */}
        <AdminDashboardLayout />
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}