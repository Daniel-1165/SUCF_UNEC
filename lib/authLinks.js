// Content on this site is gated behind an account: links that would open
// articles, news, the library and so on point at Auth0's login screen instead,
// which also carries a "Sign up" link. `returnTo` sends the visitor onward to
// what they originally clicked once they're authenticated.
export function signInHref(returnTo = "/") {
  return `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
}

// Routes that stay open to everyone.
export const PUBLIC_PATHS = ["/", "/about", "/gallery"];

export function isPublicPath(path) {
  return PUBLIC_PATHS.includes(path);
}

// Returns the real path when it's public, otherwise the sign-in URL that
// returns the visitor there afterwards.
export function gatedHref(path) {
  return isPublicPath(path) ? path : signInHref(path);
}
