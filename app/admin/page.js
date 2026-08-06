import Link from "next/link";
import Image from "next/image";
import { auth0, auth0Configured } from "@/lib/auth0";

export const metadata = { title: "Admin" };

function Shell({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/logo.png" alt="SUCF UNEC" width={40} height={40} className="h-10 w-auto" />
            <span className="text-lg font-bold tracking-tight text-neutral-900">SUCF UNEC</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">{children}</div>

        <p className="text-center text-xs text-neutral-500 mt-6">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const session = auth0Configured ? await auth0.getSession() : null;
  const user = session?.user;

  if (!auth0Configured) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold text-neutral-900 mb-2">Admin not configured</h1>
        <p className="text-sm text-neutral-600 mb-6">
          Auth0 credentials haven&apos;t been added to <code className="text-xs">.env</code> yet, so
          sign-in is disabled.
        </p>
        <Link
          href="/studio"
          className="block w-full text-center px-5 py-3 bg-neutral-900 text-white rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors"
        >
          Open Sanity Studio
        </Link>
      </Shell>
    );
  }

  // Signed out: show an in-app sign-in card rather than bouncing straight to Auth0.
  if (!user) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Sign in</h1>
        <p className="text-sm text-neutral-600 mb-6">
          Admin access for managing fellowship content.
        </p>
        <a
          href="/auth/login?returnTo=/admin"
          className="block w-full text-center px-5 py-3 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors"
        >
          Continue to sign in
        </a>
        <p className="text-xs text-neutral-500 mt-4 text-center">
          Secured by Auth0
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center gap-3 mb-6">
        {user?.picture ? (
          <Image
            src={user.picture}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
            {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">{user?.name || "Signed in"}</p>
          {user?.email && <p className="text-xs text-neutral-500 truncate">{user.email}</p>}
        </div>
      </div>

      <p className="text-sm text-neutral-600 mb-6">
        Manage news, articles, gallery, library, executives, events and page content.
      </p>

      <Link
        href="/studio"
        className="block w-full text-center px-5 py-3 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors"
      >
        Open Sanity Studio
      </Link>

      <a
        href="/auth/logout"
        className="block w-full text-center px-5 py-3 mt-3 text-neutral-600 rounded-xl font-medium text-sm border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
      >
        Sign out
      </a>
    </Shell>
  );
}
