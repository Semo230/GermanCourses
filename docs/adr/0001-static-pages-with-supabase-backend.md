---
status: superseded by ADR-0004
---

# Static pages on Cloudflare with Supabase as the backend

The site needs an admin dashboard, admin sign-in, editable courses and booking orders. We are keeping the existing plain HTML pages deployed on Cloudflare Workers and adding Supabase for everything dynamic: Supabase Auth for the single admin account, Postgres tables for courses and orders, and row-level security so visitors can only insert while the admin can read and update. The dashboard is another static page (`admin.html`) that talks to Supabase directly.

## Considered Options

- **Rebuild on a framework (e.g. Next.js) with its own server**: rejected. It means a full rewrite and a build step for a small site with one admin, and Supabase already holds the contact messages.

## Consequences

- All access control lives in Supabase RLS policies, not in page code: the publishable key in the HTML is public, so a missing policy is a data leak.
- Anything that must not run in the visitor's browser (sending the admin email, secrets) has to run inside Supabase, e.g. an Edge Function.
