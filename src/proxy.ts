import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;
  const isOnAdmin = pathname.startsWith("/admin");
  const isOnLogin = pathname === "/admin/login";

  if (isOnAdmin && !isLoggedIn && !isOnLogin) {
    const loginUrl = nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.host = req.headers.get("host") || loginUrl.host;
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isOnLogin) {
    const dashUrl = nextUrl.clone();
    dashUrl.pathname = "/admin/dashboard";
    dashUrl.host = req.headers.get("host") || dashUrl.host;
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
