import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import { User } from "./models/User";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/",
    error: "/login", // Redirect to login page on error
  },
  session: {
    strategy: "jwt",
  },
   providers: [
Credentials({
name: "Credentials",
credentials: {
email: { label: "Email", type: "text" },
password: { label: "Password", type: "password" },
},
authorize: async (credentials) => {
if (!credentials?.email || !credentials.password) {
return null;
}

        const { db } = await connectToDatabase();
        const usersCollection = db.collection<User>("users");

        const user = await usersCollection.findOne({ email: credentials.email as string });
            if (!user) {
return null; // User not found
}

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password!
        );

        if (!isValidPassword) {
          return null; // Invalid password
        }

        // Return user object including id, email, role, and isDefaultAdmin
        return {
          id: user._id!.toHexString(), // Convert ObjectId to string
          email: user.email,
          role: user.role,
          isDefaultAdmin: user.isDefaultAdmin || false,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isDefaultAdmin = user.isDefaultAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "cashier";
        session.user.isDefaultAdmin = token.isDefaultAdmin as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows redirecting to a different base URL than the default
      // For initial admin login, redirect to change-password
      // For other admin logins, redirect to dashboard
      const { db } = await connectToDatabase();
      const usersCollection = db.collection<User>("users");
      const user = await usersCollection.findOne({ email: url.includes('/admin/change-password') ? "sam968766@gmail.com" : "" }); // A bit hacky, but checks for default admin

      if (user && user.isDefaultAdmin) {
        return `${baseUrl}/admin/change-password`;
      } else if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith("/")) {
        return new URL(url, baseUrl).toString();
      }
      return baseUrl;
    },
  },
});
