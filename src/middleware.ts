import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = new Set(["/signin", "/signup", "/reset-password"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken && !PUBLIC_ROUTES.has(pathname)) {
    const redirectUrl = new URL("/signin", request.url);
    const response = NextResponse.redirect(redirectUrl);
    return response;
  }

  if (accessToken && PUBLIC_ROUTES.has(pathname)) {
    const redirectUrl = new URL("/", request.url);
    const response = NextResponse.redirect(redirectUrl);
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};



