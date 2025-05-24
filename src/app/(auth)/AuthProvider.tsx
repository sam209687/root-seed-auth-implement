// src/app/_components/AuthProvider.tsx
'use client'; // This must be a client component as it uses NextAuth's SessionProvider

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}