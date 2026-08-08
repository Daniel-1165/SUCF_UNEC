import Link from "next/link";
import Image from "next/image";
import { FiUsers, FiEdit3, FiArrowRight } from "react-icons/fi";
import { getAdminState, adminAllowlistConfigured } from "@/lib/adminAuth";
import AdminShell from "./AdminShell";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const { configured, user, isAdmin } = await getAdminState();

  // Auth0 not wired up yet.
  if (!configured) {
    return (
      <AdminShell>
        <h1 className="text-base font-semibold text-neutral-900">Admin not configured</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Auth0 credentials haven&apos;t been added to <code className="text-xs">.env</code> yet.
        </p>
      </AdminShell>
    );
  }

  // Signed out.
  if (!user) {
    return (
      <AdminShell>
        <h1 className="text-base font-semibold text-neutral-900">Sign in</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Admin access for managing fellowship content.
        </p>
        <a
          href="/auth/login?returnTo=/admin"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Continue to sign in
        </a>
        <p className="mt-4 text-center text-[11px] text-neutral-500">Secured by Auth0</p>
      </AdminShell>
    );
  }

  // Signed in, but not on the allowlist. Say so plainly rather than pretending
  // the page doesn't exist — they're a real member, just not an admin.
  if (!isAdmin) {
    return (
      <AdminShell>
        <h1 className="text-base font-semibold text-neutral-900">Not an admin account</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          You&apos;re signed in as{" "}
          <span className="font-medium text-neutral-900">{user.email || user.name}</span>, which
          doesn&apos;t have admin access.
        </p>
        {!adminAllowlistConfigured && (
          <p className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600">
            No admin list is configured yet. Add <code>ADMIN_EMAILS</code> to the environment with
            the addresses that should have access.
          </p>
        )}
        <div className="mt-6 space-y-2">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Back to site
          </Link>
          <a
            href="/auth/logout"
            className="flex w-full items-center justify-center rounded-full border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
          >
            Sign out
          </a>
        </div>
      </AdminShell>
    );
  }

  // Admin dashboard.
  return (
    <AdminShell wide>
      <div className="mb-8 flex items-center gap-3">
        {user.picture ? (
          <Image
            src={user.picture}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 font-semibold text-emerald-700">
            {(user.name || user.email || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-900">{user.name || "Admin"}</p>
          {user.email && <p className="truncate text-xs text-neutral-500">{user.email}</p>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/users"
          className="group rounded-xl border border-neutral-200 p-5 transition-colors hover:border-neutral-300"
        >
          <FiUsers className="text-lg text-emerald-700" />
          <p className="mt-3 text-sm font-medium text-neutral-900">Members</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            Everyone who has signed up for an account.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            View list <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/studio"
          className="group rounded-xl border border-neutral-200 p-5 transition-colors hover:border-neutral-300"
        >
          <FiEdit3 className="text-lg text-emerald-700" />
          <p className="mt-3 text-sm font-medium text-neutral-900">Content</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            News, articles, gallery, library, executives and page copy.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            Open Studio <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-5">
        <a
          href="/auth/logout"
          className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Sign out
        </a>
      </div>
    </AdminShell>
  );
}
