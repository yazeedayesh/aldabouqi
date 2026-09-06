import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Vercel Preview URLs change on every deploy, and `next start` locally has
  // no fixed host either — Auth.js's default host-trust check rejects both,
  // throwing UntrustedHost on every login attempt (found while QA-testing
  // login locally via `next start`, 2026-09-06). Safe here since this is a
  // single-tenant admin login, not a multi-tenant host-routing scenario.
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials?.username;
        const password = credentials?.password;
        if (typeof username !== "string" || typeof password !== "string") {
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminUsername || !adminPasswordHash) return null;
        if (username !== adminUsername) return null;
        if (!verifyPassword(password, adminPasswordHash)) return null;

        return { id: "admin", name: username };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
});
