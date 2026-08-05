import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Auth0 is optional at build/dev time: without credentials the site still
// runs, /admin just shows an "unconfigured" notice instead of a login gate.
export const auth0Configured = Boolean(
  process.env.AUTH0_DOMAIN && process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET
);

export const auth0 = auth0Configured ? new Auth0Client() : null;
