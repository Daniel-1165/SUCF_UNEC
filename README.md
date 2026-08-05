# SUCF UNEC Website

Official website for the Scripture Union Campus Fellowship (SUCF), University of Nigeria Enugu Campus (UNEC).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **CMS**: Sanity — all content is edited in Sanity Studio, embedded at `/studio`
- **Auth**: Auth0 — gates the `/admin` area
- **Styling**: Tailwind CSS v4, Framer Motion
- **Typography**: Inter (single typeface across the site)
- **Email**: EmailJS (contact form; no database)
- **Icons**: React Icons (Fi)

## Getting Started

### 1. Prerequisites

- Node.js 20+
- **pnpm** (this project uses pnpm — `npm install` is known to fail resolving the Sanity dependency tree)
- A Sanity project and an Auth0 application

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### 3. Install & run

```bash
pnpm install
pnpm run dev
```

The site runs at http://localhost:3000, Sanity Studio at http://localhost:3000/studio.

## Content Management

All content lives in Sanity. Open `/studio`, sign in with your Sanity account, and edit:

| Type | What it drives |
| --- | --- |
| News / Article | News and article pages (rich text with inline images) |
| Gallery Image | Gallery page |
| Book | Library page |
| Executive | Executives page |
| Fellowship Event | Homepage countdown |
| Weekly Post | Homepage weekly spotlight |
| About Page / Activities Page | Editable copy on those pages |

Content is fetched with a 60-second revalidation window, so edits appear on the live site within about a minute.

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). Remember to set the same environment variables in your hosting provider, and to add your production URLs to the Auth0 application's Allowed Callback/Logout/Web Origin settings.
