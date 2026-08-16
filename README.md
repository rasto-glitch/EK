# EK — El Kurdi

Marketing site for EK (El Kurdi): custom web & mobile app development. Single
landing page with a contact form that delivers inquiries to
**contact@elkurdi.co**'s inbox (a Gmail address behind Cloudflare Email
Routing).

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- Cloudflare Worker + Email Routing for contact-form delivery (no paid email
  service)

## How contact-form delivery works

```
visitor → /api/contact (Vercel) → ek-contact-worker (Cloudflare)
        → Email Routing send-email binding → verified Gmail destination
```

- The Worker lives in [cloudflare/contact-worker](cloudflare/contact-worker)
  and sends via Email Routing's free send-email binding. It can only deliver
  to **verified destination addresses** on the Cloudflare account (Email
  Routing → Destination addresses).
- Regular inbound mail to `contact@elkurdi.co` is forwarded to the same Gmail
  by a Cloudflare Email Routing rule — independent of the form.
- The `/api/contact` route validates + forwards server-to-server, so the
  Worker URL is never exposed to the browser. A honeypot field silently drops
  bot submissions.

## Local development

```bash
npm install
copy .env.example .env.local   # then fill in CONTACT_WORKER_URL
npm run dev
```

Without `CONTACT_WORKER_URL` the site runs fine, but the contact form returns
a friendly "email us directly" error instead of sending.

## Environment variables (site)

| Variable                | Required | Purpose                                        |
| ----------------------- | -------- | ---------------------------------------------- |
| `CONTACT_WORKER_URL`    | yes      | Deployed worker URL (`https://…workers.dev`)   |
| `CONTACT_WORKER_SECRET` | no       | Shared secret; must match worker's `CONTACT_SECRET` |

## Deploying the worker

```bash
cd cloudflare/contact-worker
npm install
npx wrangler login      # once
npx wrangler deploy
```

Config lives in `wrangler.toml` (`CONTACT_TO` must be a verified destination
address; `CONTACT_FROM` must be on a zone with Email Routing enabled).

## Deploy (Vercel)

1. Push the repo to GitHub and import it in Vercel (root directory `./`).
2. Set `CONTACT_WORKER_URL` in Project → Settings → Environment Variables.
3. Point the desired domain (e.g. `elkurdi.co` or `ek.elkurdi.co`) at the project.
