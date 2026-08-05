import Link from "next/link";
import { auth0, auth0Configured } from "@/lib/auth0";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const session = auth0Configured ? await auth0.getSession() : null;
  const user = session?.user;

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 text-white px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {auth0Configured ? (
          <>
            {user && (
              <p className="text-sm text-white/60">
                Signed in as <span className="font-bold text-white">{user.email || user.name}</span>
              </p>
            )}
            <h1 className="h2">Admin</h1>
            <p className="text-white/70">
              Manage news, articles, gallery, library, executives, events, and page content in
              Sanity Studio.
            </p>
            <Link
              href="/studio"
              className="inline-block px-8 py-4 bg-emerald-500 text-emerald-950 rounded-2xl font-bold uppercase tracking-widest hover:bg-white transition-all"
            >
              Open Sanity Studio
            </Link>
            <div>
              <a href="/auth/logout" className="text-xs text-white/50 hover:text-white underline">
                Sign out
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className="h2">Admin Not Configured</h1>
            <p className="text-white/70">
              Auth0 credentials haven&apos;t been added to <code>.env</code> yet, so admin sign-in
              is disabled. Once configured, this page will require sign-in.
            </p>
            <Link
              href="/studio"
              className="inline-block px-8 py-4 bg-emerald-500 text-emerald-950 rounded-2xl font-bold uppercase tracking-widest hover:bg-white transition-all"
            >
              Open Sanity Studio Directly
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
