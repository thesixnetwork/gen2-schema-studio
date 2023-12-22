import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
// import type { NextRequest } from 'next/server'
export default withAuth(function middleware(request: NextRequestWithAuth) {
  console.log(11111)

  // if (request.nextUrl.pathname == "/") {
  //   console.log(11111)
  //   const user: any = request.nextauth.token?.user;
  //   if (user) {
  //     return NextResponse.redirect(new URL("/home", request.url));
  //   } else {
  //     return NextResponse.redirect(new URL("/home", request.url));
  //   }
  // } else {
  //   console.log(2222)

  //   const user: any = request.nextauth.token?.user;
  //   if (user) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   } else {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }
  // return NextResponse.next();
});
export const config = { matcher: ["/home", "/newdaft/:path*"] };
