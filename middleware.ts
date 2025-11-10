import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, parseSession } from "@/lib/auth/session";

const STATIC_PREFIXES = ["/_next", "/images", "/assets"];
const PUBLIC_FILES = new Set(["/favicon.ico", "/robots.txt", "/sitemap.xml"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isStatic = STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isPublicFile = PUBLIC_FILES.has(pathname);

  if (isStatic || isPublicFile) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  const session = parseSession(sessionCookie);
  const isAuthed = Boolean(session);

  const tempDebugHeaders = new Headers({
    "x-debug-path": pathname,
    "x-debug-authed": String(isAuthed)
  });

  if (!isAuthed && pathname !== "/login") {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    tempDebugHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  const response = NextResponse.next();
  tempDebugHeaders.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export const config = {
  matcher: ["/((?!_next|api/health|api/env-sanity|favicon\\.ico|images|assets).*)"]
};
