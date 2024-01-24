import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import ENV from "@/utils/ENV";

interface MyCredentials {
  accessToken?: string;
  address?: string;
  balance?: number;
  expToken?: number;
  // Add any other properties if needed
}

type ISODateString = string;
interface DefaultSession {
  user?: {
    name?: string | null;
    email?: string | null;
    accessToken?: string | null;
    image?: string | null;
  };
  expires: ISODateString;
}

interface User {
  user?: {
    name?: string | null;
    email?: string | null;
    accessToken?: string | null;
    address?: string | null;
    balance?: string | null;
    expToken?: number | null;
  };
}

interface IToken {
  sub?: string;
  user?: {
    id: string;
    accessToken: string;
    address: string;
    balance: string;
    expToken: string;
  };
  iat?: number;
  exp?: number;
  jti?: string;
}

interface ITokenUser {
  id: string;
  accessToken: string;
  address: string;
  balance: string;
  expToken: string;
}

async function refreshAccessToken(token: any) {
  try {
    const apiUrl = `${ENV.API_URL}auth/refreshToken`;
    const requestData = {
      refresh_token: token.user.accessToken,
    };
    // console.log(requestData)
    const req = await axios.post(apiUrl, requestData);
    // console.log(req.data)
    // const refreshedTokens = await response.json()

    if (req.data.statusCode !== "V:0001") {
      throw req.data.statusCode;
    }

    return {
      ...token,
        user: {
          accessToken: req.data.data.access_token,
          expToken: Math.floor(Date.now() / 1000) + 60 * 60 * 1 + 60 * 50
        },
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async session({ session, token }) {
      const defaultUser: User = {
        user: token.user!,
      };

      // session.user = token.user!;
      session.user = defaultUser.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // console.log("account",user)
        // console.log("token",token)
        // const defaultTokenUser: User = user
        token.user = user;
      }
      const istoken: IToken = token;
      if (Date.now()/1000 < Number(istoken?.user?.expToken!)) {
        // console.log("Number(istoken?.user?.expToken!)",Number(istoken?.user?.expToken!))
        return token;
      }
      return refreshAccessToken(token);
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
          expToken: credentials?.expToken,
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
