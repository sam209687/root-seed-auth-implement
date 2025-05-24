import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme/theme-provider"; // Create this
import { SessionProvider } from "next-auth/react"; // Wrap application with SessionProvider
import { Toaster } from "@/components/ui/sonner";
// import { ThemeToggle } from "../components/theme/ThemeToggle"; // Create this component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POS System",
  description: "Cross-Platform Point of Sale System",
};

   export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="en" suppressHydrationWarning>
<body className={inter.className}>
<SessionProvider> {/* Wrap your entire app with SessionProvider */}
<ThemeProvider
attribute="class"
defaultTheme="system"
enableSystem
disableTransitionOnChange
>
<div className="min-h-screen flex flex-col">

<main className="flex-grow">
{children}
<Toaster />
</main>
</div>
</ThemeProvider>
</SessionProvider>
</body>
</html>
);
}