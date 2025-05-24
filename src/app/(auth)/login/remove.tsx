// src/app/login/page.tsx
import { Toaster } from "../../../components/ui/sonner"; // For toasts
import { LoginClientForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <LoginClientForm />
      <Toaster richColors position="bottom-right" />
    </main>
  );
}