# EK — El Kurdi

Marketing site for EK (El Kurdi): custom web & mobile app development. Single
landing page with a contact form that delivers inquiries to
**contact@elkurdi.co** via Resend.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- Resend for contact-form email delivery

## Local development

```bash
npm install
copy .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev
```

Without `RESEND_API_KEY` the site runs fine, but the contact form returns a
friendly "email us directly" error instead of sending.

## Environment variables

| Variable         | Required | Default                             |
| ---------------- | -------- | ----------------------------------- |
| `RESEND_API_KEY` | yes      | —                                   |
| `CONTACT_TO`     | no       | `contact@elkurdi.co`                |
| `CONTACT_FROM`   | no       | `EK Website <noreply@scholify.krd>` |

`CONTACT_FROM` must use a domain verified in Resend. That is **scholify.krd**
— elkurdi.co is not on the Resend account (plan limit). Inbound mail to
`contact@elkurdi.co` is handled separately by Cloudflare Email Routing, which
forwards it to Gmail.

## Deploy (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Set `RESEND_API_KEY` in Project → Settings → Environment Variables.
3. Point the desired domain (e.g. `elkurdi.co` or `ek.elkurdi.co`) at the project.
