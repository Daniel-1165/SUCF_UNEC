import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";
import { getAdminState } from "@/lib/adminAuth";
import { listUsers } from "@/lib/auth0Management";
import AdminShell from "../AdminShell";

export const metadata = { title: "Members" };

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminUsersPage() {
  const { configured, user, isAdmin } = await getAdminState();

  // Same gate as the dashboard — this page must never render member data to a
  // non-admin, so it checks independently rather than trusting navigation.
  if (!configured || !user || !isAdmin) {
    return (
      <AdminShell>
        <h1 className="text-base font-semibold text-neutral-900">Admin access required</h1>
        <p className="mt-2 text-sm text-neutral-600">
          This page is only available to admin accounts.
        </p>
        <Link
          href="/admin"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Go to admin
        </Link>
      </AdminShell>
    );
  }

  const { users, error } = await listUsers();

  return (
    <AdminShell wide>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-neutral-900">Members</h1>
          <p className="mt-1 text-xs text-neutral-500">
            {error ? "Could not load members" : `${users.length} signed up`}
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <FiArrowLeft size={12} /> Back
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm font-medium text-neutral-900">Auth0 didn&apos;t return the list</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">{error}</p>
          <p className="mt-3 text-xs leading-relaxed text-neutral-600">
            This usually means the application isn&apos;t authorised for the Management API yet. In
            Auth0: <strong>Applications → APIs → Auth0 Management API → Machine to Machine
            Applications</strong>, authorise this app and grant the <code>read:users</code> scope.
          </p>
        </div>
      ) : users.length === 0 ? (
        <p className="py-12 text-center text-sm text-neutral-500">No one has signed up yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left">
            <thead>
              <tr className="border-b border-neutral-200 text-[11px] font-medium text-neutral-500">
                <th scope="col" className="pb-2 pr-4 font-medium">
                  Member
                </th>
                <th scope="col" className="pb-2 pr-4 font-medium">
                  Joined
                </th>
                <th scope="col" className="pb-2 pr-4 font-medium">
                  Last seen
                </th>
                <th scope="col" className="pb-2 text-right font-medium">
                  Logins
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      {u.picture ? (
                        <Image
                          src={u.picture}
                          alt=""
                          width={28}
                          height={28}
                          className="h-7 w-7 shrink-0 rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-600">
                          {(u.name || u.email || "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium text-neutral-900">
                          {u.name || u.nickname || "—"}
                        </span>
                        {u.email && (
                          <span className="block truncate text-[11px] text-neutral-500">
                            {u.email}
                            {u.email_verified === false && " · unverified"}
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[11px] text-neutral-600">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="py-3 pr-4 text-[11px] text-neutral-600">
                    {formatDate(u.last_login)}
                  </td>
                  <td className="py-3 text-right text-[11px] tabular-nums text-neutral-600">
                    {u.logins_count ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
