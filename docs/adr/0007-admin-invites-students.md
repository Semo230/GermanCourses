---
status: accepted
---

# The admin invites students; she never handles passwords

Most students sign themselves up (ADR-0005), but Frau Asmaa can also invite a student from the dashboard: she enters their email, name, WhatsApp number and student group, and Supabase Auth emails them a link to choose their own password. Creating an account for someone else needs Supabase's secret key, so the invite goes through a Supabase Edge Function, `invite-student`, which runs on Supabase's servers, checks that the caller has `role: admin`, and refuses everyone else. The Next.js app keeps no secrets. Password-reset and confirmation emails don't need the function: the dashboard asks Supabase Auth for them with the publishable key, the same way a student could.

## Considered Options

- **Students only sign themselves up**: rejected. Some students (younger ones, or adults who aren't used to websites) find sign-up hard, and Frau Asmaa wanted a way to help them.
- **The admin sets a temporary password and sends it on WhatsApp**: rejected. Passwords would sit in chat histories, and the admin would know them.
- **Calling Supabase's admin API from the Next.js server**: rejected, because it would put the secret key in Cloudflare's build settings, against SPEC #2's rule that the app has no secrets.

## Consequences

- Nobody, including the admin, ever sees a student's password. The dashboard shows each student's sign-in method and account status instead, through a database function only the admin can call.
- Invite emails go through Gmail like the other Auth emails (ADR-0006) and share its daily limit.
- Invite links expire (at most 24 hours), so the dashboard has an "Invite again" button.
