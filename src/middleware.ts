import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = new Set(["/signin", "/signup", "/reset-password"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const theme = request.cookies.get("theme")?.value || "light";

  if (!accessToken && !PUBLIC_ROUTES.has(pathname)) {
    const redirectUrl = new URL("/signin", request.url);
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set("x-theme", theme);
    return response;
  }

  if (accessToken && PUBLIC_ROUTES.has(pathname)) {
    const redirectUrl = new URL("/", request.url);
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set("x-theme", theme);
    return response;
  }

  if (accessToken && !PUBLIC_ROUTES.has(pathname)) {
    const response = NextResponse.next();
    response.headers.set("x-theme", theme);
    return response;
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};



