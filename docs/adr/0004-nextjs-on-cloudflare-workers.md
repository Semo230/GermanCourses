---
status: accepted
---

# Rebuild the site in Next.js, still on Cloudflare Workers

Students now have accounts, book courses while signed in, and save quiz results, so the site needs server-side pages and sign-in checks that plain HTML pages can't do well. We are rebuilding it in Next.js and keeping it on Cloudflare Workers through the OpenNext adapter (`@opennextjs/cloudflare`), so the address and "push to main publishes" stay the same. This replaces ADR-0001. See `SPEC-2.md`.

## Considered Options

- **Vercel**: rejected. Its free plan doesn't allow commercial sites, and the site's address would change.
- **Keep plain HTML pages (ADR-0001)**: rejected once students needed accounts, a personal area and protected pages.

## Consequences

- The Workers free plan limits the built code to 3 MiB compressed. If the app outgrows it, trim dependencies or move to the Workers paid plan.
- GitHub Pages can't run Next.js, so it is turned off at launch. The second Worker `germancoursesss` gets the same OpenNext build settings.
- The Next.js app holds no secret key: it uses only the Supabase URL and publishable key, and every permission comes from row-level security.
