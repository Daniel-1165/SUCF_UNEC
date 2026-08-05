import { NextResponse } from "next/server";
import { auth0, auth0Configured } from "@/lib/auth0";

// Auth0's middleware owns the /auth/* routes (login, logout, callback) and
// refreshes the session cookie. Without credentials it's skipped entirely so
// the public site still works.
//
// Note /admin is intentionally NOT redirected here: the page renders its own
// in-app sign-in card when there's no session, which keeps the user on the
// site rather than bouncing them straight out to Auth0. The page itself only
// reveals admin content once a session exists, so it is still gated.
export async function middleware(request) {
  if (!auth0Configured) return NextResponse.next();
  return auth0.middleware(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
