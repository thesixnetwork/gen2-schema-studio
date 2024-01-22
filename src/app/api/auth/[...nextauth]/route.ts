// import prisma from "@/lib/prisma";
// import * as bcrypt from "bcryptjs";
import { NextApiHandler } from 'next';
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { authOptions } from './options';
// import jwt from "jsonwebtoken";
// import axios from "axios";
// import ENV from "@/utils/ENV";

// async function refreshAccessToken(token: any) {
//   try {
//     const apiUrl = `${ENV.API_URL}auth/refreshToken`;
//     const requestData = {
//       refresh_token: token.user.accessToken,
//     };
//     // console.log(requestData)
//     const req = await axios.post(apiUrl, requestData);
//     // console.log(req.data)
//     // const refreshedTokens = await response.json()

//     if (req.data.statusCode !== "V:0001") {
//       throw req.data.statusCode;
//     }

//     return {
//       ...token,
//         user: {
//           accessToken: req.data.data.access_token,
//         },
//         exp: Math.floor(Date.now() / 1000) + 360
//     };
//   } catch (error) {
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

// interface MyToken {
//   user?: {
//     name?: string | null | undefined;
//     email?: string | null | undefined;
//     image?: string | null | undefined;
//   } | null | undefined;
//   // Add any other properties if needed
// }

// interface MyCredentials {
//   accessToken?: string;
//   address?: string;
//   balance?: number;
//   // Add any other properties if needed
// }

// const authOptions: NextAuthOptions = {
//   pages: {
//     signIn: "/",
//     signOut: "/",
//   },
//   callbacks: {
//     async session({ session, token }) {
//       session.user = token.user!;
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         // console.log("account",user)
//         token.user = user;
//       }
//       return token;
//     },
//   },
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {},
//       authorize: async (credentials: MyCredentials | undefined) => {
//         const user = {
//           id: "Client",
//           accessToken:credentials?.accessToken,
//           address: credentials?.address,
//           balance: credentials?.balance,
//         };
//         // const user = credentials.accessToken

//         if (user) {
//           return Promise.resolve(user);
//         } else {
//           return Promise.resolve(null);
//         }
//       },
//     }),
//     // Add other authentication providers if needed
//   ],
//   session: {
//     strategy: "jwt",
//     // maxAge: 1800000
//     maxAge: 1400
//   },
//   jwt:{
//     maxAge: 1400
//   },
//   secret: process.env.NEXTAUTH_SECRET, // store this in a .env file
// };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

