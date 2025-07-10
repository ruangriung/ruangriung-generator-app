import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  // Tambahkan konfigurasi cookie ini untuk mengatasi error 'state mismatch'
  cookies: {
    state: {
      name: `__Secure-next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax", // 'lax' lebih fleksibel untuk development
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
})

export { handler as GET, handler as POST }