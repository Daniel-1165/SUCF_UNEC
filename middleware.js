import { NextResponse } from "next/server";
import { auth0, auth0Configured } from "@/lib/auth0";

// Auth0's middleware owns the /auth/* routes (login, logout, callback) and
// refreshes the session cookie. Without credentials it's skipped entirely so
// the public site still works.
export async function middleware(request) {
  if (!auth0Configured) return NextResponse.next();

  const authRes = await auth0.middleware(request);

  // Let Auth0 handle its own /auth/* endpoints.
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  // Gate the admin area.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?returnTo=${request.nextUrl.pathname}`, request.url)
      );
    }
  }

  return authRes;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
