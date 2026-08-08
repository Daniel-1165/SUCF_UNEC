import { NextResponse } from "next/server";
import { auth0, auth0Configured } from "@/lib/auth0";
import { isAdminEmail } from "@/lib/adminAuth";

// Tiny endpoint so the Navbar can decide what to show without forcing every
// public page to render dynamically. Returns no user data — just whether a
// session exists and whether it's an admin one. The flags only control what the
// nav renders; /admin re-checks server-side, so a forged response gains nothing.
export const dynamic = "force-dynamic";

export async function GET() {
  if (!auth0Configured) {
    return NextResponse.json({ isSignedIn: false, isAdmin: false });
  }

  try {
    const session = await auth0.getSession();
    return NextResponse.json({
      isSignedIn: Boolean(session),
      isAdmin: isAdminEmail(session?.user?.email),
    });
  } catch {
    return NextResponse.json({ isSignedIn: false, isAdmin: false });
  }
}
