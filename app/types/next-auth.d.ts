// ruangriung/ruangriung-generator-app/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Perluas tipe Session standar NextAuth
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string; // Tambahkan properti id ke tipe user dalam sesi
      email?: string; // Pastikan properti email ada
    };
  }

  // Perluas tipe User standar NextAuth (jika Anda ingin menambahkan properti ke objek User yang dikembalikan provider)
  interface User extends DefaultUser {
    id?: string; // Tambahkan properti id ke tipe User
    email?: string; // Pastikan properti email ada
  }
}

// Perluas tipe JWT untuk menyertakan properti id dan email
declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // Tambahkan properti id ke tipe JWT
    email?: string; // Pastikan properti email ada
  }
}