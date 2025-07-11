import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // <-- PERUBAHAN DI SINI

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };