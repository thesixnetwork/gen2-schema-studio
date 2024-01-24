"use server"
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { reToken } from "@/service/reToken";

// import type { NextRequest } from 'next/server'
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
export default withAuth(function middleware(request: NextRequestWithAuth) {
  // const user: any = request.nextauth.token?.user;
  // const user: IToken| null = request.nextauth.token;
  const user: IToken | null = request.nextauth.token;
  if (user) {
    // console.log(user.user?.accessToken)
    // const token = await reToken(user.user)
    // const expirationTimestamp = user.exp // Convert to milliseconds
    // // console.log(expirationTimestamp)
    // return NextResponse.redirect(new URL("/home", request.url));
  } else {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // return NextResponse.next();
});
export const config = { matcher: ["/home", "/newdraft/:path*"] };
