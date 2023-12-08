// import prisma from "@/lib/prisma";
// import * as bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/home",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async session({ session, token}) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      authorize: async (credentials) => {
        // Your custom authentication logic here
        // const user = await verifyPassword(credentials.username, credentials.password);
        const user = credentials.accessToken;
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET, // store this in a .env file
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };