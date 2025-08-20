import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token");

  const publicPaths = ["/sign-in", "/sign-up", "/api/auth"];

  const isPublicRoute = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isPublicRoute && !token) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Match all routes except static files
  ],
};
