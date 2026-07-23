import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { Role } from "@/lib/types";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Coolify sits behind Traefik (a reverse proxy) — without this, Auth.js
  // rejects every request with "UntrustedHost" because the Host header it
  // sees doesn't match what it infers from NEXTAUTH_URL. Safe to trust here
  // since Traefik is the only thing routing traffic to this container.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.active) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          branchId: user.branch_id,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as any).role as Role;
        token.branchId = (user as any).branchId as string | null;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role as Role;
        (session.user as any).branchId = token.branchId as string | null;
      }
      return session;
    },
  },
});
