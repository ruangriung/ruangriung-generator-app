import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import type { NextAuthOptions } from 'next-auth';

// Definisikan tipe User dan Session yang sudah dimodifikasi
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      coins?: number; // Tambahkan koin ke sesi
    }
  }

  interface User {
    coins?: number; // Tambahkan koin ke model User
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Callback untuk menyertakan ID pengguna dan koin ke dalam JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.coins = user.coins;
      }
      return token;
    },
    // Callback untuk menyertakan ID pengguna dan koin ke dalam objek session client-side
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.coins = token.coins as number;
      }
      return session;
    },
  },
  // hapus konfigurasi cookie lama jika ada
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };