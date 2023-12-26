import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { reToken } from "@/service/reToken";

// import type { NextRequest } from 'next/server'
export default withAuth(function middleware(request: NextRequestWithAuth) {
  // const user: any = request.nextauth.token?.user;
  const user: any = request.nextauth.token;
  if (user) {
    // const exp = user.exp - 120;
    // const time = Date.now()/1000;
    // const token = await reToken(user.user)
    // const expirationTimestamp = user.exp // Convert to milliseconds
    // // console.log(expirationTimestamp)
    // return NextResponse.redirect(new URL("/home", request.url));
  } else {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // return NextResponse.next();
});
export const config = { matcher: ["/home", "/newdaft/:path*"] };
