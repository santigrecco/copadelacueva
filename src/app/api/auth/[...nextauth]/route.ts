import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ALLOWED_EMAILS } from "@/types/auth";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          redirect_uri: process.env.NODE_ENV === "production" 
            ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
            : "http://localhost:4000/api/auth/callback/google",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      return ALLOWED_EMAILS.includes(user.email as any);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = "admin"; // All allowed users are admins
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to home page after sign in
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

export { handler as GET, handler as POST }; 