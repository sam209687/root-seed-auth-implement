// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "cashier";
      isDefaultAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: "admin" | "cashier";
    isDefaultAdmin: boolean;
  }
}