import { NextResponse } from "next/server";
import { auth0, auth0Configured } from "@/lib/auth0";

// Tiny endpoint so the Navbar can show its Admin link without forcing every
// public page to render dynamically. Returns no user data — just whether a
// session exists.
export const dynamic = "force-dynamic";

export async function GET() {
  if (!auth0Configured) {
    return NextResponse.json({ isSignedIn: false });
  }

  try {
    const session = await auth0.getSession();
    return NextResponse.json({ isSignedIn: Boolean(session) });
  } catch {
    return NextResponse.json({ isSignedIn: false });
  }
}
