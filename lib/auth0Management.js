// Minimal Auth0 Management API client — just enough to list signed-up users.
//
// This uses the client_credentials grant against the Management API. The web
// application's own client id/secret are reused, so no extra env vars are
// needed, but the app must be authorised for it in Auth0:
//
//   Auth0 dashboard -> Applications -> APIs -> Auth0 Management API
//     -> Machine to Machine Applications -> authorise this application
//     -> grant the `read:users` scope
//
// Without that authorisation Auth0 returns access_denied, which the admin page
// surfaces as a readable message rather than a crash.

const DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

let cachedToken = null; // { token, expiresAt }

async function getManagementToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const res = await fetch(`https://${DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: `https://${DOMAIN}/api/v2/`,
    }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.access_token) {
    const detail = data.error_description || data.error || `HTTP ${res.status}`;
    throw new Error(`Could not get a Management API token: ${detail}`);
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.token;
}

/**
 * Lists users, newest first.
 * Returns { users, error } — never throws, so the page can render either way.
 */
export async function listUsers({ perPage = 100 } = {}) {
  if (!DOMAIN || !CLIENT_ID || !CLIENT_SECRET) {
    return { users: [], error: "Auth0 credentials are not configured." };
  }

  try {
    const token = await getManagementToken();

    const params = new URLSearchParams({
      per_page: String(Math.min(perPage, 100)),
      page: "0",
      sort: "created_at:-1",
      include_totals: "false",
      fields: "user_id,email,name,nickname,picture,logins_count,created_at,last_login,email_verified",
      include_fields: "true",
    });

    const res = await fetch(`https://${DOMAIN}/api/v2/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const detail = data?.message || data?.error || `HTTP ${res.status}`;
      return { users: [], error: detail };
    }

    return { users: Array.isArray(data) ? data : [], error: null };
  } catch (err) {
    return { users: [], error: err.message };
  }
}
