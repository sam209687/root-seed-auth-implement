// src/app/admin/dashboard/page.tsx
import { auth } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "../../../../lib/auth"; // For logout button
import { CustomButton } from "../../../../components/re-useable-componants/CustomButton";

export default async function AdminDashboardPage() {
  const session = await auth();

  // Protect this route: only admin can access
  if (!session || !session.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome, Admin {session.user.email}!</h1>
      <p className="text-lg mb-8">This is your dashboard. More features coming soon!</p>

      <form action={async () => {
        "use server";
        await signOut();
      }}>
        <CustomButton type="submit">Sign Out</CustomButton>
      </form>
    </main>
  );
}