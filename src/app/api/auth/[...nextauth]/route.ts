// import prisma from "@/lib/prisma";
// import * as bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import jwt from "jsonwebtoken";
import axios from "axios";
import ENV from "@/utils/ENV";

async function refreshAccessToken(token: any) {
  try {
    const apiUrl = `${ENV.API_URL}auth/refreshToken`;
    const requestData = {
      refresh_token: token.user.accessToken,
    };
    // console.log(requestData)
    const req = await axios.post(apiUrl, requestData);

    // const refreshedTokens = await response.json()

    if (req.data.statusCode !== "V:0001") {
      throw req.data.statusCode;
    }

    return {
      ...token,
        user: {
          accessToken: req.data.data.access_token,
        },
        exp: Math.floor(Date.now() / 1000) + 360
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
    // signOut: "/",
    // error: "/",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // console.log("account",user)
        token.user = user;
      }
      if (token.exp - 120 > token.exp) {
        // console.log("account2222", token);
        const re = await refreshAccessToken(token);
        // console.log("account2", ss);

        return re;
      }
      // console.log("account", token.exp);
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        // Your custom authentication logic here
        // const user = await verifyPassword(credentials.username, credentials.password);
        // const user = credentials.accessToken;
        const user = {
          accessToken: credentials.accessToken,
          address: credentials.address,
          balance: credentials.balance,
        };
        // const user = credentials.accessToken

        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
    // Add other authentication providers if needed
  ],
  session: {
    strategy: "jwt",
    maxAge: 1800000
  },
  secret: process.env.NEXTAUTH_SECRET, // store this in a .env file
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };