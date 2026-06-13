# WorkCV UK

WorkCV UK is a Next.js CV builder for UK job seekers. The launch offer is simple: log in with an email code, build for free, and pay GBP 4.99 once to unlock the PDF download with no subscription.

## Structure

- `app/` Next.js app routes, SEO pages, API handlers, sitemap and robots
- `components/` editor and UI components
- `lib/` payment, database and shared server helpers
- `docs/` general project documents
- `research/` market research, source logs, and validation notes
- `specs/` product and launch specs
- `notes/` working notes and open questions

## Local Commands

- `npm run dev` starts the local Next.js dev server
- `npm run type-check` runs TypeScript validation
- `npm run build` builds the production app

## Confirmed decisions

- Brand/domain: `workcv.co.uk`
- Launch path: separate UK domain
- Editor access: email-code login required so CVs can be saved and reopened
- UK price: `GBP 4.99`
- Payment provider: Dodo Payments
- Dodo product ID: `pdt_0NgvxNXDilMTh3bpfLPq2`

## Production Deployment

The app is intended to deploy through GitHub Actions. GitHub builds the Docker image, pushes it to GHCR, then the Hetzner server pulls and restarts the prebuilt image. The server should not build the app from source.

Required GitHub repository secrets:

- `HETZNER_HOST`
- `HETZNER_USER`
- `HETZNER_SSH_KEY`
- `GHCR_READ_TOKEN` if the container package is private

Production env lives on the server at `/opt/workcv/.env`. Do not commit production secrets.

## Launch Priorities

1. Keep pricing clear and current
2. Preserve UK-correct CV structure and terminology
3. Keep the editor fast on mobile and desktop
4. Make no-subscription positioning visible on commercial pages
5. Maintain competitor pricing and cancellation pages with dated verification
