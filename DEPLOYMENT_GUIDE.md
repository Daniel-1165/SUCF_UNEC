# Deployment Guide

The site is a Next.js 16 (App Router) app using Sanity for content and Auth0 for admin login.

## Before deploying

- [ ] `pnpm run build` passes locally
- [ ] A Sanity project exists with its dataset set to **public** read
- [ ] An Auth0 application exists (Regular Web Application)

## 1. Import into Vercel

1. vercel.com → **Add New → Project** → import `Daniel-1165/SUCF_UNEC`.
2. Vercel auto-detects Next.js. **Leave the build settings alone.** In particular, do not add a `vercel.json` with SPA rewrites — the old Vite app needed one that rewrote every route to `/index.html`, and that breaks Next.js routing entirely (it was removed for this reason).
3. Set the Install Command to `pnpm install` if not auto-detected.

Do not commit the `.next` folder. Vercel builds it on their servers; a committed copy would be stale output from a local machine.

## 2. Environment variables

Add these in Vercel under **Settings → Environment Variables**. Values come from your local `.env` — see `.env.example` for the template.

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | Only needed for write scripts; safe to omit for the site |
| `AUTH0_DOMAIN` | e.g. `dev-abc123.us.auth0.com` (no `https://`) |
| `AUTH0_CLIENT_ID` | From the Auth0 application |
| `AUTH0_CLIENT_SECRET` | From the Auth0 application |
| `AUTH0_SECRET` | Generate with `openssl rand -hex 32` |
| `APP_BASE_URL` | Production URL, e.g. `https://sucfunec.vercel.app` |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Contact form |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Contact form |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Contact form |

**Never commit real values** — `.env` is gitignored deliberately.

## 3. Point Auth0 at the production URL

In the Auth0 application's **Settings**, add your production domain alongside localhost:

- **Allowed Callback URLs**: `https://YOUR-DOMAIN/auth/callback`
- **Allowed Logout URLs**: `https://YOUR-DOMAIN`
- **Allowed Web Origins**: `https://YOUR-DOMAIN`

Skipping this is the most common cause of login failing in production while working locally.

## 4. Allow the production domain in Sanity

sanity.io/manage → your project → **API → CORS Origins** → add your production URL. Without it, Sanity Studio at `/studio` won't load on the live site.

## After deploying

- `/` — content loads from Sanity
- `/studio` — sign in and edit content
- `/admin` — redirects to Auth0 login
- `/contact` — submit a test message and confirm delivery

Content edits appear on the live site within about a minute (60-second revalidation).
