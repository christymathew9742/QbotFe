import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";

const PUBLIC_ROUTES = ["/signin", "/signup"];

// Middleware to protect routes
// This middleware checks if the user is authenticated by checking for an access token in cookies.
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookies = request.headers.get("cookie") || "";
    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.accessToken;
    
    if (!accessToken && !PUBLIC_ROUTES.includes(pathname)) {
        console.log("Redirecting to signin as user is not authenticated");
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (accessToken && PUBLIC_ROUTES.includes(pathname)) {
        console.log("Redirecting to homepage as user is authenticated");
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next(); // Allow request
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};



