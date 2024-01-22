import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface MyCredentials {
  accessToken?: string;
  address?: string;
  balance?: number;
  // Add any other properties if needed
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user!;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // console.log("account",user)
        token.user = user;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials: MyCredentials | undefined) => {
        const user = {
          id: "Client",
          accessToken: credentials?.accessToken,
          address: credentials?.address,
          balance: credentials?.balance,
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
    // maxAge: 1800000
    maxAge: 1400,
  },
  jwt: {
    maxAge: 1400,
  },
  secret: process.env.NEXTAUTH_SECRET, // store this in a .env file
};

// export authOptions;