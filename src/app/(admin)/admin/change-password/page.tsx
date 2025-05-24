// src/app/(admin)/admin/change-password/page.tsx
import { ChangePasswordForm } from "../_components/ChangePasswordForm"; // Correct path to component
import { Toaster } from "../../../../components/ui/sonner";
import { auth } from "../../../../lib/auth"; // Correctly import 'auth' from your lib
import { redirect } from "next/navigation";

export default async function ChangePasswordPage() {
  const session = await auth(); // Use the 'auth' function from your lib

  // If not authenticated or not the default admin, redirect
  if (!session || !session.user || session.user.role !== "admin" || !session.user.isDefaultAdmin) {
    redirect("/"); // 'redirect' from 'next/navigation' is automatically imported
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <ChangePasswordForm />
      <Toaster richColors position="bottom-right" />
    </main>
  );
}