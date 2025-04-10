import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAdmin = req.nextauth.token?.role === "admin";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/players") ||
      req.nextUrl.pathname.startsWith("/teams") ||
      req.nextUrl.pathname.startsWith("/matches") ||
      req.nextUrl.pathname.startsWith("/tournaments");

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/players/:path*",
    "/teams/:path*",
    "/matches/:path*",
    "/tournaments/:path*",
  ],
}; 