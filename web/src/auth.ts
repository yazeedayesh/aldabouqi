import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminSessions, adminUsers } from "@/db/schema";
import { verifyPassword } from "@/lib/password";

/** Re-persisting lastSeenAt on literally every request is wasted writes for
 * a single-admin panel — only touch it once a minute per session. */
const LAST_SEEN_THROTTLE_MS = 60_000;

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
      // Admin credentials moved from ADMIN_USERNAME/ADMIN_PASSWORD_HASH env
      // vars to a real DB row (admin v2 brief, 2026-09-08) so "change
      // password" can verify + update it server-side without a redeploy.
      // Every successful login also opens a row in admin_sessions, which is
      // what makes "sign out of all devices" and the active-session count
      // in Settings real instead of decorative (see the jwt callback below).
      authorize: async (credentials, request) => {
        const username = credentials?.username;
        const password = credentials?.password;
        if (typeof username !== "string" || typeof password !== "string") {
          return null;
        }

        const db = getDb();
        const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
        if (!user) return null;
        if (!verifyPassword(password, user.passwordHash)) return null;

        const [session] = await db
          .insert(adminSessions)
          .values({ userId: user.id, userAgent: request.headers.get("user-agent") })
          .returning({ id: adminSessions.id });

        return { id: user.id, name: user.username, sessionId: session.id };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Fresh sign-in — `user` is only defined here, straight from authorize().
        token.sessionId = (user as { sessionId: string }).sessionId;
        return token;
      }

      if (typeof token.sessionId !== "string") return null;

      const db = getDb();
      const [session] = await db
        .select()
        .from(adminSessions)
        .where(and(eq(adminSessions.id, token.sessionId), eq(adminSessions.revoked, false)));

      // Session was revoked (or the row is gone) — "sign out of all
      // devices" in Settings deletes/revokes rows directly, and this is
      // where that takes effect: returning null here ends the session on
      // the very next request from this device.
      if (!session) return null;

      const isStale = Date.now() - new Date(session.lastSeenAt).getTime() > LAST_SEEN_THROTTLE_MS;
      if (isStale) {
        await db.update(adminSessions).set({ lastSeenAt: new Date() }).where(eq(adminSessions.id, session.id));
      }

      return token;
    },
    async session({ session, token }) {
      if (typeof token.sessionId === "string") {
        (session as typeof session & { sessionId: string }).sessionId = token.sessionId;
      }
      return session;
    },
  },
});
