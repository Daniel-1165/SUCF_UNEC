import { auth0, auth0Configured } from "@/lib/auth0";

// Who counts as an admin. An email allowlist rather than Auth0 roles: the
// fellowship has a handful of admins, and this needs no RBAC setup in the
// dashboard — add or remove an address in ADMIN_EMAILS and redeploy.
//
// ADMIN_EMAILS=sucfunec01@gmail.com,someone@example.com
function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  if (!email) return false;
  const list = adminEmails();
  // With no allowlist configured, nobody is an admin. Failing closed is the
  // safe default — an empty list must not mean "everyone".
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}

export const adminAllowlistConfigured = adminEmails().length > 0;

// Resolves the current visitor's admin state for server components.
export async function getAdminState() {
  if (!auth0Configured) {
    return { configured: false, session: null, user: null, isAdmin: false };
  }

  const session = await auth0.getSession();
  const user = session?.user ?? null;

  return {
    configured: true,
    session,
    user,
    isAdmin: isAdminEmail(user?.email),
  };
}
