// ruangriung/ruangriung-generator-app/lib/auth.ts
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
// Hapus import CredentialsProvider from "next-auth/providers/credentials";
// Hapus import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    // Hapus seluruh objek CredentialsProvider
    // CredentialsProvider({ ... })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/premium/login",
  },
  session: {
    strategy: "jwt", // Tetap gunakan JWT strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Ini akan aman setelah types/next-auth.d.ts dibuat ulang
        token.email = user.email; // Ini akan aman setelah types/next-auth.d.ts dibuat ulang
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) { // Tambahan pengecekan session.user
        session.user.id = token.id; // Ini akan aman setelah types/next-auth.d.ts dibuat ulang
        session.user.email = token.email; // Ini akan aman setelah types/next-auth.d.ts dibuat ulang
      }
      return session;
    }
  }
};