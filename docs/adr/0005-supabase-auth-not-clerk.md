---
status: accepted
---

# Sign-in with Supabase Auth, not Clerk

Students and the admin sign in with Supabase Auth (email + password, or Google), in the same Supabase project as the data. Clerk was tried (`Desktop\Vibe Coding\Day 3\clerk-nextjs`), but its production setup requires a domain we own, and the site stays on the free `workers.dev` address. The admin is marked with `role: admin` in her account's `app_metadata`, which only the server can set.

## Considered Options

- **Clerk**: rejected for now because of the domain requirement. Worth revisiting if the site buys a domain.

## Consequences

- Students sign themselves up, so "Allow new users to sign up" stays **on** in Supabase Auth, the opposite of the original test wizard's stage 5.
- Sign-up confirmation and password-reset emails go through Gmail as Supabase Auth's custom SMTP server (ADR-0006), because Supabase's built-in email only reaches team members.
