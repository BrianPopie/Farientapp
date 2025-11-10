import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, parseSession } from "@/lib/auth/session";

const PUBLIC_PATHS = new Set(["/", "/login"]);
const SKIP_PREFIXES = ["/_next", "/assets", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

function shouldBypass(pathname: string) {
  if (pathname.startsWith("/api/")) return true;
  return SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  const session = parseSession(sessionCookie);
  const hasSession = Boolean(session);
  const isPublicPath = PUBLIC_PATHS.has(pathname);

  let redirectTarget: string | null = null;
  if (!hasSession && !isPublicPath) {
    redirectTarget = "/login";
  } else if (hasSession && isPublicPath) {
    redirectTarget = "/dashboard";
  }

  const logPayload = {
    pathname,
    hasSession,
    sessionEmail: session?.email ?? null,
    redirect: redirectTarget,
    host: request.headers.get("host"),
    referer: request.headers.get("referer")
  };
  console.error("[middleware] guard", JSON.stringify(logPayload));

  if (redirectTarget && redirectTarget !== pathname) {
    const url = new URL(redirectTarget, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|assets|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)"]
};
