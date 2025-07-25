// ruangriung/ruangriung-generator-app/app/premium/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Perbaikan: Impor authOptions dari file baru

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };